-- Schema do ChamaLÁ, espelhando o banco do Supabase (fonte de verdade em 19/11/2026).
-- No Supabase o Flyway fica desligado: estas migrações servem para bancos novos
-- (PostGIS local do docker-compose e testes com Testcontainers).

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE categories (
    id    SERIAL PRIMARY KEY,
    name  VARCHAR(255) NOT NULL UNIQUE,
    icon  VARCHAR(255) NOT NULL,
    color VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone         VARCHAR(255),
    role          VARCHAR(255) NOT NULL CHECK (role IN ('CLIENT', 'PROFESSIONAL', 'ADMIN')),
    status        VARCHAR NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED')),
    text_size     VARCHAR NOT NULL DEFAULT 'normal',
    high_contrast BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    rating        DOUBLE PRECISION DEFAULT 0.0,
    review_count  INTEGER DEFAULT 0
);

CREATE TABLE professional_profiles (
    user_id             UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    bio                 TEXT,
    service_radius_km   INTEGER NOT NULL DEFAULT 10,
    base_location       GEOMETRY(Point, 4326),
    neighborhood        VARCHAR,
    city                VARCHAR,
    available           BOOLEAN NOT NULL DEFAULT FALSE,
    verification_status VARCHAR NOT NULL DEFAULT 'NOT_SUBMITTED'
        CHECK (verification_status IN ('NOT_SUBMITTED', 'PENDING', 'APPROVED', 'REJECTED')),
    rating_avg          NUMERIC NOT NULL DEFAULT 0,
    rating_count        INTEGER NOT NULL DEFAULT 0,
    cancel_min_hours    INTEGER NOT NULL DEFAULT 24 CHECK (cancel_min_hours >= 0),
    cancel_fee_pct      INTEGER NOT NULL DEFAULT 10 CHECK (cancel_fee_pct BETWEEN 10 AND 20),
    deposit_pct         INTEGER NOT NULL DEFAULT 0 CHECK (deposit_pct BETWEEN 0 AND 100)
);

CREATE TABLE professional_categories (
    professional_id UUID NOT NULL REFERENCES professional_profiles(user_id) ON DELETE CASCADE,
    category_id     INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    is_primary      BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (professional_id, category_id)
);

CREATE TABLE professional_services (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID NOT NULL REFERENCES professional_profiles(user_id) ON DELETE CASCADE,
    category_id     INTEGER NOT NULL REFERENCES categories(id),
    title           VARCHAR NOT NULL,
    description     TEXT,
    price_cents     INTEGER NOT NULL CHECK (price_cents > 0),
    active          BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE verification_documents (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id  UUID NOT NULL REFERENCES professional_profiles(user_id) ON DELETE CASCADE,
    type             VARCHAR NOT NULL
        CHECK (type IN ('SELFIE', 'ID_FRONT', 'ID_BACK', 'CERTIFICATE', 'EXTRA', 'PORTFOLIO')),
    storage_path     VARCHAR NOT NULL,
    status           VARCHAR NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    reviewed_by      UUID REFERENCES users(id),
    reviewed_at      TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE service_requests (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type             VARCHAR NOT NULL CHECK (type IN ('FIXED', 'QUOTE')),
    client_id        UUID NOT NULL REFERENCES users(id),
    professional_id  UUID NOT NULL REFERENCES professional_profiles(user_id),
    service_id       UUID REFERENCES professional_services(id),
    category_id      INTEGER NOT NULL REFERENCES categories(id),
    description      TEXT,
    scheduled_date   DATE NOT NULL,
    time_slot        TIME NOT NULL,
    address_text     VARCHAR NOT NULL,
    location         GEOMETRY(Point, 4326),
    notes            TEXT,
    status           VARCHAR NOT NULL CHECK (status IN ('PENDING', 'QUOTE_REQUESTED', 'QUOTED', 'CONFIRMED',
                                                        'COMPLETED', 'CANCELED', 'REJECTED', 'QUOTE_DECLINED')),
    price_cents      INTEGER CHECK (price_cents > 0),
    deposit_cents    INTEGER NOT NULL DEFAULT 0,
    canceled_by      UUID REFERENCES users(id),
    cancel_fee_cents INTEGER NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    confirmed_at     TIMESTAMPTZ,
    completed_at     TIMESTAMPTZ,
    canceled_at      TIMESTAMPTZ
);

CREATE TABLE contracts (
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id               UUID NOT NULL UNIQUE REFERENCES service_requests(id) ON DELETE CASCADE,
    terms_version            VARCHAR NOT NULL,
    policy_snapshot          JSONB NOT NULL,
    price_cents              INTEGER NOT NULL,
    content_hash             CHAR(64) NOT NULL,
    client_accepted_at       TIMESTAMPTZ,
    professional_accepted_at TIMESTAMPTZ,
    pdf_path                 VARCHAR,
    created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reschedule_proposals (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id    UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
    proposed_by   UUID NOT NULL REFERENCES users(id),
    new_date      DATE NOT NULL,
    new_time_slot TIME NOT NULL,
    status        VARCHAR NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reports (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id      UUID NOT NULL REFERENCES users(id),
    reported_user_id UUID NOT NULL REFERENCES users(id),
    request_id       UUID REFERENCES service_requests(id),
    reason           TEXT NOT NULL,
    status           VARCHAR NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'RESOLVED', 'DISMISSED')),
    resolved_by      UUID REFERENCES users(id),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE refresh_tokens (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash CHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked    BOOLEAN NOT NULL DEFAULT FALSE
);

-- Pedidos abertos pelo app (fluxo atual) e suas avaliações.
CREATE TABLE orders (
    id                UUID PRIMARY KEY,
    client_id         UUID NOT NULL REFERENCES users(id),
    professional_id   UUID REFERENCES users(id),
    category_id       INTEGER NOT NULL REFERENCES categories(id),
    title             VARCHAR(150) NOT NULL,
    description       TEXT NOT NULL,
    status            VARCHAR(30) NOT NULL
        CHECK (status IN ('OPEN', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    scheduled_at      TIMESTAMPTZ NOT NULL,
    latitude          DOUBLE PRECISION NOT NULL,
    longitude         DOUBLE PRECISION NOT NULL,
    address_reference VARCHAR(255),
    created_at        TIMESTAMPTZ,
    updated_at        TIMESTAMPTZ
);

CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id      UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    client_id       UUID NOT NULL REFERENCES users(id),
    professional_id UUID NOT NULL REFERENCES professional_profiles(user_id),
    rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment         TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_professional_id ON reviews(professional_id);
