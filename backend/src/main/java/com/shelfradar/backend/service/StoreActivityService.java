package com.shelfradar.backend.service;

import com.shelfradar.backend.dto.audit.AuditLogResponse;
import com.shelfradar.backend.dto.catalog.PageResponse;
import com.shelfradar.backend.entity.AuditLog;
import com.shelfradar.backend.mapper.AuditMapper;
import com.shelfradar.backend.repository.AuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class StoreActivityService {

    private final StoreService storeService;
    private final AuditLogRepository auditLogRepository;
    private final AuditMapper auditMapper;

    public StoreActivityService(
            StoreService storeService,
            AuditLogRepository auditLogRepository,
            AuditMapper auditMapper
    ) {
        this.storeService =
                storeService;

        this.auditLogRepository =
                auditLogRepository;

        this.auditMapper =
                auditMapper;
    }

    public PageResponse<AuditLogResponse> getStoreActivity(
            String email,
            Long storeId,
            int page,
            int size
    ) {

        storeService.findOwnedStore(
                email,
                storeId
        );

        PageRequest pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by(
                                Sort.Direction.DESC,
                                "occurredAt"
                        )
                );

        Page<AuditLog> activity =
                auditLogRepository
                        .findByStoreId(
                                storeId,
                                pageable
                        );

        return PageResponse.from(
                activity.map(
                        auditMapper
                                ::toResponse
                )
        );
    }
}