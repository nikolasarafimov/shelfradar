package com.shelfradar.backend.repository;

import com.shelfradar.backend.entity.Store;
import com.shelfradar.backend.entity.enums.StoreStatus;
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
public class AdminStoreSearchRepository {

    @PersistenceContext
    private EntityManager entityManager;


    public Page<Store> search(
            String query,
            StoreStatus status,
            String city,
            int page,
            int size,
            String sort
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
                        LOWER(s.name) LIKE :query
                        OR LOWER(s.address) LIKE :query
                        OR LOWER(s.city) LIKE :query
                        OR LOWER(o.fullName) LIKE :query
                        OR LOWER(o.email) LIKE :query
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


        if (status != null) {

            where.append(
                    """
                    AND s.status = :status
                    """
            );

            parameters.put(
                    "status",
                    status
            );
        }

        if (
                city != null &&
                        !city.isBlank()
        ) {

            where.append(
                    """
                    AND LOWER(s.city) = :city
                    """
            );

            parameters.put(
                    "city",
                    city
                            .trim()
                            .toLowerCase(
                                    Locale.ROOT
                            )
            );
        }

        String dataJpql =
                """
                SELECT s
                FROM Store s
                JOIN FETCH s.owner o
                """
                        +
                        where
                        +
                        resolveOrderBy(
                                sort
                        );

        String countJpql =
                """
                SELECT COUNT(s)
                FROM Store s
                JOIN s.owner o
                """
                        +
                        where;

        TypedQuery<Store> dataQuery =
                entityManager.createQuery(
                        dataJpql,
                        Store.class
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

    private String resolveOrderBy(
            String sort
    ) {
        if (sort == null) {

            return """
                    ORDER BY s.createdAt DESC
                    """;
        }

        return switch (
                sort
                        .trim()
                        .toLowerCase(
                                Locale.ROOT
                        )
                ) {

            case "nameasc" ->
                    """
                    ORDER BY
                        s.name ASC,
                        s.id ASC
                    """;

            case "namedesc" ->
                    """
                    ORDER BY
                        s.name DESC,
                        s.id ASC
                    """;

            case "oldest" ->
                    """
                    ORDER BY
                        s.createdAt ASC,
                        s.id ASC
                    """;

            case "statusasc" ->
                    """
                    ORDER BY
                        s.status ASC,
                        s.name ASC,
                        s.id ASC
                    """;

            default ->
                    """
                    ORDER BY
                        s.createdAt DESC,
                        s.id DESC
                    """;
        };
    }
}