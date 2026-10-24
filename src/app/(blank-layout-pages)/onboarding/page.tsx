import type { Metadata } from 'next'
import Onboarding from '@/views/Onboarding'

export const metadata: Metadata = {
  title: 'Onboarding | Growvia',
  description: 'Mulai perjalanan kariermu bersama Growvia dengan memetakan profil dan minat karier.'
}

export default function OnboardingPage() {
  return <Onboarding />
}
