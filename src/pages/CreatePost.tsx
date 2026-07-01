import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, type Etiqueta } from "../services/api";

export default function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [availableTags, setAvailableTags] = useState<Etiqueta[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.etiquetas.listar().then(setAvailableTags).catch(console.error);
  }, []);

  const handleImageChange = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const addImageField = () => setImageUrls((prev) => [...prev, ""]);

  const removeImageField = (index: number) => {
    if (imageUrls.length > 1) setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!description.trim()) {
      setError("La descripción es obligatoria");
      return;
    }
    if (description.trim().length < 5) {
      setError("La descripción debe tener al menos 5 caracteres");
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      const validUrls = imageUrls.filter((url) => url.trim() !== "");

      const post = await api.publicaciones.crear({
        description: description.trim(),
        user: user._id,
        images: validUrls.length > 0 ? validUrls : undefined,
      });

      if (selectedTags.length > 0) {
        await api.publicaciones.agregarEtiquetas(post._id, selectedTags);
      }

      setSuccess("Publicación creada con éxito");
      setTimeout(() => navigate("/profile"), 1000);
    } catch {
      setError("Error al crear la publicación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 540, margin: "0 auto" }}>
      <div className="fb-card">
        <div className="card-body p-4">
          <h2 style={{ color: "#3B5998", fontSize: "1.2rem", marginBottom: 16 }}>Nueva publicación</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">¿Qué estás pensando?</label>
              <textarea className="form-control" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Compartí algo (mín. 5 caracteres)..." />
            </div>

            <div className="mb-3">
              <label className="form-label">URLs de imágenes (opcional)</label>
              {imageUrls.map((url, i) => (
                <div key={i} className="input-group mb-2">
                  <input className="form-control" value={url} onChange={(e) => handleImageChange(i, e.target.value)} placeholder="https://..." />
                  <button type="button" className="fb-btn fb-btn-sm fb-btn-danger" onClick={() => removeImageField(i)} disabled={imageUrls.length === 1}>X</button>
                </div>
              ))}
              <button type="button" className="fb-btn fb-btn-outline fb-btn-sm mt-1" onClick={addImageField}>+ Agregar otra imagen</button>
            </div>

            <div className="mb-3">
              <label className="form-label">Etiquetas</label>
              <div>
                {availableTags.map((tag) => (
                  <div key={tag._id} className="form-check form-check-inline">
                    <input className="form-check-input" type="checkbox" id={`tag-${tag._id}`} checked={selectedTags.includes(tag._id)} onChange={() => toggleTag(tag._id)} />
                    <label className="form-check-label" style={{ fontSize: "0.85rem" }} htmlFor={`tag-${tag._id}`}>{tag.description}</label>
                  </div>
                ))}
              </div>
            </div>

            <button className="fb-btn" disabled={loading}>
              {loading ? "Publicando..." : "Publicar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
