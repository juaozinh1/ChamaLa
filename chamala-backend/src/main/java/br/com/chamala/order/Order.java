package br.com.chamala.order;

import br.com.chamala.category.Category;
import br.com.chamala.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professional_id")
    private User professional;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.OPEN;

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;

    private Double latitude;
    private Double longitude;

    @Column(name = "address_reference")
    private String addressReference;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Order() {}

    public Order(User client, Category category, String title, String description,
                 LocalDateTime scheduledAt, Double latitude, Double longitude, String addressReference) {
        this.client = client;
        this.category = category;
        this.title = title;
        this.description = description;
        this.scheduledAt = scheduledAt;
        this.latitude = latitude;
        this.longitude = longitude;
        this.addressReference = addressReference;
        this.status = OrderStatus.OPEN;
        this.createdAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public User getClient() { return client; }
    public User getProfessional() { return professional; }
    public void setProfessional(User professional) { this.professional = professional; }
    public Category getCategory() { return category; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public String getAddressReference() { return addressReference; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}