package com.shelfradar.backend.entity;

import com.shelfradar.backend.entity.enums.AuditAction;
import com.shelfradar.backend.entity.enums.AuditEntityType;
import com.shelfradar.backend.entity.enums.UserRole;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "actor_user_id")
    private Long actorUserId;

    @Column(
            name = "actor_email",
            nullable = false,
            length = 255
    )
    private String actorEmail;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "actor_role",
            nullable = false,
            length = 32
    )
    private UserRole actorRole;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "action",
            nullable = false,
            length = 64
    )
    private AuditAction action;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "entity_type",
            nullable = false,
            length = 32
    )
    private AuditEntityType entityType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "store_id")
    private Long storeId;

    @Column(
            name = "store_name_snapshot",
            length = 150
    )
    private String storeNameSnapshot;

    @Column(name = "product_id")
    private Long productId;

    @Column(
            name = "product_name_snapshot",
            length = 255
    )
    private String productNameSnapshot;

    @Column(
            name = "details",
            length = 1000
    )
    private String details;

    @Column(
            name = "occurred_at",
            nullable = false
    )
    private Instant occurredAt;


    public AuditLog() {
    }


    @PrePersist
    public void prePersist() {

        if (occurredAt == null) {
            occurredAt = Instant.now();
        }
    }


    public Long getId() {
        return id;
    }

    public void setId(
            Long id
    ) {
        this.id = id;
    }

    public Long getActorUserId() {
        return actorUserId;
    }

    public void setActorUserId(
            Long actorUserId
    ) {
        this.actorUserId = actorUserId;
    }

    public String getActorEmail() {
        return actorEmail;
    }

    public void setActorEmail(
            String actorEmail
    ) {
        this.actorEmail = actorEmail;
    }

    public UserRole getActorRole() {
        return actorRole;
    }

    public void setActorRole(
            UserRole actorRole
    ) {
        this.actorRole = actorRole;
    }

    public AuditAction getAction() {
        return action;
    }

    public void setAction(
            AuditAction action
    ) {
        this.action = action;
    }

    public AuditEntityType getEntityType() {
        return entityType;
    }

    public void setEntityType(
            AuditEntityType entityType
    ) {
        this.entityType = entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(
            Long entityId
    ) {
        this.entityId = entityId;
    }

    public Long getStoreId() {
        return storeId;
    }

    public void setStoreId(
            Long storeId
    ) {
        this.storeId = storeId;
    }

    public String getStoreNameSnapshot() {
        return storeNameSnapshot;
    }

    public void setStoreNameSnapshot(
            String storeNameSnapshot
    ) {
        this.storeNameSnapshot =
                storeNameSnapshot;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(
            Long productId
    ) {
        this.productId = productId;
    }

    public String getProductNameSnapshot() {
        return productNameSnapshot;
    }

    public void setProductNameSnapshot(
            String productNameSnapshot
    ) {
        this.productNameSnapshot =
                productNameSnapshot;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(
            String details
    ) {
        this.details = details;
    }

    public Instant getOccurredAt() {
        return occurredAt;
    }

    public void setOccurredAt(
            Instant occurredAt
    ) {
        this.occurredAt = occurredAt;
    }
}