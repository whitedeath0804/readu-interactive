import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typography';

export default function Splash() {
  // Prefer constants, fall back to hardcoded if not present
  const gradient = (Colors as any)?.gradient ?? ['#F7A035', '#E43D33'];

  return (
    <LinearGradient
      colors={gradient as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar style="light" />
      <View style={styles.centerWrap}>
        <View style={styles.circle}>
          <Image
            // adjust path if your alias differs
            source={require('@/assets/images/readu-logo-md.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Tagline — uses your Typography + Colors */}
        <Text style={styles.tagline}>Ново начало в обучението</Text>
        {/* If you want English instead, swap the text above:
            <Text style={styles.tagline}>A new era of learning</Text>
        */}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60, // similar spacing to the mock
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 999,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  logo: { width: '70%', height: '70%' },
  tagline: {
    ...Typo.body1,
    textAlign: 'center',
    marginTop: 28,
    color: Colors.text,
  },
});
