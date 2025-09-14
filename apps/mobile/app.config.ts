import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'GasRápido',
  slug: 'gasrapido',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#1F3A93',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'ao.gasrapido.app',
    buildNumber: '1.0.0',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#1F3A93',
    },
    package: 'ao.gasrapido.app',
    versionCode: 1,
    permissions: [
      'ACCESS_COARSE_LOCATION',
      'ACCESS_FINE_LOCATION',
      'CAMERA',
      'RECORD_AUDIO',
      'VIBRATE',
      'RECEIVE_BOOT_COMPLETED',
      'WAKE_LOCK',
    ],
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
    output: 'static',
    lang: 'pt',
  },
  plugins: [
    'expo-router',
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: '#1F3A93',
        defaultChannel: 'default',
      },
    ],
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission:
          'Allow $(PRODUCT_NAME) to use your location to find nearby gas stations and track deliveries.',
        locationAlwaysPermission:
          'Allow $(PRODUCT_NAME) to use your location to find nearby gas stations and track deliveries.',
        locationWhenInUsePermission:
          'Allow $(PRODUCT_NAME) to use your location to find nearby gas stations and track deliveries.',
      },
    ],
  ],
  scheme: 'gasrapido',
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: 'your-project-id-here',
    },
  },
});