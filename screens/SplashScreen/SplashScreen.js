import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { getUser } from '../../database/db';

export default function SplashScreen({ navigation }) {

  useEffect(() => {
    const timer = setTimeout(async () => {
      const user = await getUser();
      if (user) navigation.replace('Fingerprint');
      else navigation.replace('CreateProfile');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>

      {/* SVG Logo */}
      <Svg width={140} height={140} viewBox="0 0 200 200">
        <Circle cx="100" cy="100" r="90" fill="#1E3A8A" />

        {/* Finance Arrow */}
        <Path
          d="M60 110 L100 70 L140 110"
          stroke="#FFFFFF"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bar chart */}
        <Path d="M70 120 V150" stroke="#FFFFFF" strokeWidth="8" />
        <Path d="M100 110 V150" stroke="#FFFFFF" strokeWidth="8" />
        <Path d="M130 100 V150" stroke="#FFFFFF" strokeWidth="8" />
      </Svg>

      <Text style={styles.title}>Moneysettle</Text>
      <Text style={styles.subtitle}>Smart • Secure • Simple</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 24,
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#CBD5E1',
  },
});
