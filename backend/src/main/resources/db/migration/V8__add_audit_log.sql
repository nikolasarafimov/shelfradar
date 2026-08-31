CREATE TABLE audit_logs
(
    id                    BIGSERIAL PRIMARY KEY,

    actor_user_id         BIGINT,
    actor_email           VARCHAR(255) NOT NULL,
    actor_role            VARCHAR(32) NOT NULL,

    action                VARCHAR(64) NOT NULL,
    entity_type           VARCHAR(32) NOT NULL,
    entity_id             BIGINT,

    store_id              BIGINT,
    store_name_snapshot   VARCHAR(150),

    product_id            BIGINT,
    product_name_snapshot VARCHAR(255),

    details               VARCHAR(1000),

    occurred_at           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_audit_logs_occurred_at
    ON audit_logs (occurred_at DESC);


CREATE INDEX idx_audit_logs_store_occurred_at
    ON audit_logs (store_id, occurred_at DESC);


CREATE INDEX idx_audit_logs_actor_occurred_at
    ON audit_logs (actor_user_id, occurred_at DESC);


CREATE INDEX idx_audit_logs_action_occurred_at
    ON audit_logs (action, occurred_at DESC);


CREATE INDEX idx_audit_logs_entity
    ON audit_logs (entity_type, entity_id);