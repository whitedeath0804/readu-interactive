import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Short hold so users see the brand; replace with your auth gate later if you like.
    const t = setTimeout(() => {
      router.replace('/welcome'); // or your gate will redirect from here
    }, 900);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <LinearGradient
      colors={['#F7A035', '#E43D33']} // orange -> red
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar style="light" />
      <View style={styles.centerWrap}>
        <View style={styles.circle}>
          <Image
            source={require('../assets/images/readu-logo-md.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.tagline}>A new era of learning</Text>
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
    paddingBottom: 60, // lifts it a bit like your mock
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
    marginTop: 28,
    fontSize: 18,
    lineHeight: 24,
    color: 'white',
    fontWeight: '700', // if your Montserrat loads, it’ll switch automatically
    letterSpacing: 0.3,
  },
});
