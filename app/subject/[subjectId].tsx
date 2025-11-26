import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingPalette, getSubjectDefinition } from '@/constants/onboarding';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

const sampleConversation: Message[] = [
  {
    id: '1',
    role: 'user',
    text: "Explain Newton's first law of motion.",
  },
  {
    id: '2',
    role: 'assistant',
    text: "Newton's First Law of Motion, also known as the law of inertia, states that an object will remain at rest or in uniform motion in a straight line unless acted upon by an external force.",
  },
  {
    id: '3',
    role: 'user',
    text: 'What about the second law?',
  },
  {
    id: '4',
    role: 'assistant',
    text: 'The second law states that the acceleration of an object is directly proportional to the net force acting upon it and inversely proportional to its mass (F = ma).',
  },
];

export default function SubjectAssistantScreen() {
  const { subjectId } = useLocalSearchParams<{ subjectId?: string }>();
  const [prompt, setPrompt] = useState('');
  const [offlineMode, setOfflineMode] = useState(true);

  const subjectDefinition = subjectId ? getSubjectDefinition(subjectId) : null;

  const pageTitle = useMemo(() => {
    if (!subjectDefinition) return 'Subject AI';
    return `${subjectDefinition.title} AI`;
  }, [subjectDefinition]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={22} color={OnboardingPalette.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>{pageTitle}</Text>
          {subjectDefinition?.description ? (
            <Text style={styles.headerSubtitle}>{subjectDefinition.description}</Text>
          ) : null}
        </View>
        <TouchableOpacity activeOpacity={0.8} style={styles.headerButton}>
          <Ionicons name="ellipsis-vertical" size={18} color={OnboardingPalette.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
        {sampleConversation.map((message) => {
          const isUser = message.role === 'user';
          return (
            <View key={message.id} style={styles.messageWrapper}>
              <View style={[styles.messageRow, isUser ? styles.rowEnd : styles.rowStart]}>
                {!isUser && (
                  <View style={styles.avatarBadge}>
                    <Ionicons name="sparkles" size={16} color={OnboardingPalette.accent} />
                  </View>
                )}
                <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
                  <Text style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}>{message.text}</Text>
                </View>
                {isUser && (
                  <View style={[styles.avatarBadge, styles.userAvatar]}>
                    <Ionicons name="person" size={14} color={OnboardingPalette.background} />
                  </View>
                )}
              </View>
              {!isUser && (
                <TouchableOpacity activeOpacity={0.8} style={styles.listenButton}>
                  <Ionicons name="volume-high" size={16} color={OnboardingPalette.textPrimary} />
                  <Text style={styles.listenLabel}>Listen</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.modeSwitcher}>
        <TouchableOpacity
          style={[styles.modePill, offlineMode && styles.modePillActive]}
          activeOpacity={0.85}
          onPress={() => setOfflineMode(true)}>
          <Text style={[styles.modeLabel, offlineMode && styles.modeLabelActive]}>Offline Mode</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modePill, !offlineMode && styles.modePillActive]}
          activeOpacity={0.85}
          onPress={() => setOfflineMode(false)}>
          <Text style={[styles.modeLabel, !offlineMode && styles.modeLabelActive]}>Online Mode</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.modeHint}>
        {offlineMode
          ? 'For quicker answers without internet, stay offline.'
          : 'For more precise answers, switch to online mode.'}
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Type your question..."
          placeholderTextColor={OnboardingPalette.textSecondary}
          style={styles.promptInput}
        />
        <TouchableOpacity style={styles.micButton} activeOpacity={0.85}>
          <Ionicons name="mic" size={20} color={OnboardingPalette.background} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} activeOpacity={0.85}>
          <Ionicons name="arrow-up" size={18} color={OnboardingPalette.background} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: OnboardingPalette.background,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  messageWrapper: {
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  headerButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: OnboardingPalette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    color: OnboardingPalette.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: OnboardingPalette.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  chatArea: {
    flex: 1,
    marginBottom: 16,
  },
  chatContent: {
    gap: 12,
    paddingBottom: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  rowStart: {
    justifyContent: 'flex-start',
  },
  rowEnd: {
    justifyContent: 'flex-end',
  },
  avatarBadge: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: OnboardingPalette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    backgroundColor: OnboardingPalette.accent,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  assistantBubble: {
    backgroundColor: OnboardingPalette.surface,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: OnboardingPalette.accent,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  assistantText: {
    color: OnboardingPalette.textPrimary,
  },
  userText: {
    color: '#1B1D10',
    fontWeight: '600',
  },
  listenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: OnboardingPalette.surface,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  listenLabel: {
    color: OnboardingPalette.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: OnboardingPalette.surface,
    borderRadius: 26,
    padding: 4,
    gap: 4,
  },
  modePill: {
    flex: 1,
    borderRadius: 22,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modePillActive: {
    backgroundColor: OnboardingPalette.accent,
  },
  modeLabel: {
    color: OnboardingPalette.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  modeLabelActive: {
    color: '#1B1D10',
  },
  modeHint: {
    color: OnboardingPalette.textSecondary,
    fontSize: 12,
    marginTop: 6,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: OnboardingPalette.surface,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  promptInput: {
    flex: 1,
    color: OnboardingPalette.textPrimary,
    height: 40,
  },
  micButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: OnboardingPalette.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: OnboardingPalette.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
