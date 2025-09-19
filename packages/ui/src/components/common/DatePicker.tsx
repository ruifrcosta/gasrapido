import React, { useState, forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../utils/theme';

interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange?: (date: Date) => void;
  error?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

export const DatePicker = forwardRef<any, DatePickerProps>(
  ({ 
    label, 
    value, 
    onChange, 
    error, 
    placeholder = 'Selecione uma data',
    minDate,
    maxDate,
    disabled = false,
  }, ref) => {
    const [showPicker, setShowPicker] = useState(false);

    const handleDateChange = (newDate: Date) => {
      if (onChange) {
        onChange(newDate);
      }
      setShowPicker(false);
    };

    const formatDate = (date: Date | undefined) => {
      if (!date) return placeholder;
      return date.toLocaleDateString('pt-AO');
    };

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        
        <TouchableOpacity 
          style={[
            styles.inputContainer,
            error && styles.errorContainer,
            disabled && styles.disabledContainer
          ]}
          onPress={() => !disabled && setShowPicker(true)}
          disabled={disabled}
        >
          <Text style={[
            styles.inputText,
            !value && styles.placeholderText,
            disabled && styles.disabledText
          ]}>
            {formatDate(value)}
          </Text>
          <Ionicons 
            name="calendar" 
            size={20} 
            color={disabled ? Colors.gray : Colors.primary} 
          />
        </TouchableOpacity>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        {/* In a real implementation, you would show a date picker modal here */}
        {showPicker && (
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Selecione uma Data</Text>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Ionicons name="close" size={24} color={Colors.black} />
                </TouchableOpacity>
              </View>
              {/* Date picker implementation would go here */}
              <Text style={styles.pickerPlaceholder}>
                Componente de seleção de data (implementação pendente)
              </Text>
              <TouchableOpacity 
                style={styles.pickerButton}
                onPress={() => {
                  handleDateChange(new Date());
                  setShowPicker(false);
                }}
              >
                <Text style={styles.pickerButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
);

DatePicker.displayName = 'DatePicker';

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
  },
  errorContainer: {
    borderColor: Colors.error,
  },
  disabledContainer: {
    backgroundColor: Colors.lightGray,
  },
  inputText: {
    fontSize: Typography.sizes.md,
    color: Colors.black,
    flex: 1,
  },
  placeholderText: {
    color: Colors.gray,
  },
  disabledText: {
    color: Colors.gray,
  },
  errorText: {
    fontSize: Typography.sizes.sm,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  pickerContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    width: '80%',
    maxWidth: 300,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  pickerTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
  },
  pickerPlaceholder: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
    textAlign: 'center',
    marginVertical: Spacing.xl,
  },
  pickerButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  pickerButtonText: {
    color: Colors.white,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
  },
});