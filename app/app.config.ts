import { ConfigContext, ExpoConfig } from '@expo/config';

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const APP_ENV = process.env.APP_VARIANT || 'production';

const getUniqueIdentifier = () => {
    if (IS_DEV) {
        return 'com.bestbefore.app.dev';
    }
    if (IS_PREVIEW) {
        return 'com.bestbefore.app.preview';
    }
    return 'com.bestbefore.app';
};

const getAppName = () => {
    if (IS_DEV) {
        return '(Dev) BestBefore';
    }

    if (IS_PREVIEW) {
        return '(Preview) BestBefore';
    }

    return 'BestBefore';
};

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: getAppName(),
    slug: 'bestbefore',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'app',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
        supportsTablet: true,
        bundleIdentifier: getUniqueIdentifier(),
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/images/adaptive-icon.png',
            backgroundColor: '#ffffff',
        },
        edgeToEdgeEnabled: true,
        package: getUniqueIdentifier(),
        permissions: ['android.permission.CAMERA'],
        googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
    },
    web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/images/favicon.png',
    },
    plugins: [
        'expo-router',
        [
            '@react-native-google-signin/google-signin',
            {
                iosUrlScheme: 'com.googleusercontent.apps.64881970768-0srddcup1p4joeocn9e0qoler4fasu8r',
            },
        ],
        [
            'expo-camera',
            {
                cameraPermission: "Permetti l'accesso alla fotocamera per $(PRODUCT_NAME)",
            },
        ],
        [
            'expo-splash-screen',
            {
                image: './assets/images/splash-icon.png',
                imageWidth: 200,
                resizeMode: 'contain',
                backgroundColor: '#ffffff',
            },
        ],
        [
            '@sentry/react-native/expo',
            {
                url: 'https://sentry.io/',
                project: 'react-native',
                organization: 'bestbefore',
            },
        ],
    ],
    experiments: {
        typedRoutes: true,
    },
    extra: {
        appVariant: APP_ENV,
        router: {},
        eas: {
            projectId: '9c35470a-d4b0-4345-8975-50c0a38cc869',
        },
    },
    owner: 'carloeusebi',
});
