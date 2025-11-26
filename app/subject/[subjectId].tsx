import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';
import { router, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
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

const offlineSeedConversation: Message[] = [
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

const onlineSeedConversation: Message[] = [
  {
    id: 'online_intro',
    role: 'assistant',
    text: 'Switch to Online Mode to connect with Vidya AI cloud for deeper, up-to-date explanations.',
  },
  {
    id: 'online_tip',
    role: 'assistant',
    text: 'Ask multi-step or exam questions here and I will reason through them with internet assistance.',
  },
];

export default function SubjectAssistantScreen() {
  const { subjectId } = useLocalSearchParams<{ subjectId?: string }>();
  const [prompt, setPrompt] = useState('');
  const [offlineMode, setOfflineMode] = useState(true);
  const [offlineHistory, setOfflineHistory] = useState<Message[]>(offlineSeedConversation);
  const [onlineHistory, setOnlineHistory] = useState<Message[]>(onlineSeedConversation);
  const [isResponding, setIsResponding] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const micScale = useRef(new Animated.Value(1)).current;
  const wavePulse = useRef(new Animated.Value(0)).current;
  const waveLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const subjectDefinition = subjectId ? getSubjectDefinition(subjectId) : null;

  const pageTitle = useMemo(() => {
    if (!subjectDefinition) return 'Subject AI';
    return `${subjectDefinition.title} AI`;
  }, [subjectDefinition]);

  const activeMessages = offlineMode ? offlineHistory : onlineHistory;
  const modeHintText = offlineMode
    ? 'Offline packs give you instant answers without data. Switch modes for cloud help when you are connected.'
    : 'Online mode streams richer explanations with the latest knowledge.';
  const inputPlaceholder = offlineMode
    ? 'Ask using the offline pack...'
    : 'Ask anything (requires internet)...';
  const isSendDisabled = !prompt.trim() || isResponding;

  const handleModeChange = useCallback((mode: 'offline' | 'online') => {
    setOfflineMode(mode === 'offline');
    setPrompt('');
    setIsResponding(false);
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = prompt.trim();
    if (!trimmed || isResponding) return;

    const newUserMessage: Message = {
      id: `${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    if (offlineMode) {
      const subjectLabel = subjectDefinition?.title ?? 'this subject';
      const offlineReply: Message = {
        id: `${Date.now()}-offline-reply`,
        role: 'assistant',
        text: `Here is an offline summary for "${trimmed}": Based on ${subjectLabel}, remember the key concept and how it applies. I'll sync a deeper answer when you're online.`,
      };
      setOfflineHistory((prev) => [...prev, newUserMessage, offlineReply]);
    } else {
      setIsResponding(true);
      setOnlineHistory((prev) => [...prev, newUserMessage]);
      const onlineReply: Message = {
        id: `${Date.now()}-online-reply`,
        role: 'assistant',
        text: 'Connecting to Vidya AI cloud for a detailed explanation... (simulation)',
      };
      setTimeout(() => {
        setOnlineHistory((prev) => [...prev, onlineReply]);
        setIsResponding(false);
      }, 900);
    }

    setPrompt('');
  }, [prompt, isResponding, offlineMode, subjectDefinition]);

  const animateMic = useCallback(() => {
    Animated.sequence([
      Animated.timing(micScale, {
        toValue: 1.15,
        duration: 120,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(micScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, [micScale]);

  const speakText = useCallback(
    async (utterance: string, options?: Speech.SpeechOptions) => {
      setVoiceError(null);
      try {
        await Speech.stop();
        Speech.speak(utterance, {
          ...options,
          rate: options?.rate ?? 1,
          pitch: options?.pitch ?? 1,
          onStart: () => {
            console.log('[speech] onStart');
            options?.onStart?.();
          },
          onDone: () => {
            console.log('[speech] onDone');
            options?.onDone?.();
          },
          onStopped: () => {
            console.log('[speech] onStopped');
            options?.onStopped?.();
          },
          onError: (event) => {
            console.error('[speech] onError', event);
            setVoiceError(typeof event === 'string' ? event : event?.message ?? 'Unable to play audio.');
            options?.onError?.(event as never);
          },
        });
      } catch (error) {
        console.error('[speech] exception', error);
        setVoiceError(error instanceof Error ? error.message : 'Unable to trigger text-to-speech.');
      }
    },
    [],
  );

  const startWaveAnimation = useCallback(() => {
    waveLoopRef.current?.stop();
    waveLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(wavePulse, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wavePulse, {
          toValue: 0,
          duration: 500,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    waveLoopRef.current.start();
  }, [wavePulse]);

  const stopWaveAnimation = useCallback(() => {
    waveLoopRef.current?.stop();
    wavePulse.setValue(0);
  }, [wavePulse]);

  const startRecording = useCallback(async () => {
    try {
      setVoiceError(null);
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        setVoiceError('Microphone permission is required.');
        return;
      }

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
      startWaveAnimation();
      animateMic();
    } catch (error) {
      console.error('[recording] start:error', error);
      setVoiceError(error instanceof Error ? error.message : 'Unable to start recording.');
    }
  }, [animateMic, startWaveAnimation]);

  const stopRecordingAndTranscribe = useCallback(async () => {
    const recording = recordingRef.current;
    if (!recording) return;

    try {
      setIsRecording(false);
      setIsTranscribing(true);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      recordingRef.current = null;
      if (!uri) {
        throw new Error('No recording data found.');
      }

      const response = await fetch(uri);
      const audioBlob = await response.blob();

      const deepgramKey = "b0c3e3948041ea483954cac7a74e755fcdaf98c8";
      if (!deepgramKey) {
        throw new Error('Missing Deepgram key. Set EXPO_PUBLIC_DEEPGRAM_KEY in your .env.');
      }

      const deepgramResponse = await fetch('https://api.deepgram.com/v1/listen', {
        method: 'POST',
        headers: {
          Authorization: `Token ${deepgramKey}`,
          'Content-Type': 'audio/wav',
        },
        body: audioBlob,
      });

      if (!deepgramResponse.ok) {
        const errorText = await deepgramResponse.text();
        throw new Error(`Deepgram error ${deepgramResponse.status}: ${errorText}`);
      }

      const deepgramJson = await deepgramResponse.json();
      const transcript =
        deepgramJson?.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim() ?? '';

      if (transcript) {
        setPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
      } else {
        setVoiceError('No speech detected. Try again.');
      }
    } catch (error) {
      console.error('[recording] stop:error', error);
      setVoiceError(error instanceof Error ? error.message : 'Unable to transcribe audio.');
    } finally {
      stopWaveAnimation();
      setIsTranscribing(false);
      recordingRef.current = null;
    }
  }, [stopWaveAnimation]);

  const handleMicPress = useCallback(() => {
    if (isRecording) {
      stopRecordingAndTranscribe();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecordingAndTranscribe]);

  const handleListen = useCallback(
    (messageText: string) => {
      speakText(messageText, { rate: 1, pitch: 1 });
    },
    [speakText],
  );

  const micStatusMessage = isRecording
    ? 'Listening… tap the mic to finish.'
    : isTranscribing
      ? 'Transcribing your question…'
      : null;

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
        {activeMessages.map((message) => {
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
                <TouchableOpacity activeOpacity={0.8} style={styles.listenButton} onPress={() => handleListen(message.text)}>
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
          onPress={() => handleModeChange('offline')}>
          <Text style={[styles.modeLabel, offlineMode && styles.modeLabelActive]}>Offline Mode</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modePill, !offlineMode && styles.modePillActive]}
          activeOpacity={0.85}
          onPress={() => handleModeChange('online')}>
          <Text style={[styles.modeLabel, !offlineMode && styles.modeLabelActive]}>Online Mode</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.modeHint}>{modeHintText}</Text>

      <View style={styles.inputRow}>
        {micStatusMessage ? (
          <View style={styles.statusBanner}>
            <Ionicons name={isRecording ? 'mic' : 'sync'} size={16} color={OnboardingPalette.textPrimary} />
            <Text style={styles.statusLabel}>{micStatusMessage}</Text>
          </View>
        ) : (
          <TextInput
            value={prompt}
            onChangeText={setPrompt}
            placeholder={inputPlaceholder}
            placeholderTextColor={OnboardingPalette.textSecondary}
            style={styles.promptInput}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
        )}
        <TouchableOpacity
          style={[styles.sendButton, (isSendDisabled || !!micStatusMessage) && styles.sendButtonDisabled]}
          activeOpacity={0.85}
          onPress={handleSend}
          disabled={isSendDisabled || !!micStatusMessage}>
          <Ionicons name="arrow-up" size={18} color={OnboardingPalette.background} />
        </TouchableOpacity>
        <Animated.View style={[styles.micWrapper, { transform: [{ scale: micScale }] }]}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.micWave,
              {
                opacity: isRecording
                  ? wavePulse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0] })
                  : 0,
                transform: [
                  {
                    scale: wavePulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] }),
                  },
                ],
              },
            ]}
          />
          <TouchableOpacity style={[styles.micButton, isRecording && styles.micButtonActive]} activeOpacity={0.85} onPress={handleMicPress}>
            <Ionicons name={isRecording ? 'stop' : 'mic'} size={20} color={OnboardingPalette.background} />
          </TouchableOpacity>
        </Animated.View>
      </View>
      {isResponding && !offlineMode ? <Text style={styles.typingIndicator}>Vidya AI is formulating an online answer…</Text> : null}
      {voiceError ? <Text style={styles.speechError}>{voiceError}</Text> : null}
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
  micWrapper: {
    borderRadius: 28,
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micWave: {
    position: 'absolute',
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: OnboardingPalette.accent,
  },
  micButton: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: OnboardingPalette.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonActive: {
    backgroundColor: OnboardingPalette.textPrimary,
  },
  sendButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: OnboardingPalette.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  typingIndicator: {
    marginTop: 10,
    color: OnboardingPalette.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  voiceStatus: {
    marginTop: 6,
    color: OnboardingPalette.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  statusBanner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: OnboardingPalette.surface,
    borderWidth: 1,
    borderColor: OnboardingPalette.outline,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  statusLabel: {
    color: OnboardingPalette.textPrimary,
    fontSize: 14,
    flexShrink: 1,
  },
  speechError: {
    marginTop: 4,
    color: '#ff6b6b',
    fontSize: 12,
    textAlign: 'center',
  },
});
