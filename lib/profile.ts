import { supabase } from './supabase';

export type UpsertUserProfileParams = {
  userId: string;
  fullName: string;
  email: string;
};

export async function upsertUserProfile({ userId, fullName, email }: UpsertUserProfileParams) {
  console.log('[supabase] upsertUserProfile:start', { userId, fullName, email });
  const { error } = await supabase
    .from('user_profiles')
    .upsert({ id: userId, full_name: fullName, email })
    .select('id')
    .single();

  if (error) throw error;
  console.log('[supabase] upsertUserProfile:success', { userId });
}

export type UpsertOnboardingProgressParams = {
  userId: string;
  classId?: string;
  subjects?: string[];
  currentStep?: number;
};

export async function upsertOnboardingProgress({
  userId,
  classId,
  subjects,
  currentStep,
}: UpsertOnboardingProgressParams) {
  console.log('[supabase] upsertOnboardingProgress:start', {
    userId,
    classId,
    subjects,
    currentStep,
  });
  const payload: {
    user_id: string;
    class_id?: string;
    subjects?: string[];
    current_step?: number;
  } = {
    user_id: userId,
  };

  if (typeof classId !== 'undefined') {
    payload.class_id = classId;
  }

  if (typeof subjects !== 'undefined') {
    payload.subjects = subjects;
  }

  if (typeof currentStep !== 'undefined') {
    payload.current_step = currentStep;
  }

  const { error } = await supabase.from('onboarding_progress').upsert(payload, {
    onConflict: 'user_id',
  });

  if (error) throw error;
  console.log('[supabase] upsertOnboardingProgress:success', { userId });
}

export async function getCurrentUserId(): Promise<string> {
  console.log('[supabase] getCurrentUserId:start');
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user?.id) {
    throw new Error('Please log in again to continue.');
  }

  console.log('[supabase] getCurrentUserId:success', { userId: user.id });
  return user.id;
}
