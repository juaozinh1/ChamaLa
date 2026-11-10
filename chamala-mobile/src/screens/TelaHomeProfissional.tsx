import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, Image, TouchableOpacity, Linking, Platform } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { Button, AlertBanner } from '../components';
import { api } from '../services/api';

interface OrderItem {
  id: string;
  title: string;
  description: string;
  clientName: string;
  categoryName: string;
  addressReference?: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
}

export const TelaHomeProfissional = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Coordenadas base do profissional (Recife)
  const profLat = -8.0578;
  const profLon = -34.8829;

  const fetchNearbyOrders = async () => {
    try {
      setError('');
      const response = await api.get('/api/v1/orders/nearby', {
        params: {
          lat: profLat,
          lon: profLon,
          closestFirst: true,
        },
      });
      setOrders(response.data || []);
    } catch (err: any) {
      setError('Não foi possível carregar os pedidos próximos.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNearbyOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNearbyOrders();
  };

  const handleOpenMaps = (lat: number, lon: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    Linking.openURL(url);
  };

  return (
    <View style={globalStyles.screenContainer}>
      <ScrollView
        contentContainerStyle={globalStyles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={globalStyles.headerLeftBlock}>
          <Text style={globalStyles.titleLeft}>Painel do Profissional 🛠️</Text>
          <Text style={globalStyles.subtitleLeft}>Chamados disponíveis na sua região</Text>
        </View>

        {error ? (
          <View style={{ marginBottom: 16 }}>
            <AlertBanner message={error} variant="error" />
          </View>
        ) : null}

        {loading ? (
          <ActivityIndicator size="large" color="#0284c7" style={{ marginTop: 32 }} />
        ) : orders.length === 0 ? (
          <View style={[globalStyles.cardBox, { alignItems: 'center', paddingVertical: 32 }]}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>📭</Text>
            <Text style={globalStyles.sectionTitle}>Nenhum pedido no momento</Text>
            <Text style={[globalStyles.subtitleLeft, { textAlign: 'center', marginTop: 4 }]}>
              Puxe para baixo para atualizar a lista.
            </Text>
          </View>
        ) : (
          <View style={globalStyles.formSection}>
            {orders.map((order) => {
              const lat = Number(order.latitude);
              const lon = Number(order.longitude);
              const hasCoords = !isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0;

              // Imagem estática do mapa via OpenStreetMap (funciona em qualquer navegador sem chave de API)
              const staticMapUrl = hasCoords
                ? `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lon}&zoom=15&size=500x200&maptype=mapnik&markers=${lat},${lon},ol-marker`
                : '';

              return (
                <View key={order.id} style={globalStyles.cardBox}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[globalStyles.sectionTitle, { flex: 1 }]}>{order.title}</Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0284c7' }}>
                      {order.distanceKm != null ? `${Number(order.distanceKm).toFixed(1)} km` : 'Próximo'}
                    </Text>
                  </View>

                  <Text style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                    Cliente: {order.clientName} • {order.categoryName}
                  </Text>

                  <Text style={{ fontSize: 14, color: '#334155', marginVertical: 8 }}>
                    {order.description}
                  </Text>

                  {order.addressReference ? (
                    <Text style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
                      Ref: {order.addressReference}
                    </Text>
                  ) : null}

                  {/* Visualização do Mapa */}
                  {hasCoords ? (
                    <View style={{ width: '100%', height: 160, borderRadius: 8, overflow: 'hidden', marginVertical: 10, position: 'relative', backgroundColor: '#e2e8f0' }}>
                      <Image
                        source={{ uri: staticMapUrl }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          backgroundColor: '#0284c7',
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          borderRadius: 6,
                        }}
                        onPress={() => handleOpenMaps(lat, lon)}
                      >
                        <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: 'bold' }}>
                          Abrir no Google Maps ↗
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic', marginVertical: 6 }}>
                      Localização no mapa não disponível
                    </Text>
                  )}

                  <Button title="Aceitar Chamado" onPress={() => {}} />
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};