package com.shelfradar.backend.service;

import com.shelfradar.backend.dto.audit.AdminAnalyticsResponse;
import com.shelfradar.backend.dto.audit.AuditLogResponse;
import com.shelfradar.backend.dto.audit.DailyActivityResponse;
import com.shelfradar.backend.dto.audit.StoreActivitySummaryResponse;
import com.shelfradar.backend.dto.catalog.PageResponse;
import com.shelfradar.backend.entity.AuditLog;
import com.shelfradar.backend.entity.enums.AuditAction;
import com.shelfradar.backend.entity.enums.AuditEntityType;
import com.shelfradar.backend.mapper.AuditMapper;
import com.shelfradar.backend.repository.AuditLogRepository;
import com.shelfradar.backend.repository.AuditLogSearchRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class AdminAnalyticsService {

    private final AuditLogRepository auditLogRepository;
    private final AuditLogSearchRepository auditLogSearchRepository;
    private final AuditMapper auditMapper;

    public AdminAnalyticsService(
            AuditLogRepository auditLogRepository,
            AuditLogSearchRepository auditLogSearchRepository,
            AuditMapper auditMapper
    ) {
        this.auditLogRepository =
                auditLogRepository;

        this.auditLogSearchRepository =
                auditLogSearchRepository;

        this.auditMapper =
                auditMapper;
    }

    public AdminAnalyticsResponse getAnalytics() {

        Instant now =
                Instant.now();

        Instant last24Hours =
                now.minus(
                        24,
                        ChronoUnit.HOURS
                );

        Instant last7Days =
                now.minus(
                        7,
                        ChronoUnit.DAYS
                );

        long activity24h =
                auditLogRepository
                        .countByOccurredAtGreaterThanEqual(
                                last24Hours
                        );

        long activity7d =
                auditLogRepository
                        .countByOccurredAtGreaterThanEqual(
                                last7Days
                        );

        long inventoryChanges =
                auditLogRepository
                        .countByEntityTypeAndOccurredAtGreaterThanEqual(
                                AuditEntityType.INVENTORY,
                                last7Days
                        );

        long storeChanges =
                auditLogRepository
                        .countByEntityTypeAndOccurredAtGreaterThanEqual(
                                AuditEntityType.STORE,
                                last7Days
                        );

        List<DailyActivityResponse> dailyActivity =
                auditLogRepository
                        .countDailyActivity(
                                last7Days
                        )
                        .stream()
                        .map(
                                row ->
                                        new DailyActivityResponse(
                                                toLocalDate(
                                                        row[0]
                                                ),
                                                ((Number) row[1])
                                                        .longValue()
                                        )
                        )
                        .toList();

        List<StoreActivitySummaryResponse> mostActiveStores =
                auditLogRepository
                        .findMostActiveStores(
                                last7Days
                        )
                        .stream()
                        .map(
                                row ->
                                        new StoreActivitySummaryResponse(
                                                ((Number) row[0])
                                                        .longValue(),
                                                (String) row[1],
                                                ((Number) row[2])
                                                        .longValue()
                                        )
                        )
                        .toList();

        List<AuditLogResponse> recent =
                auditLogRepository
                        .findTop10ByOrderByOccurredAtDescIdDesc()
                        .stream()
                        .map(
                                auditMapper
                                        ::toResponse
                        )
                        .toList();

        return new AdminAnalyticsResponse(
                activity24h,
                activity7d,
                inventoryChanges,
                storeChanges,
                dailyActivity,
                mostActiveStores,
                recent
        );
    }

    public PageResponse<AuditLogResponse> searchAuditLog(
            String query,
            AuditAction action,
            AuditEntityType entityType,
            Long storeId,
            int page,
            int size
    ) {

        Page<AuditLog> result =
                auditLogSearchRepository
                        .search(
                                query,
                                action,
                                entityType,
                                storeId,
                                page,
                                size
                        );

        return PageResponse.from(
                result.map(
                        auditMapper
                                ::toResponse
                )
        );
    }

    private LocalDate toLocalDate(
            Object value
    ) {

        if (value instanceof LocalDate date) {
            return date;
        }

        if (value instanceof Date date) {
            return date.toLocalDate();
        }

        return LocalDate.parse(
                value.toString()
        );
    }
}