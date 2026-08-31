package com.shelfradar.backend.dto.audit;

import java.util.List;

public record AdminAnalyticsResponse(

        long activityLast24Hours,

        long activityLast7Days,

        long inventoryChangesLast7Days,

        long storeChangesLast7Days,

        List<DailyActivityResponse> dailyActivity,

        List<StoreActivitySummaryResponse> mostActiveStores,

        List<AuditLogResponse> recentActivity

) {
}