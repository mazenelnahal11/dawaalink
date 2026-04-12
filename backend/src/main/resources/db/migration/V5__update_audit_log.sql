-- V5__update_audit_log.sql

ALTER TABLE audit_log RENAME COLUMN target_entity_id TO entity_id;
ALTER TABLE audit_log RENAME COLUMN user_id TO performed_by;
ALTER TABLE audit_log ALTER COLUMN performed_by TYPE VARCHAR(255);
ALTER TABLE audit_log ADD COLUMN details TEXT;
ALTER TABLE audit_log ADD COLUMN crypto_hash VARCHAR(255);
