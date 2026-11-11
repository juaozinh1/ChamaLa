package br.com.chamala.review;

import br.com.chamala.order.Order;
import br.com.chamala.user.User;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Mapeia para a coluna existente "request_id"
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false, unique = true)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professional_id", nullable = false)
    private User professional;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Review() {}

    public Review(Order order, User client, User professional, Integer rating, String comment) {
        this.order = order;
        this.client = client;
        this.professional = professional;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = OffsetDateTime.now();
    }

    public UUID getId() { return id; }
    public Order getOrder() { return order; }
    public User getClient() { return client; }
    public User getProfessional() { return professional; }
    public Integer getRating() { return rating; }
    public String getComment() { return comment; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}