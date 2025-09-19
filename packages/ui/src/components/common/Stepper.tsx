import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../utils/theme';

interface Step {
  id: string;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepPress?: (stepIndex: number) => void;
  vertical?: boolean;
}

export const Stepper: React.FC<StepperProps> = ({ 
  steps, 
  currentStep, 
  onStepPress,
  vertical = false,
}) => {
  const handleStepPress = (index: number) => {
    if (onStepPress && index < currentStep) {
      onStepPress(index);
    }
  };

  if (vertical) {
    return (
      <View style={styles.verticalContainer}>
        {steps.map((step, index) => (
          <View key={step.id} style={styles.verticalStepContainer}>
            <View style={styles.verticalStepIndicator}>
              <View style={[
                styles.verticalStepCircle,
                index < currentStep && styles.completedStepCircle,
                index === currentStep && styles.activeStepCircle,
              ]}>
                {index < currentStep ? (
                  <Text style={styles.completedStepText}>✓</Text>
                ) : (
                  <Text style={[
                    styles.stepNumber,
                    index === currentStep && styles.activeStepNumber,
                  ]}>
                    {index + 1}
                  </Text>
                )}
              </View>
              {index < steps.length - 1 && (
                <View style={[
                  styles.verticalStepLine,
                  index < currentStep - 1 && styles.completedStepLine,
                ]} />
              )}
            </View>
            <View style={styles.verticalStepContent}>
              <Text style={[
                styles.stepTitle,
                index < currentStep && styles.completedStepTitle,
                index === currentStep && styles.activeStepTitle,
              ]}>
                {step.title}
              </Text>
              {step.description && (
                <Text style={styles.stepDescription}>
                  {step.description}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={step.id} style={styles.stepContainer}>
          <TouchableOpacity 
            style={styles.stepIndicator}
            onPress={() => handleStepPress(index)}
            disabled={index >= currentStep}
          >
            <View style={[
              styles.stepCircle,
              index < currentStep && styles.completedStepCircle,
              index === currentStep && styles.activeStepCircle,
            ]}>
              {index < currentStep ? (
                <Text style={styles.completedStepText}>✓</Text>
              ) : (
                <Text style={[
                  styles.stepNumber,
                  index === currentStep && styles.activeStepNumber,
                ]}>
                  {index + 1}
                </Text>
              )}
            </View>
            {index < steps.length - 1 && (
              <View style={[
                styles.stepLine,
                index < currentStep && styles.completedStepLine,
              ]} />
            )}
          </TouchableOpacity>
          <Text style={[
            styles.stepTitle,
            index < currentStep && styles.completedStepTitle,
            index === currentStep && styles.activeStepTitle,
          ]}>
            {step.title}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  activeStepCircle: {
    backgroundColor: Colors.primary,
  },
  completedStepCircle: {
    backgroundColor: Colors.success,
  },
  stepNumber: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
    fontWeight: Typography.weights.bold,
  },
  activeStepNumber: {
    color: Colors.white,
  },
  completedStepText: {
    fontSize: Typography.sizes.sm,
    color: Colors.white,
    fontWeight: Typography.weights.bold,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.lightGray,
    marginLeft: Spacing.xs,
  },
  completedStepLine: {
    backgroundColor: Colors.success,
  },
  stepTitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
    textAlign: 'center',
    fontWeight: Typography.weights.medium,
  },
  activeStepTitle: {
    color: Colors.primary,
  },
  completedStepTitle: {
    color: Colors.success,
  },
  verticalContainer: {
    marginBottom: Spacing.lg,
  },
  verticalStepContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  verticalStepIndicator: {
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  verticalStepCircle: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  verticalStepLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.lightGray,
    marginTop: Spacing.xs,
  },
  verticalStepContent: {
    flex: 1,
  },
  stepDescription: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray,
    marginTop: Spacing.xs,
  },
});