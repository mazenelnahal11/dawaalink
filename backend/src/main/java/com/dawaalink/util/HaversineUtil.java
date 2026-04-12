package com.dawaalink.util;

import java.math.BigDecimal;

public class HaversineUtil {

    private static final double EARTH_RADIUS_KM = 6371.0;

    public static double calculateDistance(BigDecimal lat1Bd, BigDecimal lon1Bd, BigDecimal lat2Bd, BigDecimal lon2Bd) {
        if (lat1Bd == null || lon1Bd == null || lat2Bd == null || lon2Bd == null) {
            // If coordinates are missing, assume they are far away (e.g. 9999 km) or throw Exception
            return 9999.0;
        }

        double lat1 = lat1Bd.doubleValue();
        double lon1 = lon1Bd.doubleValue();
        double lat2 = lat2Bd.doubleValue();
        double lon2 = lon2Bd.doubleValue();

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.pow(Math.sin(dLat / 2), 2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.pow(Math.sin(dLon / 2), 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }
}
