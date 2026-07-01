const API = "http://localhost:3000/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "Error de conexión");
    throw new Error(msg);
  }
  return res.json();
}

export interface Usuario {
  _id: string;
  nickName: string;
  followers?: string[];
  following?: string[];
}

export interface Publicacion {
  _id: string;
  description: string;
  images: string[];
  tags: Etiqueta[];
  user: Usuario | string;
  fechaPublicacion?: string;
}

export interface Etiqueta {
  _id: string;
  description: string;
}

export interface Comentario {
  _id: string;
  text: string;
  user: Usuario | string;
  post: string;
  fechaPublicacion?: string;
}

export const api = {
  usuarios: {
    listar: () => request<Usuario[]>(`${API}/usuarios`),
    crear: (data: { nickName: string }) =>
      request<Usuario>(`${API}/usuarios`, { method: "POST", body: JSON.stringify(data) }),
  },

  publicaciones: {
    listar: (userId?: string) => request<Publicacion[]>(`${API}/publicaciones${userId ? `?userId=${userId}` : ""}`),
    obtener: (id: string) => request<Publicacion>(`${API}/publicaciones/${id}`),
    crear: (data: { description: string; user: string; images?: string[] }) =>
      request<Publicacion>(`${API}/publicaciones`, { method: "POST", body: JSON.stringify(data) }),
    agregarEtiquetas: (id: string, tagIds: string[]) =>
      request<Publicacion>(`${API}/publicaciones/${id}/etiquetas`, {
        method: "PUT", body: JSON.stringify({ tagIds }),
      }),
  },

  comentarios: {
    listarPorPublicacion: (postId: string) =>
      request<Comentario[]>(`${API}/comentarios/publicacion/${postId}`),
    crear: (data: { text: string; user: string; post: string }) =>
      request<Comentario>(`${API}/comentarios`, { method: "POST", body: JSON.stringify(data) }),
  },

  etiquetas: {
    listar: () => request<Etiqueta[]>(`${API}/etiquetas`),
  },
};
