import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from './Input';
import { Dropdown } from './Dropdown';
import { Button } from './Button';

interface InvitationFormProps {
  onSubmit: (data: { type: string; email: string }) => void;
  onCancel: () => void;
}

export const InvitationForm: React.FC<InvitationFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'vendor',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Novo Convite</Text>
      
      <Dropdown
        label="Tipo de Convite"
        options={[
          { label: 'Fornecedor', value: 'vendor' },
          { label: 'Entregador', value: 'courier' },
        ]}
        selectedValue={formData.type}
        onValueChange={(value) => handleInputChange('type', value)}
        style={styles.dropdown}
      />
      
      <Input
        label="Email do Convidado"
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        error={errors.email}
        placeholder="convidado@exemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      
      <View style={styles.actions}>
        <Button
          variant="outline"
          size="md"
          onPress={onCancel}
          style={styles.cancelButton}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          size="md"
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          Criar Convite
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  dropdown: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
});