import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { insertUser } from '../../database/db';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export default function CreateProfileScreen({ navigation }) {
  const [name, setName] = useState('');

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  const saveProfile = async () => {
    if (!name.trim()) return;
    await insertUser(name);
    navigation.replace('Fingerprint');
  };

  return (
    <View style={styles.container}>

      {/* Animated Logo */}
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center', marginBottom: 32 }}>
        <Svg width={120} height={120} viewBox="0 0 200 200">
          <Circle cx="100" cy="100" r="90" fill="#2563EB" />
          {/* Bar Chart Icon */}
          <Rect x="60" y="120" width="20" height="30" fill="#fff" rx={4} />
          <Rect x="95" y="100" width="20" height="50" fill="#fff" rx={4} />
          <Rect x="130" y="80" width="20" height="70" fill="#fff" rx={4} />
          {/* Upward arrow */}
          <Path d="M60 140 L100 80 L140 140" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
        </Svg>
      </Animated.View>

      {/* Animated Text */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.title}>Create Profile</Text>
        <Text style={styles.subtitle}>Set up your profile to track Networth & Expenses</Text>
      </Animated.View>

      {/* Input */}
      <Animated.View style={{ opacity: fadeAnim, marginTop: 24 }}>
        <TextInput
          placeholder="Enter your name"
          placeholderTextColor="#6B7280"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={saveProfile}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
