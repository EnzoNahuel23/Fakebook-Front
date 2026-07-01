import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";

export default function Register() {
  const [nickName, setNickName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nickName.trim()) {
      setError("El nickName es obligatorio");
      return;
    }

    setLoading(true);
    try {
      await api.usuarios.crear({ nickName: nickName.trim() });
      setSuccess("Cuenta creada con éxito. Redirigiendo al login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5 col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="text-center mb-3" style={{ color: "#3B5998" }}>Crear cuenta en Fakebook</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">NickName</label>
                <input className="form-control" value={nickName} onChange={(e) => setNickName(e.target.value)} placeholder="Elegí un nickName" />
              </div>
              <button className="btn btn-dark w-100" disabled={loading}>
                {loading ? "Registrando..." : "Crear cuenta"}
              </button>
            </form>
            <p className="text-center mt-3 mb-0">
              <Link to="/login">Ya tengo cuenta</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
