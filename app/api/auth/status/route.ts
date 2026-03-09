import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isActiveSubscription } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const APP_ID = 'hada';

export async function GET() {
  const cookieStore = await cookies();
  const email = cookieStore.get('user_email')?.value;
  let premium = false;

  if (email) {
    premium = await isActiveSubscription(email, APP_ID);
  }
  if (!premium) {
    premium = cookieStore.get('stripe_premium')?.value === '1';
  }

  return NextResponse.json({ premium });
}
