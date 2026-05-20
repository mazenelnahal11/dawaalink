-- V7__add_email_verification.sql
-- Add email verification fields to pharmacy_user table

ALTER TABLE pharmacy_user ADD COLUMN verification_code VARCHAR(10);
ALTER TABLE pharmacy_user ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- Assume existing users (like the newly created admin) are already verified so they aren't locked out
UPDATE pharmacy_user SET is_verified = TRUE;
