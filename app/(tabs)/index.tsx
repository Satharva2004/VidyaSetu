import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingPalette } from '@/constants/onboarding';
import { supabase } from '@/lib/supabase';

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

const statConfig = [
  { id: 'questions', label: 'Questions asked today', key: 'questions_today' },
  { id: 'problems', label: 'Problems solved', key: 'problems_solved' },
  { id: 'streak', label: 'Study streak', key: 'streak_days' },
] as const;

type HomeActivity = {
  id: string;
  title: string;
  meta?: string | null;
  created_at: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const [profileName, setProfileName] = useState('Student');
  const [statCards, setStatCards] = useState(() => statConfig.map((item) => ({ ...item, value: '0' })));
  const [activities, setActivities] = useState<HomeActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const greetSubtitle = useMemo(() => {
    return new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
  }, []);

  const formatActivityMeta = useCallback((activity: HomeActivity) => {
    if (activity.meta) return activity.meta;
    return new Date(activity.created_at).toLocaleString('en-IN', { month: 'short', day: 'numeric' });
  }, []);

  const fetchHomeData = useCallback(async () => {
    try {
      setErrorMessage(null);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        router.replace('/onboarding/login');
        return;
      }

      const [profileRes, statsRes, activityRes] = await Promise.all([
        supabase.from('user_profiles').select('full_name').eq('id', user.id).maybeSingle(),
        supabase
          .from('home_stats')
          .select('questions_today, problems_solved, streak_days')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('home_activity')
          .select('id,title,meta,created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      if (profileRes.data?.full_name) {
        setProfileName(profileRes.data.full_name);
      } else if (user.user_metadata?.full_name) {
        setProfileName(user.user_metadata.full_name);
      } else if (user.email) {
        setProfileName(user.email.split('@')[0] ?? 'Learner');
      }

      const mappedStats = statConfig.map((item) => ({
        ...item,
        value: statsRes.data?.[item.key as keyof typeof statsRes.data]?.toString() ?? '0',
      }));
      setStatCards(mappedStats);

      setActivities(activityRes.data ?? []);
    } catch (error) {
      console.error('[home] fetchHomeData', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load home data.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHomeData();
    setRefreshing(false);
  }, [fetchHomeData]);

  const handleLogout = useCallback(() => {
    Alert.alert('Log out?', 'You can sign back in anytime.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace('/onboarding/login');
        },
      },
    ]);
  }, [router]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.loadingState]}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={OnboardingPalette.accent} />}>
        <View style={styles.appBar}>
          <Ionicons name="leaf-outline" size={20} color={OnboardingPalette.accent} />
          <Text style={styles.appBarTitle}>Offline AI</Text>
          <View style={styles.appBarActions}>
            <TouchableOpacity activeOpacity={0.8}>
              <Ionicons name="notifications-outline" size={20} color={OnboardingPalette.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={handleLogout}>
              <Ionicons name="settings-outline" size={20} color={OnboardingPalette.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View>
            <Text style={styles.heroGreeting}>Hello, {profileName}!</Text>
            <Text style={styles.heroSubtext}>{greetSubtitle}</Text>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusLabel}>All systems ready</Text>
          </View>
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
        </View>
        <View style={styles.quickGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.id} style={styles.quickCard} activeOpacity={0.9}>
              <View style={styles.quickIconWrapper}>
                <Ionicons name={action.icon as keyof typeof Ionicons.glyphMap} size={20} color={OnboardingPalette.background} />
              </View>
              <Text style={styles.quickTitle}>{action.title}</Text>
              <Text style={styles.quickDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>
        <View style={styles.activityGrid}>
          {activities.length === 0 && <Text style={styles.activityMeta}>No activity yet. Start learning!</Text>}
          {activities.map((item) => (
            <View key={item.id} style={styles.activityCard}>
              <Text style={styles.activityTitle}>{item.title}</Text>
              <Text style={styles.activityMeta}>{formatActivityMeta(item)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.statRow}>
        {statCards.map((stat) => (
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
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
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
    flexWrap: 'wrap',
  },
  activityCard: {
    flexBasis: '48%',
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
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
  },
});
