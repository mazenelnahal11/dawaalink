-- V6__add_pin_attempts_to_swap_leg.sql
-- Security fix: track PIN verification attempts to prevent brute-force attacks

ALTER TABLE swap_leg ADD COLUMN pin_attempts INTEGER DEFAULT 0;
