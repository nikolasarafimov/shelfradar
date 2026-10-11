package com.shelfradar.backend.repository;

import com.shelfradar.backend.entity.AuditLog;
import com.shelfradar.backend.entity.enums.AuditEntityType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface AuditLogRepository
        extends JpaRepository<AuditLog, Long> {

    long countByOccurredAtGreaterThanEqual(
            Instant from
    );

    long countByEntityTypeAndOccurredAtGreaterThanEqual(
            AuditEntityType entityType,
            Instant from
    );

    List<AuditLog> findTop10ByOrderByOccurredAtDescIdDesc();

    Page<AuditLog> findByStoreId(
            Long storeId,
            Pageable pageable
    );

    @Query(
            value = """
                    SELECT
                        CAST(
                            occurred_at AT TIME ZONE 'UTC'
                            AS DATE
                        ) AS activity_date,
                        COUNT(*) AS activity_count
                    FROM audit_logs
                    WHERE occurred_at >= :from
                    GROUP BY
                        CAST(
                            occurred_at AT TIME ZONE 'UTC'
                            AS DATE
                        )
                    ORDER BY activity_date ASC
                    """,
            nativeQuery = true
    )
    List<Object[]> countDailyActivity(
            @Param("from")
            Instant from
    );

    @Query(
            value = """
                    SELECT
                        store_id,
                        (
                            ARRAY_AGG(
                                store_name_snapshot
                                ORDER BY occurred_at DESC, id DESC
                            )
                            FILTER (
                                WHERE store_name_snapshot IS NOT NULL
                            )
                        )[1],
                        COUNT(*)
                    FROM audit_logs
                    WHERE occurred_at >= :from
                      AND store_id IS NOT NULL
                    GROUP BY store_id
                    ORDER BY
                        COUNT(*) DESC,
                        store_id ASC
                    LIMIT 5
                    """,
            nativeQuery = true
    )
    List<Object[]> findMostActiveStores(
            @Param("from")
            Instant from
    );
}