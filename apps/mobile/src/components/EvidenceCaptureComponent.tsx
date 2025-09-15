// @ts-nocheck
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, PermissionsAndroid, Platform } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as Location from 'expo-location';
import { Evidence } from '../../../packages/shared/types/evidence';

interface EvidenceCaptureComponentProps {
  orderId: string;
  clientId: string;
  supplierId: string;
  courierId: string;
  onEvidenceCaptured: (evidence: Evidence) => void;
  onCaptureCancelled: () => void;
}

const EvidenceCaptureComponent: React.FC<EvidenceCaptureComponentProps> = (props: EvidenceCaptureComponentProps) => {
  const { orderId, clientId, supplierId, courierId, onEvidenceCaptured, onCaptureCancelled } = props;
  
  // Estados para controle da captura
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);
  const [photos, setPhotos] = useState<string[]>([]);
  const [location, setLocation] = useState<any | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  
  const cameraRef = useRef<Camera>(null);

  // Solicitar permissões ao carregar o componente
  React.useEffect(() => {
    (async () => {
      // Permissão da câmera
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');
      
      // Permissão de localização
      if (Platform.OS === 'android') {
        const locationStatus = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        setHasLocationPermission(locationStatus === 'granted');
      } else {
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        setHasLocationPermission(locationStatus === 'granted');
      }
    })();
  }, []);

  // Capturar foto
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: true
        });
        
        if (photo.base64) {
          setPhotos((prev: string[]) => [...prev, photo.base64]);
        }
      } catch (error) {
        console.error('Erro ao capturar foto:', error);
        Alert.alert('Erro', 'Falha ao capturar foto');
      }
    }
  };

  // Obter localização atual
  const getCurrentLocation = async () => {
    try {
      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      setLocation(locationResult.coords);
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      Alert.alert('Erro', 'Falha ao obter localização');
    }
  };

  // Finalizar captura de evidências
  const finishCapture = () => {
    if (photos.length === 0) {
      Alert.alert('Aviso', 'Por favor, capture pelo menos uma foto');
      return;
    }
    
    if (!location) {
      Alert.alert('Aviso', 'Não foi possível obter a localização');
      return;
    }
    
    const evidence: Evidence = {
      id: '',
      orderId,
      clientId,
      supplierId,
      courierId,
      deliveryTimestamp: new Date().toISOString(),
      gpsCoordinates: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      photos,
      signature: '',
      checklist: {},
      notes: '',
      capturedAt: new Date().toISOString(),
      hash: ''
    };
    
    onEvidenceCaptured(evidence);
  };

  // Verificar permissões
  if (hasCameraPermission === null || hasLocationPermission === null) {
    return <View style={styles.container}><Text>Solicitando permissões...</Text></View>;
  }
  
  if (!hasCameraPermission || !hasLocationPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Permissões de câmera e localização são necessárias para capturar evidências
        </Text>
        <TouchableOpacity style={styles.button} onPress={onCaptureCancelled}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Captura de Evidências</Text>
        
        <View style={styles.cameraContainer}>
          <Camera 
            style={styles.camera} 
            type={cameraType}
            ref={cameraRef}
          >
            <View style={styles.cameraControls}>
              <TouchableOpacity 
                style={styles.flipButton}
                onPress={() => setCameraType(
                  cameraType === CameraType.back 
                    ? CameraType.front 
                    : CameraType.back
                )}
              >
                <Text style={styles.controlText}>Virar Câmera</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
        
        <View style={styles.controls}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.captureButtonText}>Capturar Foto</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
            <Text style={styles.buttonText}>Atualizar Localização</Text>
          </TouchableOpacity>
        </View>
        
        {location && (
          <View style={styles.locationInfo}>
            <Text>Localização atual:</Text>
            <Text>Lat: {location.latitude.toFixed(6)}</Text>
            <Text>Lng: {location.longitude.toFixed(6)}</Text>
          </View>
        )}
        
        <View style={styles.photosContainer}>
          <Text>Fotos capturadas: {photos.length}</Text>
          {photos.map((photo: string, index: number) => (
            <View key={index} style={styles.thumbnailContainer}>
              <Text> Foto {index + 1}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCaptureCancelled}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.finishButton, photos.length === 0 && styles.disabledButton]} 
            onPress={finishCapture}
            disabled={photos.length === 0}
          >
            <Text style={styles.buttonText}>Finalizar Captura</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  cameraContainer: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  controlText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flipButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  captureButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  captureButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationInfo: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  photosContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  thumbnailContainer: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  finishButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  errorText: {
    textAlign: 'center',
    color: '#f44336',
    fontSize: 16,
    marginBottom: 20,
  },
});

export default EvidenceCaptureComponent;