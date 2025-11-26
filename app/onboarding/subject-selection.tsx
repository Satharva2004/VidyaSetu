import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import { OnboardingPalette, subjectOptions } from '@/constants/onboarding';

export default function SubjectSelectionScreen() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['physics']);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((subjectId) => subjectId !== id) : [...prev, id],
    );
  };

  const summaryText = useMemo(() => {
    if (!selectedSubjects.length) return 'Pick at least one subject to begin.';
    const highlight = subjectOptions.find((item) => item.id === selectedSubjects[0]);
    return `${selectedSubjects.length} selected · ${highlight?.title ?? 'Personalised focus'}`;
  }, [selectedSubjects]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.stepText}>Step 2 of 3</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: '66%' }]} />
          </View>
        </View>

        <View>
          <Text style={styles.eyebrow}>Learning focus</Text>
          <Text style={styles.title}>What would you like to learn?</Text>
          <Text style={styles.subtitle}>Select subjects (you can add more later).</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Your plan</Text>
          <Text style={styles.summaryValue}>{summaryText}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryHint}>Smart reminders</Text>
            <Switch
              value={remindersEnabled}
              onValueChange={setRemindersEnabled}
              trackColor={{ false: OnboardingPalette.surface, true: OnboardingPalette.accentMuted }}
              thumbColor={remindersEnabled ? OnboardingPalette.background : OnboardingPalette.muted}
            />
          </View>
        </View>

        <View style={styles.list}>
          {subjectOptions.map((subject) => {
            const isActive = selectedSubjects.includes(subject.id);
            return (
              <TouchableOpacity
                key={subject.id}
                style={[styles.listItem, isActive && styles.listItemActive]}
                activeOpacity={0.9}
                onPress={() => toggleSubject(subject.id)}>
                <View style={styles.itemLeft}>
                  <View style={[styles.iconBadge, isActive && styles.iconBadgeActive]}>
                    <Ionicons
                      name={subject.icon as keyof typeof Ionicons.glyphMap}
                      size={20}
                      color={isActive ? OnboardingPalette.background : OnboardingPalette.textPrimary}
                    />
                  </View>
                  <View>
                    <Text style={[styles.subjectTitle, isActive && styles.subjectTitleActive]}>
                      {subject.title}
                    </Text>
                    <Text style={styles.subjectDescription}>{subject.description}</Text>
                  </View>
                </View>
                <View style={[styles.checkbox, isActive && styles.checkboxActive]}>
                  {isActive && (
                    <Ionicons name="checkmark" size={16} color={OnboardingPalette.background} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color={OnboardingPalette.textPrimary} />
          <Text style={styles.secondaryLabel}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, !selectedSubjects.length && styles.primaryButtonDisabled]}
          activeOpacity={0.85}
          disabled={!selectedSubjects.length}
          onPress={() => router.push('/onboarding/content-download')}>
          <Text style={styles.primaryLabel}>Continue</Text>
          <Ionicons name="arrow-forward" size={18} color={OnboardingPalette.background} />
        </TouchableOpacity>
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
    padding: 24,
    gap: 20,
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
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: OnboardingPalette.textSecondary,
    marginTop: 6,
  },
  summaryCard: {
    backgroundColor: OnboardingPalette.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: OnboardingPalette.outline,
    gap: 10,
  },
  summaryLabel: {
    color: OnboardingPalette.textSecondary,
    fontSize: 13,
  },
  summaryValue: {
    color: OnboardingPalette.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  summaryHint: {
    color: OnboardingPalette.textSecondary,
  },
  list: {
    gap: 12,
  },
  listItem: {
    backgroundColor: OnboardingPalette.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: OnboardingPalette.outline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  listItemActive: {
    backgroundColor: OnboardingPalette.card,
    borderColor: OnboardingPalette.accent,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBadge: {
    height: 46,
    width: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  iconBadgeActive: {
    backgroundColor: OnboardingPalette.accent,
  },
  subjectTitle: {
    color: OnboardingPalette.textPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
  subjectTitleActive: {
    color: OnboardingPalette.accent,
  },
  subjectDescription: {
    color: OnboardingPalette.textSecondary,
    fontSize: 13,
  },
  checkbox: {
    height: 28,
    width: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: OnboardingPalette.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: OnboardingPalette.accent,
    borderColor: OnboardingPalette.accent,
  },
  footer: {
    padding: 24,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: OnboardingPalette.background,
  },
  secondaryButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: OnboardingPalette.outline,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    backgroundColor: OnboardingPalette.surface,
  },
  secondaryLabel: {
    color: OnboardingPalette.textPrimary,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: OnboardingPalette.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryLabel: {
    color: OnboardingPalette.background,
    fontWeight: '700',
    fontSize: 16,
  },
});
