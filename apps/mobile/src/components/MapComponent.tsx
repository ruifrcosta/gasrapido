import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@gasrapido/ui';

// Definir interfaces locais
interface Location {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
  altitude?: number;
  speed?: number;
}

interface MapMarker {
  id: string;
  location: Location;
  title: string;
  description?: string;
  type: 'client' | 'courier' | 'supplier' | 'destination';
}

interface MapComponentProps {
  initialLocation?: Location;
  markers?: MapMarker[];
  onLocationUpdate?: (location: Location) => void;
  onMarkerPress?: (marker: MapMarker) => void;
  showUserLocation?: boolean;
  style?: any;
}

const MapComponent: React.FC<MapComponentProps> = (props: MapComponentProps) => {
  const { 
    initialLocation, 
    markers = [], 
    onLocationUpdate, 
    onMarkerPress,
    showUserLocation = true,
    style 
  } = props;
  
  const [currentLocation, setCurrentLocation] = useState<Location | null>(initialLocation || null);
  const [tracking, setTracking] = useState<boolean>(true);

  useEffect(() => {
    if (tracking) {
      startLocationTracking();
    }
    
    return () => {
      stopLocationTracking();
    };
  }, [tracking]);

  const startLocationTracking = () => {
    // Em uma implementação real, isso usaria APIs de geolocalização
    const interval = setInterval(() => {
      // Simular atualização de localização
      const newLocation: Location = {
        latitude: 38.7223 + (Math.random() - 0.5) * 0.01,
        longitude: -9.1393 + (Math.random() - 0.5) * 0.01,
        timestamp: new Date().toISOString(),
        accuracy: 5 + Math.random() * 10,
        speed: Math.random() * 20
      };
      
      setCurrentLocation(newLocation);
      
      if (onLocationUpdate) {
        onLocationUpdate(newLocation);
      }
    }, 5000); // Atualizar a cada 5 segundos
    
    // Cleanup function
    return () => clearInterval(interval);
  };

  const stopLocationTracking = () => {
    // Em uma implementação real, isso pararia o rastreamento de localização
    console.log('Parando rastreamento de localização');
  };

  const getMarkerIcon = (type: MapMarker['type']) => {
    switch (type) {
      case 'client': return '🏠';
      case 'courier': return '🚚';
      case 'supplier': return '🏭';
      case 'destination': return '📍';
      default: return '📍';
    }
  };

  const getMarkerColor = (type: MapMarker['type']) => {
    switch (type) {
      case 'client': return '#28a745';
      case 'courier': return '#007bff';
      case 'supplier': return '#6f42c1';
      case 'destination': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const handleMarkerPress = (marker: MapMarker) => {
    if (onMarkerPress) {
      onMarkerPress(marker);
    }
  };

  const toggleTracking = () => {
    setTracking(!tracking);
  };

  return (
    <Card style={[styles.container, style]}>
      <View style={styles.mapHeader}>
        <Text style={styles.mapTitle}>Mapa em Tempo Real</Text>
        <Text style={styles.trackingStatus}>
          {tracking ? 'Rastreando...' : 'Rastreamento pausado'}
        </Text>
      </View>
      
      <View style={styles.mapContainer}>
        {/* Em uma implementação real, isso seria um componente de mapa real */}
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>Mapa Interativo</Text>
          
          {/* Representação visual do mapa */}
          <View style={styles.mapVisual}>
            {/* Grade de fundo */}
            {[...Array(20)].map((_, i) => (
              <View key={i} style={styles.mapGridLine} />
            ))}
            
            {/* Marcadores no mapa */}
            {markers.map((marker: MapMarker) => (
              <View 
                key={marker.id}
                style={[
                  styles.mapMarker,
                  {
                    left: `${50 + (marker.location.longitude + 9.1393) * 1000}%`,
                    top: `${50 - (marker.location.latitude - 38.7223) * 1000}%`,
                    backgroundColor: getMarkerColor(marker.type)
                  }
                ]}
                onStartShouldSetResponder={() => true}
                onResponderGrant={() => handleMarkerPress(marker)}
              >
                <Text style={styles.markerIcon}>{getMarkerIcon(marker.type)}</Text>
              </View>
            ))}
            
            {/* Localização do usuário */}
            {showUserLocation && currentLocation && (
              <View 
                style={[
                  styles.userLocation,
                  {
                    left: `${50 + (currentLocation.longitude + 9.1393) * 1000}%`,
                    top: `${50 - (currentLocation.latitude - 38.7223) * 1000}%`
                  }
                ]}
              >
                <View style={styles.userLocationInner} />
              </View>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.mapControls}>
        <Text style={styles.controlsText}>
          Toque nos marcadores para mais informações
        </Text>
      </View>
      
      {/* Informações de localização */}
      {currentLocation && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            Lat: {currentLocation.latitude.toFixed(6)}
          </Text>
          <Text style={styles.locationText}>
            Lng: {currentLocation.longitude.toFixed(6)}
          </Text>
          {currentLocation.speed !== undefined && (
            <Text style={styles.locationText}>
              Vel: {currentLocation.speed.toFixed(1)} km/h
            </Text>
          )}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  trackingStatus: {
    fontSize: 14,
    color: '#007bff',
  },
  mapContainer: {
    flex: 1,
    minHeight: 300,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    overflow: 'hidden',
  },
  mapPlaceholderText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '600',
  },
  mapVisual: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#f8f9fa',
  },
  mapGridLine: {
    position: 'absolute',
    backgroundColor: '#dee2e6',
  },
  mapMarker: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  markerIcon: {
    fontSize: 18,
    color: 'white',
  },
  userLocation: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  userLocationInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  mapControls: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginTop: 16,
  },
  controlsText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  locationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    marginTop: 16,
  },
  locationText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '600',
  },
});

export default MapComponent;