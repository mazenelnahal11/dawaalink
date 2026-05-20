package com.dawaalink.dto;

public class DashboardKPI {
    private long totalItemsListed;
    private long matchesThisWeek;
    private long totalSwapsCompleted;
    private double estimatedValueRecoveredEGP;

    public DashboardKPI() {}

    public DashboardKPI(long totalItemsListed, long matchesThisWeek, long totalSwapsCompleted, double estimatedValueRecoveredEGP) {
        this.totalItemsListed = totalItemsListed;
        this.matchesThisWeek = matchesThisWeek;
        this.totalSwapsCompleted = totalSwapsCompleted;
        this.estimatedValueRecoveredEGP = estimatedValueRecoveredEGP;
    }

    public long getTotalItemsListed() { return totalItemsListed; }
    public void setTotalItemsListed(long totalItemsListed) { this.totalItemsListed = totalItemsListed; }

    public long getMatchesThisWeek() { return matchesThisWeek; }
    public void setMatchesThisWeek(long matchesThisWeek) { this.matchesThisWeek = matchesThisWeek; }

    public long getTotalSwapsCompleted() { return totalSwapsCompleted; }
    public void setTotalSwapsCompleted(long totalSwapsCompleted) { this.totalSwapsCompleted = totalSwapsCompleted; }

    public double getEstimatedValueRecoveredEGP() { return estimatedValueRecoveredEGP; }
    public void setEstimatedValueRecoveredEGP(double estimatedValueRecoveredEGP) { this.estimatedValueRecoveredEGP = estimatedValueRecoveredEGP; }
}
