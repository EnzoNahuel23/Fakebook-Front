import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function Login() {
  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nickName.trim() || !password.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    try {
      const users = await api.usuarios.listar();
      const found = users.find((u) => u.nickName === nickName.trim());
      if (!found) {
        setError("Usuario no encontrado");
        setLoading(false);
        return;
      }
      if (password !== "123456") {
        setError("Contraseña incorrecta");
        setLoading(false);
        return;
      }
      login(found);
      navigate("/");
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5 col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="text-center mb-3" style={{ color: "#3B5998" }}>Iniciar sesión en Fakebook</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">NickName</label>
                <input className="form-control" value={nickName} onChange={(e) => setNickName(e.target.value)} placeholder="Tu nickName" />
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña (123456)" />
              </div>
              <button className="btn btn-dark w-100" disabled={loading}>
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </button>
            </form>
            <p className="text-center mt-3 mb-0">
              <Link to="/register">Crear cuenta nueva</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
