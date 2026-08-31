package com.shelfradar.backend.repository;

import com.shelfradar.backend.entity.AuditLog;
import com.shelfradar.backend.entity.enums.AuditAction;
import com.shelfradar.backend.entity.enums.AuditEntityType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Repository
public class AuditLogSearchRepository {

    @PersistenceContext
    private EntityManager entityManager;


    public Page<AuditLog> search(
            String query,
            AuditAction action,
            AuditEntityType entityType,
            Long storeId,
            int page,
            int size
    ) {

        StringBuilder where =
                new StringBuilder(
                        " WHERE 1 = 1 "
                );

        Map<String, Object> parameters =
                new HashMap<>();


        if (
                query != null &&
                        !query.isBlank()
        ) {

            where.append(
                    """
                    AND (
                        LOWER(a.actorEmail) LIKE :query
                        OR LOWER(a.details) LIKE :query
                        OR LOWER(a.storeNameSnapshot) LIKE :query
                        OR LOWER(a.productNameSnapshot) LIKE :query
                    )
                    """
            );

            parameters.put(
                    "query",
                    "%" +
                            query
                                    .trim()
                                    .toLowerCase(
                                            Locale.ROOT
                                    ) +
                            "%"
            );
        }


        if (action != null) {

            where.append(
                    """
                    AND a.action = :action
                    """
            );

            parameters.put(
                    "action",
                    action
            );
        }


        if (entityType != null) {

            where.append(
                    """
                    AND a.entityType = :entityType
                    """
            );

            parameters.put(
                    "entityType",
                    entityType
            );
        }


        if (storeId != null) {

            where.append(
                    """
                    AND a.storeId = :storeId
                    """
            );

            parameters.put(
                    "storeId",
                    storeId
            );
        }


        String dataJpql =
                """
                SELECT a
                FROM AuditLog a
                """
                        +
                        where
                        +
                        """
                        ORDER BY
                            a.occurredAt DESC,
                            a.id DESC
                        """;


        String countJpql =
                """
                SELECT COUNT(a)
                FROM AuditLog a
                """
                        +
                        where;


        TypedQuery<AuditLog> dataQuery =
                entityManager.createQuery(
                        dataJpql,
                        AuditLog.class
                );

        TypedQuery<Long> countQuery =
                entityManager.createQuery(
                        countJpql,
                        Long.class
                );


        parameters.forEach(
                (name, value) -> {

                    dataQuery.setParameter(
                            name,
                            value
                    );

                    countQuery.setParameter(
                            name,
                            value
                    );
                }
        );


        dataQuery.setFirstResult(
                page * size
        );

        dataQuery.setMaxResults(
                size
        );


        return new PageImpl<>(
                dataQuery.getResultList(),
                PageRequest.of(
                        page,
                        size
                ),
                countQuery.getSingleResult()
        );
    }
}