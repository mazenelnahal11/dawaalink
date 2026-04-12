package com.dawaalink.util;

/**
 * Centralizes the expiry urgency thresholds used across the codebase.
 * Single source of truth — eliminates duplication between InventoryService
 * and ExpiryAlertJob.
 */
public final class ExpiryUtil {

    public static final int RED_THRESHOLD_DAYS = 30;
    public static final int AMBER_THRESHOLD_DAYS = 60;
    public static final int YELLOW_THRESHOLD_DAYS = 90;

    private ExpiryUtil() {}

    /**
     * Returns the urgency badge color for a given days-to-expiry value.
     */
    public static String computeBadge(long daysToExpiry) {
        if (daysToExpiry < RED_THRESHOLD_DAYS) return "RED";
        if (daysToExpiry < AMBER_THRESHOLD_DAYS) return "AMBER";
        if (daysToExpiry < YELLOW_THRESHOLD_DAYS) return "YELLOW";
        return "NONE";
    }

    /**
     * Returns the alert type for the ExpiryAlertJob based on days-to-expiry.
     * Returns null if no alert is warranted.
     */
    public static String computeAlertType(long daysToExpiry) {
        if (daysToExpiry < RED_THRESHOLD_DAYS) return "URGENT_EXPIRY";
        if (daysToExpiry < AMBER_THRESHOLD_DAYS) return "WARNING_EXPIRY";
        if (daysToExpiry < YELLOW_THRESHOLD_DAYS) return "NOTICE_EXPIRY";
        return null;
    }
}
