-- V4__add_delivery_pin_to_leg.sql

ALTER TABLE swap_leg ADD COLUMN delivery_pin VARCHAR(10);
