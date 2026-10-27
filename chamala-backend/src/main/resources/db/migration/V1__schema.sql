-- Esquema inicial do ChamaLÁ (modelo de dados do roadmap).
-- Dinheiro sempre em centavos (inteiro). Datas em timestamptz.
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE users (
    id              uuid PRIMARY KEY,
    name            varchar(120) NOT NULL,
    email           varchar(180) NOT NULL UNIQUE,
    password_hash   varchar(100) NOT NULL,
    phone           varchar(20),
    role            varchar(20)  NOT NULL CHECK (role IN ('CLIENT', 'PROFESSIONAL', 'ADMIN')),
    status          varchar(20)  NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED')),
    text_size       varchar(20)  NOT NULL DEFAULT 'normal',
    high_contrast   boolean      NOT NULL DEFAULT false,
    created_at      timestamptz  NOT NULL DEFAULT now()
);

CREATE TABLE categories (
    id      integer PRIMARY KEY,
    name    varchar(60) NOT NULL UNIQUE,
    icon    varchar(16) NOT NULL,
    color   varchar(9)  NOT NULL
);

CREATE TABLE professional_profiles (
    user_id              uuid PRIMARY KEY REFERENCES users (id),
    bio                  text,
    service_radius_km    integer NOT NULL DEFAULT 10,
    base_location        geography(Point, 4326),
    neighborhood         varchar(120),
    city                 varchar(120),
    available            boolean NOT NULL DEFAULT false,
    verification_status  varchar(20) NOT NULL DEFAULT 'NOT_SUBMITTED'
        CHECK (verification_status IN ('NOT_SUBMITTED', 'PENDING', 'APPROVED', 'REJECTED')),
    rating_avg           numeric(2, 1) NOT NULL DEFAULT 0,
    rating_count         integer NOT NULL DEFAULT 0,
    cancel_min_hours     integer NOT NULL DEFAULT 24 CHECK (cancel_min_hours >= 0),
    cancel_fee_pct       integer NOT NULL DEFAULT 10 CHECK (cancel_fee_pct BETWEEN 10 AND 20),
    deposit_pct          integer NOT NULL DEFAULT 0 CHECK (deposit_pct BETWEEN 0 AND 100)
);
CREATE INDEX idx_professional_location ON professional_profiles USING gist (base_location);

CREATE TABLE professional_categories (
    professional_id  uuid    NOT NULL REFERENCES professional_profiles (user_id),
    category_id      integer NOT NULL REFERENCES categories (id),
    is_primary       boolean NOT NULL DEFAULT false,
    PRIMARY KEY (professional_id, category_id)
);

CREATE TABLE professional_services (
    id               uuid PRIMARY KEY,
    professional_id  uuid    NOT NULL REFERENCES professional_profiles (user_id),
    category_id      integer NOT NULL REFERENCES categories (id),
    title            varchar(120) NOT NULL,
    description      text,
    price_cents      integer NOT NULL CHECK (price_cents > 0),
    active           boolean NOT NULL DEFAULT true
);

CREATE TABLE verification_documents (
    id                uuid PRIMARY KEY,
    professional_id   uuid NOT NULL REFERENCES professional_profiles (user_id),
    type              varchar(20) NOT NULL
        CHECK (type IN ('SELFIE', 'ID_FRONT', 'ID_BACK', 'CERTIFICATE', 'EXTRA', 'PORTFOLIO')),
    storage_path      varchar(300) NOT NULL,
    status            varchar(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    reviewed_by       uuid REFERENCES users (id),
    reviewed_at       timestamptz,
    rejection_reason  text,
    created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE service_requests (
    id                uuid PRIMARY KEY,
    type              varchar(10) NOT NULL CHECK (type IN ('FIXED', 'QUOTE')),
    client_id         uuid    NOT NULL REFERENCES users (id),
    professional_id   uuid    NOT NULL REFERENCES professional_profiles (user_id),
    service_id        uuid REFERENCES professional_services (id),
    category_id       integer NOT NULL REFERENCES categories (id),
    description       text,
    scheduled_date    date NOT NULL,
    time_slot         time NOT NULL,
    address_text      varchar(300) NOT NULL,
    location          geography(Point, 4326),
    notes             text,
    status            varchar(20) NOT NULL CHECK (status IN ('PENDING', 'QUOTE_REQUESTED', 'QUOTED',
                          'CONFIRMED', 'COMPLETED', 'CANCELED', 'REJECTED', 'QUOTE_DECLINED')),
    price_cents       integer CHECK (price_cents > 0),
    deposit_cents     integer NOT NULL DEFAULT 0,
    canceled_by       uuid REFERENCES users (id),
    cancel_fee_cents  integer NOT NULL DEFAULT 0,
    created_at        timestamptz NOT NULL DEFAULT now(),
    confirmed_at      timestamptz,
    completed_at      timestamptz,
    canceled_at       timestamptz,
    CHECK (type = 'QUOTE' OR service_id IS NOT NULL)
);
CREATE INDEX idx_requests_client ON service_requests (client_id, status);
CREATE INDEX idx_requests_professional ON service_requests (professional_id, status);

CREATE TABLE contracts (
    id                        uuid PRIMARY KEY,
    request_id                uuid NOT NULL UNIQUE REFERENCES service_requests (id),
    terms_version             varchar(20) NOT NULL,
    policy_snapshot           jsonb NOT NULL,
    price_cents               integer NOT NULL,
    content_hash              char(64) NOT NULL,
    client_accepted_at        timestamptz,
    professional_accepted_at  timestamptz,
    pdf_path                  varchar(300),
    created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reschedule_proposals (
    id             uuid PRIMARY KEY,
    request_id     uuid NOT NULL REFERENCES service_requests (id),
    proposed_by    uuid NOT NULL REFERENCES users (id),
    new_date       date NOT NULL,
    new_time_slot  time NOT NULL,
    status         varchar(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED')),
    created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reviews (
    id               uuid PRIMARY KEY,
    request_id       uuid NOT NULL UNIQUE REFERENCES service_requests (id),
    client_id        uuid NOT NULL REFERENCES users (id),
    professional_id  uuid NOT NULL REFERENCES professional_profiles (user_id),
    rating           smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment          text,
    created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reports (
    id                uuid PRIMARY KEY,
    reporter_id       uuid NOT NULL REFERENCES users (id),
    reported_user_id  uuid NOT NULL REFERENCES users (id),
    request_id        uuid REFERENCES service_requests (id),
    reason            text NOT NULL,
    status            varchar(20) NOT NULL DEFAULT 'OPEN'
        CHECK (status IN ('OPEN', 'RESOLVED', 'DISMISSED')),
    resolved_by       uuid REFERENCES users (id),
    created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE refresh_tokens (
    id          uuid PRIMARY KEY,
    user_id     uuid NOT NULL REFERENCES users (id),
    token_hash  char(64) NOT NULL UNIQUE,
    expires_at  timestamptz NOT NULL,
    revoked     boolean NOT NULL DEFAULT false
);
