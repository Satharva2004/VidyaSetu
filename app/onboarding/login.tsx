import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { OnboardingPalette } from '@/constants/onboarding';

const modes = [
  { key: 'login', label: 'Log in' },
  { key: 'signup', label: 'Sign up' },
] as const;

type Mode = (typeof modes)[number]['key'];

const socialProviders = [
  { key: 'google', label: 'Continue with Google', icon: 'logo-google' },
  { key: 'apple', label: 'Sign in with Apple', icon: 'logo-apple' },
];

const CLASS_SELECTION_ROUTE = '/onboarding/class-selection' as const;

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const title = useMemo(() => (mode === 'login' ? 'Welcome back' : 'Create account'), [mode]);
  const subtitle = useMemo(
    () =>
      mode === 'login'
        ? 'Offline AI tutor that keeps you learning anywhere.'
        : 'Set up your offline-first study companion in minutes.',
    [mode],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View>
          <Text style={styles.stepText}>Step 0 of 3</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: '15%' }]} />
          </View>
        </View>

        <View>
          <Text style={styles.eyebrow}>VidyaSetu Offline</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.modeSwitch}>
          {modes.map((item) => {
            const isActive = mode === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                accessibilityRole="button"
                onPress={() => setMode(item.key)}
                style={[styles.modeButton, isActive && styles.modeButtonActive]}
                activeOpacity={0.9}>
                <Text style={[styles.modeLabel, isActive && styles.modeLabelActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.formGroup}>
          {mode === 'signup' && (
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Full name</Text>
              <TextInput
                placeholder="Ada Lovelace"
                placeholderTextColor={OnboardingPalette.muted}
                style={styles.input}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              placeholder="you@email.com"
              placeholderTextColor={OnboardingPalette.muted}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor={OnboardingPalette.muted}
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.8}
          onPress={() => router.push(CLASS_SELECTION_ROUTE as never)}>
          <Text style={styles.primaryButtonText}>{mode === 'login' ? 'Continue' : 'Create account'}</Text>
          <Ionicons name="arrow-forward" size={18} color={OnboardingPalette.background} />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerLabel}>or</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialButtons}>
          {socialProviders.map((provider) => (
            <TouchableOpacity key={provider.key} style={styles.socialButton} activeOpacity={0.8}>
              <Ionicons name={provider.icon as keyof typeof Ionicons.glyphMap} size={18} color={OnboardingPalette.textPrimary} />
              <Text style={styles.socialLabel}>{provider.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.helperText}>
          By continuing you agree to the <Text style={styles.link}>Terms</Text> &{' '}
          <Text style={styles.link}>Privacy Policy</Text>.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: OnboardingPalette.background,
  },
  container: {
    flex: 1,
    padding: 24,
    gap: 20,
    backgroundColor: OnboardingPalette.background,
  },
  stepText: {
    color: OnboardingPalette.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  progressTrack: {
    height: 4,
    backgroundColor: OnboardingPalette.surface,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: OnboardingPalette.accent,
  },
  eyebrow: {
    color: OnboardingPalette.accent,
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    color: OnboardingPalette.textPrimary,
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: OnboardingPalette.textSecondary,
    marginTop: 8,
    fontSize: 16,
    lineHeight: 22,
  },
  modeSwitch: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: OnboardingPalette.surface,
    padding: 6,
    borderRadius: 16,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: OnboardingPalette.card,
  },
  modeLabel: {
    color: OnboardingPalette.textSecondary,
    fontWeight: '600',
  },
  modeLabelActive: {
    color: OnboardingPalette.textPrimary,
  },
  formGroup: {
    gap: 16,
  },
  inputWrapper: {
    gap: 6,
  },
  inputLabel: {
    color: OnboardingPalette.textSecondary,
    fontSize: 13,
  },
  input: {
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: OnboardingPalette.surface,
    color: OnboardingPalette.textPrimary,
    borderWidth: 1,
    borderColor: OnboardingPalette.outline,
    fontSize: 16,
  },
  primaryButton: {
    marginTop: 4,
    backgroundColor: OnboardingPalette.accent,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 54,
  },
  primaryButtonText: {
    fontWeight: '700',
    color: OnboardingPalette.background,
    fontSize: 16,
  },
  forgotText: {
    color: OnboardingPalette.textSecondary,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: OnboardingPalette.outline,
  },
  dividerLabel: {
    color: OnboardingPalette.textSecondary,
    fontSize: 12,
  },
  socialButtons: {
    gap: 12,
  },
  socialButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: OnboardingPalette.surface,
    borderWidth: 1,
    borderColor: OnboardingPalette.outline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  socialLabel: {
    color: OnboardingPalette.textPrimary,
    fontWeight: '600',
    fontSize: 15,
  },
  helperText: {
    color: OnboardingPalette.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  link: {
    color: OnboardingPalette.accent,
    fontWeight: '600',
  },
});
