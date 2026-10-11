package com.shelfradar.backend.repository;

import com.shelfradar.backend.entity.Inventory;
import com.shelfradar.backend.entity.enums.StockStatus;
import com.shelfradar.backend.entity.enums.StoreStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Repository
public class PublicSearchRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public Page<Inventory> search(
            String searchText,
            Long brandId,
            Long categoryId,
            StockStatus status,
            String city,
            int page,
            int size,
            String sort
    ) {
        StringBuilder where =
                new StringBuilder(
                        """
                        WHERE s.status = :activeStatus
                        """
                );

        Map<String, Object> parameters =
                new HashMap<>();

        parameters.put(
                "activeStatus",
                StoreStatus.ACTIVE
        );

        if (
                searchText != null &&
                        !searchText.isBlank()
        ) {
            where.append(
                    """
                    AND LOWER(p.name)
                        LIKE :searchText
                    """
            );

            parameters.put(
                    "searchText",
                    "%" +
                            searchText
                                    .trim()
                                    .toLowerCase(
                                            Locale.ROOT
                                    ) +
                            "%"
            );
        }

        if (brandId != null) {
            where.append(
                    """
                    AND b.id = :brandId
                    """
            );

            parameters.put(
                    "brandId",
                    brandId
            );
        }

        if (categoryId != null) {
            where.append(
                    """
                    AND c.id = :categoryId
                    """
            );

            parameters.put(
                    "categoryId",
                    categoryId
            );
        }

        if (status != null) {
            where.append(
                    """
                    AND i.status = :stockStatus
                    """
            );

            parameters.put(
                    "stockStatus",
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

        String dataQuery =
                """
                SELECT i
                FROM Inventory i
                JOIN FETCH i.product p
                JOIN FETCH p.brand b
                JOIN FETCH p.category c
                JOIN FETCH i.store s
                """
                        +
                        where
                        +
                        resolveOrderBy(
                                sort
                        );

        String countQuery =
                """
                SELECT COUNT(i.id)
                FROM Inventory i
                JOIN i.product p
                JOIN p.brand b
                JOIN p.category c
                JOIN i.store s
                """
                        +
                        where;

        TypedQuery<Inventory> query =
                entityManager.createQuery(
                        dataQuery,
                        Inventory.class
                );

        TypedQuery<Long> totalQuery =
                entityManager.createQuery(
                        countQuery,
                        Long.class
                );

        parameters.forEach(
                (key, value) -> {
                    query.setParameter(
                            key,
                            value
                    );

                    totalQuery.setParameter(
                            key,
                            value
                    );
                }
        );

        query.setFirstResult(
                page * size
        );

        query.setMaxResults(
                size
        );

        List<Inventory> content =
                query.getResultList();

        long total =
                totalQuery.getSingleResult();

        return new PageImpl<>(
                content,
                PageRequest.of(
                        page,
                        size
                ),
                total
        );
    }

    private String resolveOrderBy(
            String sort
    ) {
        if (
                sort == null ||
                        sort.isBlank()
        ) {
            return """
                    ORDER BY
                        i.price ASC,
                        p.name ASC,
                        s.name ASC,
                        i.id ASC
                    """;
        }

        return switch (
                sort
                        .trim()
                        .toLowerCase(
                                Locale.ROOT
                        )
                ) {
            case "priceasc" ->
                    """
                    ORDER BY
                        i.price ASC,
                        p.name ASC,
                        s.name ASC,
                        i.id ASC
                    """;

            case "pricedesc" ->
                    """
                    ORDER BY
                        i.price DESC,
                        p.name ASC,
                        s.name ASC,
                        i.id ASC
                    """;

            case "nameasc" ->
                    """
                    ORDER BY
                        p.name ASC,
                        i.price ASC,
                        s.name ASC,
                        i.id ASC
                    """;

            case "namedesc" ->
                    """
                    ORDER BY
                        p.name DESC,
                        i.price ASC,
                        s.name ASC,
                        i.id ASC
                    """;

            case "updateddesc" ->
                    """
                    ORDER BY
                        i.updatedAt DESC,
                        p.name ASC,
                        i.id ASC
                    """;

            default ->
                    """
                    ORDER BY
                        i.price ASC,
                        p.name ASC,
                        s.name ASC,
                        i.id ASC
                    """;
        };
    }
}