package com.shelfradar.backend.dto.audit;

import com.shelfradar.backend.entity.enums.AuditAction;
import com.shelfradar.backend.entity.enums.AuditEntityType;
import com.shelfradar.backend.entity.enums.UserRole;

import java.time.Instant;

public record AuditLogResponse(
        Long id,
        Long actorUserId,
        String actorEmail,
        UserRole actorRole,
        AuditAction action,
        AuditEntityType entityType,
        Long entityId,
        Long storeId,
        String storeName,
        Long productId,
        String productName,
        String details,
        Instant occurredAt
) {
}