import 'dotenv/config';

export default {
  expo: {
    name: 'Loocks',
    slug: 'loocks',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'loocks',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    extra: {
      apiUrl: process.env.API_URL,
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'com.anonymous.loocks',
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#000000',
          },
        },
      ],
      'expo-secure-store',
      [
        'expo-font',
        {
          fonts: [
            './assets/fonts/satoshi/Satoshi-Black.otf',
            './assets/fonts/satoshi/Satoshi-BlackItalic.otf',
            './assets/fonts/satoshi/Satoshi-Bold.otf',
            './assets/fonts/satoshi/Satoshi-BoldItalic.otf',
            './assets/fonts/satoshi/Satoshi-Italic.otf',
            './assets/fonts/satoshi/Satoshi-Light.otf',
            './assets/fonts/satoshi/Satoshi-LightItalic.otf',
            './assets/fonts/satoshi/Satoshi-Medium.otf',
            './assets/fonts/satoshi/Satoshi-MediumItalic.otf',
            './assets/fonts/satoshi/Satoshi-Regular.otf',
          ],
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
