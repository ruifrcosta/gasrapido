import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TextInputChangeEventData, NativeSyntheticEvent } from 'react-native';
import { Button, Card } from '@gasrapido/ui';

interface OrderFormData {
  clientName: string;
  clientPhone: string;
  deliveryAddress: string;
  deliveryInstructions: string;
  gasType: string;
  quantity: number;
}

const CreateOrderScreen = () => {
  const [formData, setFormData] = useState<OrderFormData>({
    clientName: '',
    clientPhone: '',
    deliveryAddress: '',
    deliveryInstructions: '',
    gasType: 'propano',
    quantity: 1,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof OrderFormData, string>> = {};
    
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Nome é obrigatório';
    }
    
    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = 'Telefone é obrigatório';
    } else if (!/^\d{9,15}$/.test(formData.clientPhone)) {
      newErrors.clientPhone = 'Telefone inválido';
    }
    
    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Endereço de entrega é obrigatório';
    }
    
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantidade deve ser maior que zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof OrderFormData, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: undefined,
      });
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Aqui seria a chamada para o serviço de API
      Alert.alert(
        'Pedido Criado',
        'Seu pedido foi criado com sucesso!',
        [{ text: 'OK' }]
      );
      // Reset form after successful submission
      setFormData({
        clientName: '',
        clientPhone: '',
        deliveryAddress: '',
        deliveryInstructions: '',
        gasType: 'propano',
        quantity: 1,
      });
    }
  };

  const handleTextChange = (field: keyof OrderFormData) => (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    handleInputChange(field, e.nativeEvent.text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Novo Pedido</Text>
      
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Dados do Cliente</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome Completo *</Text>
          <TextInput
            style={[styles.input, errors.clientName && styles.inputError]}
            value={formData.clientName}
            onChange={handleTextChange('clientName')}
            placeholder="Digite seu nome completo"
          />
          {errors.clientName && <Text style={styles.errorText}>{errors.clientName}</Text>}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefone *</Text>
          <TextInput
            style={[styles.input, errors.clientPhone && styles.inputError]}
            value={formData.clientPhone}
            onChange={handleTextChange('clientPhone')}
            placeholder="Digite seu telefone"
            keyboardType="phone-pad"
          />
          {errors.clientPhone && <Text style={styles.errorText}>{errors.clientPhone}</Text>}
        </View>
      </Card>
      
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Detalhes da Entrega</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Endereço de Entrega *</Text>
          <TextInput
            style={[styles.input, errors.deliveryAddress && styles.inputError]}
            value={formData.deliveryAddress}
            onChange={handleTextChange('deliveryAddress')}
            placeholder="Rua, número, bairro, cidade"
          />
          {errors.deliveryAddress && <Text style={styles.errorText}>{errors.deliveryAddress}</Text>}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Instruções Adicionais</Text>
          <TextInput
            style={[styles.textArea]}
            value={formData.deliveryInstructions}
            onChange={handleTextChange('deliveryInstructions')}
            placeholder="Detalhes adicionais para a entrega"
            multiline
            numberOfLines={3}
          />
        </View>
      </Card>
      
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Detalhes do Produto</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de Gás</Text>
          <View style={styles.radioGroup}>
            <Button
              variant={formData.gasType === 'propano' ? 'primary' : 'outline'}
              onPress={() => handleInputChange('gasType', 'propano')}
              style={styles.radioButton}
            >
              Propano
            </Button>
            <Button
              variant={formData.gasType === 'butano' ? 'primary' : 'outline'}
              onPress={() => handleInputChange('gasType', 'butano')}
              style={styles.radioButton}
            >
              Butano
            </Button>
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quantidade *</Text>
          <View style={styles.quantityContainer}>
            <Button
              variant="outline"
              onPress={() => handleInputChange('quantity', Math.max(1, formData.quantity - 1))}
              disabled={formData.quantity <= 1}
            >
              -
            </Button>
            <Text style={styles.quantityText}>{formData.quantity}</Text>
            <Button
              variant="outline"
              onPress={() => handleInputChange('quantity', formData.quantity + 1)}
            >
              +
            </Button>
          </View>
          {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
        </View>
      </Card>
      
      <Button 
        variant="primary" 
        size="lg" 
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        Criar Pedido
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#444',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    height: 80,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 4,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  submitButton: {
    marginVertical: 20,
  },
});

export default CreateOrderScreen;