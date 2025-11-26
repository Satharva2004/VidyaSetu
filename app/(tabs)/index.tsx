import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingPalette } from '@/constants/onboarding';

const quickActions = [
  {
    id: 'ask',
    title: 'Ask Questions',
    description: 'Speak your doubts',
    icon: 'mic-outline',
  },
  {
    id: 'solve',
    title: 'Solve Math',
    description: 'Draw & solve problems',
    icon: 'pencil-outline',
  },
];

const recentActivity = [
  { id: 'tri', title: 'Trigonometry Basics', meta: 'Today' },
  { id: 'newton', title: `Newton's Laws`, meta: 'Yesterday' },
];

const stats = [
  { id: 'questions', value: '12', label: 'Questions asked today' },
  { id: 'problems', value: '5', label: 'Problems solved' },
  { id: 'streak', value: '21', label: 'Study streak' },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.appBar}>
          <Ionicons name="leaf-outline" size={20} color={OnboardingPalette.accent} />
          <Text style={styles.appBarTitle}>Offline AI</Text>
          <View style={styles.appBarActions}>
            <Ionicons name="notifications-outline" size={20} color={OnboardingPalette.textPrimary} />
            <Ionicons name="settings-outline" size={20} color={OnboardingPalette.textPrimary} />
          </View>
        </View>

        <View style={styles.heroCard}>
          <View>
            <Text style={styles.heroGreeting}>Hello, Student!</Text>
            <Text style={styles.heroSubtext}>Monday, 23 Oct</Text>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusLabel}>All systems ready</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
        </View>
        <View style={styles.quickGrid}>
          {quickActions.map((action) => (
            <View key={action.id} style={styles.quickCard}>
              <View style={styles.quickIconWrapper}>
                <Ionicons name={action.icon as keyof typeof Ionicons.glyphMap} size={20} color={OnboardingPalette.background} />
              </View>
              <Text style={styles.quickTitle}>{action.title}</Text>
              <Text style={styles.quickDescription}>{action.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>
        <View style={styles.activityGrid}>
          {recentActivity.map((item) => (
            <View key={item.id} style={styles.activityCard}>
              <Text style={styles.activityTitle}>{item.title}</Text>
              <Text style={styles.activityMeta}>{item.meta}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.statRow}>
        {stats.map((stat) => (
          <View key={stat.id} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
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
    paddingBottom: 140,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  appBarTitle: {
    flex: 1,
    textAlign: 'center',
    color: OnboardingPalette.textPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
  appBarActions: {
    flexDirection: 'row',
    gap: 14,
  },
  heroCard: {
    backgroundColor: OnboardingPalette.card,
    borderRadius: 24,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: OnboardingPalette.outline,
  },
  heroGreeting: {
    color: OnboardingPalette.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },
  heroSubtext: {
    color: OnboardingPalette.textSecondary,
  },
  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: OnboardingPalette.elevated,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: OnboardingPalette.accent,
  },
  statusLabel: {
    color: OnboardingPalette.textSecondary,
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: OnboardingPalette.textPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: 14,
  },
  quickCard: {
    flex: 1,
    backgroundColor: OnboardingPalette.surface,
    borderRadius: 20,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: OnboardingPalette.outline,
  },
  quickIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: OnboardingPalette.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTitle: {
    color: OnboardingPalette.textPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
  quickDescription: {
    color: OnboardingPalette.textSecondary,
    fontSize: 13,
  },
  activityGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  activityCard: {
    flex: 1,
    backgroundColor: OnboardingPalette.surface,
    borderRadius: 20,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: OnboardingPalette.outline,
  },
  activityTitle: {
    color: OnboardingPalette.textPrimary,
    fontWeight: '600',
    fontSize: 15,
  },
  activityMeta: {
    color: OnboardingPalette.textSecondary,
    fontSize: 13,
  },
  statRow: {
    flexDirection: 'row',
    backgroundColor: OnboardingPalette.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'space-between',
    gap: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: OnboardingPalette.accent,
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    color: OnboardingPalette.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
});
