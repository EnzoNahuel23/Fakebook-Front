import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fb-header mb-3">
      <div className="container-fluid d-flex align-items-center justify-content-between py-1">
        <div className="d-flex align-items-center gap-3">
          <Link className="navbar-brand" to="/">fakebook <span className="fb-year">2009</span></Link>
          {user && (
            <>
              <Link className="nav-link" to="/">Inicio</Link>
              <Link className="nav-link" to="/profile">Perfil</Link>
              <Link className="nav-link" to="/create-post">Nuevo Post</Link>
            </>
          )}
        </div>
        <div className="d-flex align-items-center gap-2">
          {user ? (
            <>
              <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(user.nickName)}&backgroundColor=b6e3f4`} alt="" width={24} height={24} style={{ borderRadius: "50%" }} />
              <span className="navbar-text">{user.nickName}</span>
              <button className="btn-link" onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">Iniciar sesión</Link>
              <Link className="nav-link" to="/register">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
