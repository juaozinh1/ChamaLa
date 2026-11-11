package br.com.chamala.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {

    @Query(value = """
        SELECT 
            o.id AS id,
            o.title AS title,
            o.description AS description,
            o.status AS status,
            c.id AS categoryId,
            c.name AS categoryName,
            u.id AS clientId,
            u.name AS clientName,
            o.scheduled_at AS scheduledAt,
            o.latitude AS latitude,
            o.longitude AS longitude,
            o.address_reference AS addressReference,
            o.created_at AS createdAt,
            (6371 * acos(
                least(1.0, greatest(-1.0,
                    cos(radians(:profLat)) * cos(radians(o.latitude)) * 
                    cos(radians(o.longitude) - radians(:profLon)) + 
                    sin(radians(:profLat)) * sin(radians(o.latitude))
                ))
            )) AS distanceKm
        FROM orders o
        INNER JOIN categories c ON c.id = o.category_id
        INNER JOIN users u ON u.id = o.client_id
        WHERE o.status = 'OPEN'
          AND (cast(:categoryId as bigint) IS NULL OR o.category_id = cast(:categoryId as bigint))
        ORDER BY 
          CASE WHEN :closestFirst = true THEN 
               (6371 * acos(least(1.0, greatest(-1.0, cos(radians(:profLat)) * cos(radians(o.latitude)) * cos(radians(o.longitude) - radians(:profLon)) + sin(radians(:profLat)) * sin(radians(o.latitude)))))) 
          END ASC,
          CASE WHEN :closestFirst = false THEN 
               (6371 * acos(least(1.0, greatest(-1.0, cos(radians(:profLat)) * cos(radians(o.latitude)) * cos(radians(o.longitude) - radians(:profLon)) + sin(radians(:profLat)) * sin(radians(o.latitude)))))) 
          END DESC,
          o.scheduled_at ASC
        """, nativeQuery = true)
    List<OrderDistanceProjection> findNearbyOrders(
        @Param("profLat") double profLat,
        @Param("profLon") double profLon,
        @Param("categoryId") Long categoryId,
        @Param("closestFirst") boolean closestFirst
    );

    List<Order> findByClientIdOrderByCreatedAtDesc(UUID clientId);

    List<Order> findByProfessionalIdOrderByCreatedAtDesc(UUID professionalId);
}