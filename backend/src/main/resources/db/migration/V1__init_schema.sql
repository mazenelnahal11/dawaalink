-- V1__init_schema.sql
-- Create initial schema for DawaaLink backend

-- 1. pharmacy
CREATE TABLE pharmacy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commercial_name VARCHAR(255) NOT NULL,
    district VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    tax_id VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED')),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pharmacy_status ON pharmacy(status);

-- 2. pharmacy_user
CREATE TABLE pharmacy_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacy(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('OWNER', 'PHARMACIST', 'EMPLOYEE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_email ON pharmacy_user(email);
CREATE INDEX idx_user_pharmacy ON pharmacy_user(pharmacy_id);

-- 3. pharmacist_license
CREATE TABLE pharmacist_license (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES pharmacy_user(id) ON DELETE CASCADE,
    syndicate_number VARCHAR(100),
    eda_registration VARCHAR(100),
    verification_status VARCHAR(50)
);

-- 4. medication_reference
CREATE TABLE medication_reference (
    gtin VARCHAR(50) PRIMARY KEY,
    trade_name VARCHAR(255) NOT NULL,
    scientific_name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255),
    storage_condition VARCHAR(20) NOT NULL CHECK (storage_condition IN ('ROOM_TEMP', 'COLD_CHAIN')),
    is_controlled BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_med_trade_name ON medication_reference(trade_name);

-- 5. inventory_item
CREATE TABLE inventory_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacy(id) ON DELETE CASCADE,
    gtin VARCHAR(50) NOT NULL REFERENCES medication_reference(gtin),
    batch_number VARCHAR(50) NOT NULL,
    expiry_date DATE NOT NULL,
    quantity_available INT NOT NULL CHECK (quantity_available > 0),
    unit VARCHAR(20) NOT NULL CHECK (unit IN ('BOX', 'STRIP', 'VIAL', 'PIECE')),
    unit_price DECIMAL(10, 2),
    lock_status VARCHAR(20) NOT NULL CHECK (lock_status IN ('ACTIVE', 'LOCKED', 'FLAGGED', 'COMPLETED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_pharmacy ON inventory_item(pharmacy_id);
CREATE INDEX idx_inventory_gtin ON inventory_item(gtin);
CREATE INDEX idx_inventory_expiry ON inventory_item(expiry_date);
CREATE INDEX idx_inventory_lock ON inventory_item(lock_status);

-- 6. wishlist_item
CREATE TABLE wishlist_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pharmacy_id UUID NOT NULL REFERENCES pharmacy(id) ON DELETE CASCADE,
    gtin VARCHAR(50) NOT NULL REFERENCES medication_reference(gtin),
    quantity_needed INT NOT NULL CHECK (quantity_needed > 0),
    min_acceptable_expiry DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wishlist_pharmacy ON wishlist_item(pharmacy_id);

-- 7. swap_cycle
CREATE TABLE swap_cycle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    execution_status VARCHAR(20) NOT NULL CHECK (execution_status IN ('PENDING', 'PARTIAL_ACCEPT', 'CONFIRMED', 'IN_TRANSFER', 'COMPLETED', 'CANCELLED', 'TIMED_OUT')),
    expires_at TIMESTAMP NOT NULL,
    hash_signature VARCHAR(255)
);

CREATE INDEX idx_cycle_status ON swap_cycle(execution_status);
CREATE INDEX idx_cycle_expires ON swap_cycle(expires_at);

-- 8. swap_leg
CREATE TABLE swap_leg (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_id UUID NOT NULL REFERENCES swap_cycle(id) ON DELETE CASCADE,
    sender_pharmacy_id UUID NOT NULL REFERENCES pharmacy(id),
    receiver_pharmacy_id UUID NOT NULL REFERENCES pharmacy(id),
    inventory_id UUID NOT NULL REFERENCES inventory_item(id),
    quantity_transferred INT NOT NULL CHECK (quantity_transferred > 0),
    leg_status VARCHAR(20) NOT NULL CHECK (leg_status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'COMPLETED'))
);

CREATE INDEX idx_swap_leg_cycle ON swap_leg(cycle_id);
CREATE INDEX idx_leg_sender_pharmacy ON swap_leg(sender_pharmacy_id);
CREATE INDEX idx_leg_receiver_pharmacy ON swap_leg(receiver_pharmacy_id);

-- 9. audit_log
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(255) NOT NULL,
    target_entity_id UUID NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);

-- RLS equivalent role-level restriction: Revoke UPDATE, DELETE on audit_log
-- We create a read-only role or just enforce application-side if we only have one DB user.
-- For Flyway, assuming current user is table owner. We can't entirely revoke our own rights unless we change ownership.
-- We will enforce "NO DELETE and NO UPDATE" via application (which runs under DB user) by creating a RULE/TRIGGER or just REVOKE.
CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION 'Updates and Deletes are strictly forbidden on audit_log table.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_audit_log_update
BEFORE UPDATE ON audit_log
FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();

CREATE TRIGGER trg_prevent_audit_log_delete
BEFORE DELETE ON audit_log
FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();
