import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@gasrapido/ui/src/components/common/Input';
import { Button } from '@gasrapido/ui/src/components/common/Button';
import { Colors, Spacing, Typography } from '../utils/theme';

export default function SetupAddressScreen() {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    neighborhood: '',
    building: '',
    floor: '',
    apartment: '',
    instructions: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }
    
    if (!formData.neighborhood.trim()) {
      newErrors.neighborhood = 'Bairro é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      // Simulate getting current location
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would use the geolocation service
      // const location = await geolocationService.getCurrentLocation();
      
      setUseCurrentLocation(true);
      Alert.alert('Sucesso', 'Localização obtida com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao obter localização. Por favor, insira manualmente.');
    }
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would save the address here
      // const result = await userService.saveAddress(formData);
      
      Alert.alert(
        'Sucesso',
        'Endereço salvo com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => router.push('/client-dashboard'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar endereço. Por favor, tente novamente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configurar Endereço</Text>
        <Text style={styles.subtitle}>
          Adicione seu endereço para receber entregas
        </Text>
      </View>

      <View style={styles.locationContainer}>
        <Button
          variant="outline"
          size="md"
          onPress={handleUseCurrentLocation}
          style={styles.locationButton}
        >
          Usar Localização Atual
        </Button>
        
        {useCurrentLocation && (
          <Text style={styles.locationText}>
            Localização detectada: Rua Exemplo, 123 - Bairro, Cidade
          </Text>
        )}
      </View>

      <View style={styles.form}>
        <Input
          label="Endereço"
          value={formData.address}
          onChangeText={(value) => handleInputChange('address', value)}
          error={errors.address}
          placeholder="Rua, Avenida, etc."
          style={styles.input}
        />
        
        <View style={styles.row}>
          <View style={styles.halfColumn}>
            <Input
              label="Cidade"
              value={formData.city}
              onChangeText={(value) => handleInputChange('city', value)}
              error={errors.city}
              placeholder="Luanda"
              style={styles.input}
            />
          </View>
          
          <View style={styles.halfColumn}>
            <Input
              label="Bairro"
              value={formData.neighborhood}
              onChangeText={(value) => handleInputChange('neighborhood', value)}
              error={errors.neighborhood}
              placeholder="Bairro"
              style={styles.input}
            />
          </View>
        </View>
        
        <View style={styles.row}>
          <View style={styles.halfColumn}>
            <Input
              label="Prédio (Opcional)"
              value={formData.building}
              onChangeText={(value) => handleInputChange('building', value)}
              placeholder="Nome do prédio"
              style={styles.input}
            />
          </View>
          
          <View style={styles.quarterColumn}>
            <Input
              label="Andar"
              value={formData.floor}
              onChangeText={(value) => handleInputChange('floor', value)}
              placeholder="1"
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>
          
          <View style={styles.quarterColumn}>
            <Input
              label="Apto"
              value={formData.apartment}
              onChangeText={(value) => handleInputChange('apartment', value)}
              placeholder="101"
              style={styles.input}
            />
          </View>
        </View>
        
        <Input
          label="Instruções de Entrega (Opcional)"
          value={formData.instructions}
          onChangeText={(value) => handleInputChange('instructions', value)}
          placeholder="Ponto de referência, horário de preferência, etc."
          multiline
          numberOfLines={3}
          style={[styles.input, styles.textArea]}
        />
        
        <Button
          variant="primary"
          size="lg"
          onPress={handleSaveAddress}
          style={styles.saveButton}
        >
          Salvar Endereço
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    color: Colors.gray,
    textAlign: 'center',
  },
  locationContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  locationButton: {
    marginBottom: Spacing.sm,
  },
  locationText: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  halfColumn: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  quarterColumn: {
    flex: 0.5,
    marginRight: Spacing.sm,
  },
  input: {
    marginBottom: Spacing.md,
  },
  textArea: {
    height: 80,
  },
  saveButton: {
    marginTop: Spacing.lg,
  },
});