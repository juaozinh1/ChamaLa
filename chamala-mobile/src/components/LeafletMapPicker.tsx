import React, { useRef, useEffect } from 'react';
import { View, Platform, Text } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

interface LeafletMapPickerProps {
  initialCoords: { lat: number; lng: number };
  onLocationSelected: (coords: { lat: number; lng: number }) => void;
}

export const LeafletMapPicker = ({ initialCoords, onLocationSelected }: LeafletMapPickerProps) => {
  const leafletHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body, html, #map { margin: 0; padding: 0; height: 100%; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map').setView([${initialCoords.lat}, ${initialCoords.lng}], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
          }).addTo(map);

          let marker = L.marker([${initialCoords.lat}, ${initialCoords.lng}], { draggable: true }).addTo(map);

          function sendLocation(lat, lng) {
            const payload = JSON.stringify({ lat, lng });
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(payload);
            } else {
              window.parent.postMessage(payload, '*');
            }
          }

          map.on('click', function(e) {
            marker.setLatLng(e.latlng);
            sendLocation(e.latlng.lat, e.latlng.lng);
          });

          marker.on('dragend', function(e) {
            const pos = marker.getLatLng();
            sendLocation(pos.lat, pos.lng);
          });
        </script>
      </body>
    </html>
  `;

  // ==========================================
  // Renderização para Navegador Web (Expo Web)
  // ==========================================
  if (Platform.OS === 'web') {
    useEffect(() => {
      const handleWebMessage = (event: MessageEvent) => {
        try {
          if (typeof event.data === 'string') {
            const data = JSON.parse(event.data);
            if (data && typeof data.lat === 'number' && typeof data.lng === 'number') {
              onLocationSelected(data);
            }
          }
        } catch {
          // Ignora mensagens de outras extensões do browser
        }
      };

      window.addEventListener('message', handleWebMessage);
      return () => window.removeEventListener('message', handleWebMessage);
    }, [onLocationSelected]);

    return (
      <View style={globalStyles.mapContainer}>
        <iframe
          srcDoc={leafletHtml}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Leaflet Map"
        />
      </View>
    );
  }

  // ==========================================
  // Renderização Nativa (Android / iOS)
  // ==========================================
  const { WebView: RNWebView } = require('react-native-webview');
  const WebView = RNWebView as React.ComponentType<any>;
  const webViewRef = useRef<any>(null);

  return (
    <View style={globalStyles.mapContainer}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: leafletHtml }}
        onMessage={(event: any) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            onLocationSelected(data);
          } catch (e) {
            console.error('Erro ao processar coordenadas do Leaflet', e);
          }
        }}
      />
    </View>
  );
};