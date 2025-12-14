import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export default function FingerprintScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    authenticate();
  }, []);

  const authenticate = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate',
      fallbackLabel: 'Use Passcode',
    });

    if (result.success) {
      navigation.replace('Dashboard');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        {/* Fingerprint SVG Icon */}
        <Svg width={120} height={120} viewBox="0 0 200 200">
          <Circle cx="100" cy="100" r="90" fill="#1E293B" />
          <Path
            d="M100 50 C85 50 70 75 70 100 C70 125 85 150 100 150 C115 150 130 125 130 100 C130 75 115 50 100 50 Z"
            stroke="#2563EB"
            strokeWidth="8"
            fill="none"
          />
          <Path
            d="M100 60 C90 60 80 85 80 100 C80 115 90 140 100 140 C110 140 120 115 120 100 C120 85 110 60 100 60 Z"
            stroke="#3B82F6"
            strokeWidth="6"
            fill="none"
          />
        </Svg>

        {/* Title */}
        {/* <Text style={styles.title}>Authenticate</Text> */}
        {/* <Text style={styles.subtitle}>Use your fingerprint to access your account</Text> */}

        {/* Only text */}
        <Text style={styles.useFingerprint} onPress={authenticate}>Use Fingerprint</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // deep black-blue
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    marginTop: 24,
    textAlign: 'center',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 32,
  },
  useFingerprint: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
});
