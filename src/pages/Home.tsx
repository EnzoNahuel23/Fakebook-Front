import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { Publicacion, Etiqueta } from "../services/api";

export default function Home() {
  const [posts, setPosts] = useState<Publicacion[]>([]);
  const [tags, setTags] = useState<Etiqueta[]>([]);
  const [commentsCount, setCommentsCount] = useState<Record<string, number>>({});
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.publicaciones.listar(), api.etiquetas.listar()])
      .then(([postsData, tagsData]) => {
        setPosts(postsData);
        setTags(tagsData);
        return Promise.all(
          postsData.map((p) =>
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
  }, []);

  const filteredPosts = selectedTag
    ? posts.filter((p) => p.tags?.some((t) => t.description === selectedTag))
    : posts;

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status" /></div>;

  return (
    <div>
      <div className="fb-banner">
        <h1>Fakebook</h1>
        <p>El único lugar del mundo donde Mark Zuckerberg te espía con los ojos cerrados.</p>
      </div>

      <div className="fb-filter-bar">
        <label className="form-label">Filtrar por etiqueta:</label>
        <select className="form-select" value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
          <option value="">Todas las etiquetas</option>
          {tags.map((t) => <option key={t._id} value={t.description}>{t.description}</option>)}
        </select>
      </div>

      {filteredPosts.length === 0 && <p className="text-muted text-center">No hay publicaciones aún.</p>}
      <div className="fb-feed">
        {filteredPosts.map((post) => {
          const userObj = typeof post.user === "object" ? post.user : null;
          const cantComentarios = commentsCount[post._id] ?? 0;
          return (
            <div key={post._id} className="mb-3">
              <div className="fb-card h-100">
                <div className="fb-card-header">
                  <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(userObj?.nickName || "anon")}&backgroundColor=b6e3f4`} alt="" width={32} height={32} style={{ borderRadius: "50%" }} />
                  <div>
                    <span className="fb-name">{userObj?.nickName ?? "Anónimo"}</span>
                  </div>
                </div>
                <div className="fb-card-body">
                  <p>{post.description}</p>
                  <div>
                    {post.tags?.map((t) => <span key={t._id} className="fb-tag">{t.description}</span>)}
                  </div>
                </div>
                {post.images && post.images.length > 0 && (
                  <Link to={`/post/${post._id}`} className="fb-card-image">
                    <img src={post.images[0]} alt="Post" />
                  </Link>
                )}
                <div className="fb-card-footer">
                  <span className="text-muted" style={{ fontSize: "0.85rem" }}>{cantComentarios} comentario{cantComentarios !== 1 ? "s" : ""}</span>
                  <Link to={`/post/${post._id}`} className="fb-btn fb-btn-sm">Ver más</Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
