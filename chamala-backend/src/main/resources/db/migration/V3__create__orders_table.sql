CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id), -- ajuste para UUID se sua PK de categories for UUID
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address_reference VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices para otimizar busca geográfica e filtros
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_category ON orders(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_coords ON orders(latitude, longitude);