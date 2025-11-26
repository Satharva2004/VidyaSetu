import { Redirect } from 'expo-router';

const ONBOARDING_ENTRY = '/onboarding/login' as const;

export default function Index() {
  return <Redirect href={ONBOARDING_ENTRY as never} />;
}
