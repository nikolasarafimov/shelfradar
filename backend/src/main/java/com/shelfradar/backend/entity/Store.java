package com.shelfradar.backend.entity;

import com.shelfradar.backend.entity.enums.StoreStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "stores")
@Getter
@Setter
@NoArgsConstructor
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "name",
            nullable = false,
            length = 200
    )
    private String name;

    @Column(
            name = "address",
            nullable = false,
            length = 300
    )
    private String address;

    @Column(
            name = "city",
            nullable = false,
            length = 120
    )
    private String city;

    @Column(
            name = "latitude",
            nullable = false,
            precision = 9,
            scale = 6
    )
    private BigDecimal latitude;

    @Column(
            name = "longitude",
            nullable = false,
            precision = 9,
            scale = 6
    )
    private BigDecimal longitude;

    @Column(
            name = "phone",
            length = 50
    )
    private String phone;

    @Column(
            name = "working_hours",
            length = 255
    )
    private String workingHours;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "status",
            nullable = false,
            length = 30
    )
    private StoreStatus status;

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "owner_id",
            nullable = false
    )
    private AppUser owner;

    @CreationTimestamp
    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private Instant createdAt;
}