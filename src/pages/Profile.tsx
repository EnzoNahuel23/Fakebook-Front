import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, type Publicacion } from "../services/api";

export default function Profile() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<Publicacion[]>([]);
  const [commentsCount, setCommentsCount] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.publicaciones.listar(user._id)
      .then((userPosts) => {
        setPosts(userPosts);
        return Promise.all(
          userPosts.map((p) =>
            api.comentarios.listarPorPublicacion(p._id).then((c) => ({ postId: p._id, count: c.length }))
          )
        );
      })
      .then((results) => {
        const map: Record<string, number> = {};
        for (const r of results) map[r.postId] = r.count;
        setCommentsCount(map);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status" /></div>;

  return (
    <div style={{ maxWidth: 540, margin: "0 auto" }}>
      <div className="fb-profile-header">
        <div className="d-flex align-items-center gap-3">
          <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(user?.nickName || "anon")}&backgroundColor=b6e3f4`} alt="" width={64} height={64} style={{ borderRadius: "50%" }} />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: "1.3rem", margin: 0 }}>{user?.nickName}</h2>
            <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>{posts.length} publicaciones</p>
          </div>
          <button className="fb-btn fb-btn-danger fb-btn-sm" onClick={logout}>Cerrar sesión</button>
        </div>
      </div>

      <h4 style={{ fontSize: "1rem", marginBottom: 12 }}>Mis publicaciones</h4>
      {posts.length === 0 && <p className="text-muted" style={{ fontSize: "0.9rem" }}>Aún no hiciste ninguna publicación.</p>}
      {posts.map((post) => {
        const postUser = typeof post.user === "object" ? post.user : null;
        const cantComentarios = commentsCount[post._id] ?? 0;
        return (
          <div key={post._id} className="fb-card">
            <div className="fb-card-header">
              <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(postUser?.nickName || "anon")}&backgroundColor=b6e3f4`} alt="" width={32} height={32} style={{ borderRadius: "50%" }} />
              <div>
                <span className="fb-name">{postUser?.nickName ?? "Anónimo"}</span>
              </div>
            </div>
            <div className="fb-card-body">
              <p>{post.description}</p>
              <div>
                {post.tags?.map((t) => <span key={t._id} className="fb-tag">{t.description}</span>)}
              </div>
            </div>
            {post.images && post.images.length > 0 && (
              <div className="fb-card-image">
                <img src={post.images[0]} alt="Post" />
              </div>
            )}
            <div className="fb-card-footer">
              <span className="text-muted" style={{ fontSize: "0.85rem" }}>{cantComentarios} comentario{cantComentarios !== 1 ? "s" : ""}</span>
              <Link to={`/post/${post._id}`} className="fb-btn fb-btn-sm">Ver más</Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
