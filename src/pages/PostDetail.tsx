import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, type Comentario } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<Awaited<ReturnType<typeof api.publicaciones.obtener>> | null>(null);
  const [comments, setComments] = useState<Comentario[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([api.publicaciones.obtener(id), api.comentarios.listarPorPublicacion(id)])
      .then(([postData, commentsData]) => {
        setPost(postData);
        setComments(commentsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!text.trim()) {
      setError("El comentario no puede estar vacío");
      return;
    }
    if (!user) {
      setError("Debés iniciar sesión para comentar");
      return;
    }
    try {
      const newComment = await api.comentarios.crear({
        text: text.trim(),
        user: user._id,
        post: id!,
      });
      newComment.user = { _id: user._id, nickName: user.nickName };
      setComments((prev) => [...prev, newComment]);
      setText("");
    } catch (err) {
      console.error("Error al comentar:", err);
      setError(err instanceof Error ? err.message : "Error al enviar el comentario");
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status" /></div>;
  if (!post) return <p className="text-center mt-5">Publicación no encontrada</p>;

  const userObj = typeof post.user === "object" ? post.user : null;

  return (
    <div className="fb-detail">
      <div className="fb-card">
        <div className="fb-card-header">
          <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(userObj?.nickName || "anon")}&backgroundColor=b6e3f4`} alt="" width={32} height={32} style={{ borderRadius: "50%" }} />
          <div>
            <span className="fb-name">{userObj?.nickName ?? "Anónimo"}</span>
          </div>
        </div>
        <div className="fb-card-body">
          <p style={{ fontSize: "1.05rem" }}>{post.description}</p>
          <div>
            {post.tags?.map((t) => <span key={t._id} className="fb-tag">{t.description}</span>)}
          </div>
        </div>
        {post.images && post.images.length > 0 && (
          <div>
            {post.images.map((img, i) => (
              <div key={i} className="fb-card-image">
                <img src={img} alt={`Imagen ${i + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      <h4 style={{ fontSize: "1rem", marginBottom: 12 }}>Comentarios ({comments.length})</h4>
      {comments.length === 0 && <p className="text-muted" style={{ fontSize: "0.9rem" }}>No hay comentarios aún.</p>}
      {comments.map((c) => {
        const commentUser = typeof c.user === "object" ? c.user : null;
        return (
          <div key={c._id} className="fb-comment d-flex gap-2">
            <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(commentUser?.nickName || "anon")}&backgroundColor=b6e3f4`} alt="" width={24} height={24} style={{ borderRadius: "50%", marginTop: 2, flexShrink: 0 }} />
            <div>
              <strong>{commentUser?.nickName ?? "Anónimo"}</strong>
              <p>{c.text}</p>
            </div>
          </div>
        );
      })}

      {user ? (
        <form onSubmit={handleComment} className="mt-3" style={{ background: "#fff", border: "1px solid #d9d9d9", borderRadius: 3, padding: 14 }}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-2">
            <textarea className="form-control" rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribí un comentario..." />
          </div>
          <button className="fb-btn">Comentar</button>
        </form>
      ) : (
        <p className="text-muted mt-3" style={{ fontSize: "0.9rem" }}>
          <Link to="/login">Iniciá sesión</Link> para comentar.
        </p>
      )}
    </div>
  );
}
