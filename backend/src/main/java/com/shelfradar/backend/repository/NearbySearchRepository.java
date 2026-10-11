package com.shelfradar.backend.repository;

import com.shelfradar.backend.dto.publicsearch.NearbySearchHit;
import com.shelfradar.backend.dto.publicsearch.NearbySearchPage;
import com.shelfradar.backend.entity.enums.StockStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Repository
public class NearbySearchRepository {

    @PersistenceContext
    private EntityManager entityManager;

    private static final String USER_POINT =
            """
            ST_SetSRID(
                ST_MakePoint(
                    :longitude,
                    :latitude
                ),
                4326
            )::geography
            """;

    public NearbySearchPage search(
            String searchText,
            Long brandId,
            Long categoryId,
            StockStatus status,
            String city,
            int page,
            int size,
            String sort,
            double latitude,
            double longitude,
            Double radiusKm
    ) {

        StringBuilder where =
                new StringBuilder(
                        """
                        WHERE s.status = 'ACTIVE'
                        """
                );

        Map<String, Object> parameters =
                new HashMap<>();


        if (
                searchText != null &&
                        !searchText.isBlank()
        ) {

            where.append(
                    """
                    AND LOWER(p.name) LIKE :searchText
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
                    status.name()
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


        if (radiusKm != null) {

            where.append(
                    """
                    AND ST_DWithin(
                        s.location,
                    """
            );

            where.append(
                    USER_POINT
            );

            where.append(
                    """
                    ,
                        :radiusMeters
                    )
                    """
            );

            parameters.put(
                    "radiusMeters",
                    radiusKm * 1000.0
            );
        }


        String distanceExpression =
                """
                ST_Distance(
                    s.location,
                """
                        +
                        USER_POINT
                        +
                        """
                ) / 1000.0
                """;


        String dataSql =
                """
                SELECT
                    i.id,
                """
                        +
                        distanceExpression
                        +
                        """
                         AS distance_km
                FROM inventory i
                JOIN products p
                    ON p.id = i.product_id
                JOIN brands b
                    ON b.id = p.brand_id
                JOIN categories c
                    ON c.id = p.category_id
                JOIN stores s
                    ON s.id = i.store_id
                """
                        +
                        where
                        +
                        resolveOrderBy(sort);


        String countSql =
                """
                SELECT COUNT(*)
                FROM inventory i
                JOIN products p
                    ON p.id = i.product_id
                JOIN brands b
                    ON b.id = p.brand_id
                JOIN categories c
                    ON c.id = p.category_id
                JOIN stores s
                    ON s.id = i.store_id
                """
                        +
                        where;


        Query dataQuery =
                entityManager
                        .createNativeQuery(
                                dataSql
                        );

        Query countQuery =
                entityManager
                        .createNativeQuery(
                                countSql
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


        dataQuery.setParameter(
                "latitude",
                latitude
        );

        dataQuery.setParameter(
                "longitude",
                longitude
        );


        if (radiusKm != null) {

            countQuery.setParameter(
                    "latitude",
                    latitude
            );

            countQuery.setParameter(
                    "longitude",
                    longitude
            );
        }


        dataQuery.setFirstResult(
                page * size
        );

        dataQuery.setMaxResults(
                size
        );


        @SuppressWarnings("unchecked")
        List<Object[]> rows =
                dataQuery.getResultList();


        List<NearbySearchHit> hits =
                new ArrayList<>();

        for (Object[] row : rows) {

            Number inventoryId =
                    (Number) row[0];

            Number distance =
                    (Number) row[1];

            hits.add(
                    new NearbySearchHit(
                            inventoryId.longValue(),
                            distance.doubleValue()
                    )
            );
        }


        Number total =
                (Number)
                        countQuery
                                .getSingleResult();


        return new NearbySearchPage(
                hits,
                total.longValue()
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
                    distance_km ASC,
                    p.name ASC,
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
                        distance_km ASC,
                        p.name ASC,
                        i.id ASC
                    """;

            case "distanceasc" ->
                    """
                    ORDER BY
                        distance_km ASC,
                        i.price ASC,
                        i.id ASC
                    """;

            case "pricedesc" ->
                    """
                    ORDER BY
                        i.price DESC,
                        distance_km ASC,
                        p.name ASC,
                        i.id ASC
                    """;

            case "nameasc" ->
                    """
                    ORDER BY
                        p.name ASC,
                        distance_km ASC,
                        i.price ASC,
                        i.id ASC
                    """;

            case "namedesc" ->
                    """
                    ORDER BY
                        p.name DESC,
                        distance_km ASC,
                        i.price ASC,
                        i.id ASC
                    """;

            case "updateddesc" ->
                    """
                    ORDER BY
                        i.updated_at DESC,
                        distance_km ASC,
                        i.id ASC
                    """;

            default ->
                    """
                    ORDER BY
                        i.price ASC,
                        distance_km ASC,
                        p.name ASC,
                        i.id ASC
                    """;
        };
    }
}