import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';

// Importa o MapView apenas se NÃO estiver na Web para evitar erros no navegador
let MapView: any = null;
let Marker: any = null;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
}

interface OrderItemProps {
  order: {
    id: string;
    title: string;
    clientName: string;
    addressReference: string;
    distanceKm: number;
    latitude: number;
    longitude: number;
  };
}

export function OrderCard({ order }: OrderItemProps) {
  const hasCoordinates = order.latitude != null && order.longitude != null;

  // Abre rota externa no Google Maps / Waze
  const handleOpenNavigation = () => {
    if (!hasCoordinates) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${order.latitude},${order.longitude}`;
    Linking.openURL(url);
  };

  // URL para embutir o mapa interativo no PC (OpenStreetMap gratuito, sem API Key)
  const webMapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${order.longitude - 0.005}%2C${order.latitude - 0.003}%2C${order.longitude + 0.005}%2C${order.latitude + 0.003}&layer=mapnik&marker=${order.latitude}%2C${order.longitude}`;

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{order.title}</Text>
        <Text style={styles.client}>Cliente: {order.clientName}</Text>
        <Text style={styles.address}>Endereço: {order.addressReference}</Text>
        <Text style={styles.distance}>
          Distância: {order.distanceKm ? `${Number(order.distanceKm).toFixed(1)} km` : 'Próximo'}
        </Text>
      </View>

      {hasCoordinates ? (
        <View style={styles.mapContainer}>
          {Platform.OS === 'web' ? (
            /* Renderização no Computador (Navegador) */
            <iframe
              title={`map-${order.id}`}
              src={webMapSrc}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          ) : (
            /* Renderização no Celular (Android / iOS) */
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: order.latitude,
                longitude: order.longitude,
                latitudeDelta: 0.009,
                longitudeDelta: 0.009,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: order.latitude,
                  longitude: order.longitude,
                }}
                title={order.title}
                description={order.addressReference}
              />
            </MapView>
          )}

          <TouchableOpacity style={styles.navButton} onPress={handleOpenNavigation}>
            <Text style={styles.navButtonText}>Abrir no Maps</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.noLocationText}>Localização indisponível no mapa</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  client: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  address: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
  distance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 4,
  },
  mapContainer: {
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 8,
    backgroundColor: '#E5E7EB',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  navButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    zIndex: 10,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noLocationText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginTop: 8,
  },
});