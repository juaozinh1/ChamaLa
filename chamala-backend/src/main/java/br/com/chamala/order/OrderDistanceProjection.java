package br.com.chamala.order;

import java.time.Instant;
import java.util.UUID;

public interface OrderDistanceProjection {
    UUID getId();
    String getTitle();
    String getDescription();
    String getStatus();
    Long getCategoryId();
    String getCategoryName();
    UUID getClientId();
    String getClientName();
    Instant getScheduledAt();
    Double getLatitude();
    Double getLongitude();
    String getAddressReference();
    Double getDistanceKm();
    Instant getCreatedAt();
}