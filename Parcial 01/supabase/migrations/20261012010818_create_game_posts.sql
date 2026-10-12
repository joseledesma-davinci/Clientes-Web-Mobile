CREATE TABLE game_posts (

  id         bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

  -- Referencia al autor del post (usuario registrado)
  user_id    uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

  -- email text NOT NULL,

  -- Título del videojuego reseñado
  game_title text NOT NULL,

  -- Plataforma en la que se jugó (PC, PS5, Xbox Series X, Nintendo Switch, etc.)
  platform   text NOT NULL,

  -- Puntuación del 1 al 5 (estrellas)
  rating     smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),

  -- Contenido de la reseña u opinión
  content    text NOT NULL,

  -- Fecha y hora de creación (por defecto: ahora)
  created_at timestamptz DEFAULT now()
);

-- Índice para consultas filtradas por usuario (ej: "mis posts")
--CREATE INDEX idx_game_posts_user_id ON game_posts(user_id);

-- Índice para ordenar el feed por fecha de creación descendente
--CREATE INDEX idx_game_posts_created_at ON game_posts(created_at DESC);

-- Habilitamos Realtime para que los INSERT se propaguen a los clientes suscritos.
-- Esto es lo que permite que el feed se actualice en vivo sin recargar la página.
ALTER PUBLICATION supabase_realtime ADD TABLE game_posts;