package com.shelfradar.backend.mapper;

import com.shelfradar.backend.dto.audit.AuditLogResponse;
import com.shelfradar.backend.entity.AuditLog;
import org.springframework.stereotype.Component;

@Component
public class AuditMapper {

    public AuditLogResponse toResponse(
            AuditLog auditLog
    ) {
        return new AuditLogResponse(
                auditLog.getId(),
                auditLog.getActorUserId(),
                auditLog.getActorEmail(),
                auditLog.getActorRole(),
                auditLog.getAction(),
                auditLog.getEntityType(),
                auditLog.getEntityId(),
                auditLog.getStoreId(),
                auditLog.getStoreNameSnapshot(),
                auditLog.getProductId(),
                auditLog.getProductNameSnapshot(),
                auditLog.getDetails(),
                auditLog.getOccurredAt()
        );
    }
}