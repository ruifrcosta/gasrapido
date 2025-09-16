// TypeScript declarations for React and React Native
declare module 'react' {
  import * as React from 'react';
  export = React;
  export as namespace React;
}

declare module 'react-native' {
  import * as ReactNative from 'react-native';
  export = ReactNative;
  export as namespace ReactNative;
}

// Declare the common components
declare module './components/common' {
  import { AlertProps } from './components/common/Alert';
  import { ButtonProps } from './components/common/Button';
  import { CardProps } from './components/common/Card';
  
  export const Alert: React.FC<AlertProps>;
  export const Button: React.FC<ButtonProps>;
  export const Card: React.FC<CardProps>;
}

// Declare the shared package
declare module '@gasrapido/shared' {
  import { Alert, AlertService } from '../../shared/src/services/alertService';
  
  export { Alert };
  export const alertService: AlertService;
}

// JSX namespace
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
