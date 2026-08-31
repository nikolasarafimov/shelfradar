package com.shelfradar.backend.service;

import com.shelfradar.backend.entity.AppUser;
import com.shelfradar.backend.entity.AuditLog;
import com.shelfradar.backend.entity.Product;
import com.shelfradar.backend.entity.Store;
import com.shelfradar.backend.entity.enums.AuditAction;
import com.shelfradar.backend.entity.enums.AuditEntityType;
import com.shelfradar.backend.exception.ResourceNotFoundException;
import com.shelfradar.backend.repository.AppUserRepository;
import com.shelfradar.backend.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final AppUserRepository appUserRepository;


    public AuditService(
            AuditLogRepository auditLogRepository,
            AppUserRepository appUserRepository
    ) {
        this.auditLogRepository =
                auditLogRepository;

        this.appUserRepository =
                appUserRepository;
    }


    public void record(
            String actorEmail,
            AuditAction action,
            AuditEntityType entityType,
            Long entityId,
            Store store,
            Product product,
            String details
    ) {

        AppUser actor =
                appUserRepository
                        .findByEmailIgnoreCase(
                                actorEmail.trim()
                        )
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Audit actor not found."
                                        )
                        );


        AuditLog log =
                new AuditLog();


        log.setActorUserId(
                actor.getId()
        );

        log.setActorEmail(
                actor.getEmail()
        );

        log.setActorRole(
                actor.getRole()
        );

        log.setAction(
                action
        );

        log.setEntityType(
                entityType
        );

        log.setEntityId(
                entityId
        );


        if (store != null) {

            log.setStoreId(
                    store.getId()
            );

            log.setStoreNameSnapshot(
                    store.getName()
            );
        }


        if (product != null) {

            log.setProductId(
                    product.getId()
            );

            log.setProductNameSnapshot(
                    product.getName()
            );
        }


        log.setDetails(
                normalizeDetails(
                        details
                )
        );


        auditLogRepository.save(
                log
        );
    }


    private String normalizeDetails(
            String details
    ) {

        if (
                details == null ||
                        details.isBlank()
        ) {
            return null;
        }


        String trimmed =
                details.trim();


        if (trimmed.length() <= 1000) {
            return trimmed;
        }


        return trimmed.substring(
                0,
                1000
        );
    }
}