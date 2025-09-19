import React, { useState, forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../utils/theme';

interface FileUploadProps {
  label?: string;
  onFileSelect?: (file: File | null) => void;
  error?: string;
  placeholder?: string;
  accept?: string;
  disabled?: boolean;
  maxSize?: number; // in bytes
}

export const FileUpload = forwardRef<any, FileUploadProps>(
  ({ 
    label, 
    onFileSelect, 
    error, 
    placeholder = 'Selecione um arquivo',
    accept,
    disabled = false,
    maxSize,
  }, ref) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileSelect = () => {
      if (disabled) return;
      
      // In a real implementation, you would open a file picker here
      // For demo purposes, we'll simulate file selection
      const mockFile = {
        name: 'documento.pdf',
        size: 1024000, // 1MB
        type: 'application/pdf',
      } as File;
      
      if (maxSize && mockFile.size > maxSize) {
        alert(`O arquivo deve ter no máximo ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
        return;
      }
      
      setSelectedFile(mockFile);
      if (onFileSelect) {
        onFileSelect(mockFile);
      }
      
      // Generate preview for images
      if (mockFile.type.startsWith('image/')) {
        setPreview('https://via.placeholder.com/100x100/1F3A93/FFFFFF?text=IMG');
      } else {
        setPreview(null);
      }
    };

    const handleRemoveFile = () => {
      setSelectedFile(null);
      setPreview(null);
      if (onFileSelect) {
        onFileSelect(null);
      }
    };

    const getFileIcon = (fileType: string) => {
      if (fileType.startsWith('image/')) {
        return 'image';
      } else if (fileType.includes('pdf')) {
        return 'document';
      } else if (fileType.includes('word')) {
        return 'document-text';
      } else {
        return 'document';
      }
    };

    const formatFileSize = (bytes: number) => {
      if (bytes < 1024) return bytes + ' bytes';
      else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        
        {!selectedFile ? (
          <TouchableOpacity 
            style={[
              styles.uploadContainer,
              error && styles.errorContainer,
              disabled && styles.disabledContainer
            ]}
            onPress={handleFileSelect}
            disabled={disabled}
          >
            <Ionicons 
              name="cloud-upload" 
              size={24} 
              color={disabled ? Colors.gray : Colors.primary} 
            />
            <Text style={[
              styles.uploadText,
              disabled && styles.disabledText
            ]}>
              {placeholder}
            </Text>
            <Text style={styles.uploadSubtext}>
              {accept ? `Formatos: ${accept}` : 'Qualquer formato'}
              {maxSize && ` (Máx. ${(maxSize / 1024 / 1024).toFixed(1)}MB)`}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.fileInfoContainer}>
            <View style={styles.fileInfo}>
              {preview ? (
                <Image source={{ uri: preview }} style={styles.filePreview} />
              ) : (
                <View style={styles.fileIconContainer}>
                  <Ionicons 
                    name={getFileIcon(selectedFile.type) as any} 
                    size={24} 
                    color={Colors.primary} 
                  />
                </View>
              )}
              <View style={styles.fileDetails}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {selectedFile.name}
                </Text>
                <Text style={styles.fileSize}>
                  {formatFileSize(selectedFile.size)}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={handleRemoveFile}
            >
              <Ionicons name="close" size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
        )}
        
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

FileUpload.displayName = 'FileUpload';

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
  uploadContainer: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  errorContainer: {
    borderColor: Colors.error,
  },
  disabledContainer: {
    backgroundColor: Colors.lightGray,
  },
  uploadText: {
    fontSize: Typography.sizes.md,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  disabledText: {
    color: Colors.gray,
  },
  uploadSubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
  },
  fileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    backgroundColor: Colors.white,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  filePreview: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: Typography.sizes.md,
    color: Colors.black,
    fontWeight: Typography.weights.medium,
    marginBottom: Spacing.xs,
  },
  fileSize: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
  },
  removeButton: {
    padding: Spacing.sm,
  },
  errorText: {
    fontSize: Typography.sizes.sm,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});