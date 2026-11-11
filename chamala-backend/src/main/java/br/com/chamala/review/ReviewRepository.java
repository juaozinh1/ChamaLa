package br.com.chamala.review;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    boolean existsByOrderId(UUID orderId);
    Optional<Review> findByOrderId(UUID orderId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.professional.id = :professionalId")
    Double calculateAverageRating(@Param("professionalId") UUID professionalId);

    long countByProfessionalId(UUID professionalId);
}