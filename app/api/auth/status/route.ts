import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isActiveSubscription } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const APP_ID = 'hada';
const PAYJP_API = "https://api.pay.jp/v1";

function payjpAuth() {
  return "Basic " + Buffer.from(process.env.PAYJP_SECRET_KEY! + ":").toString("base64");
}

async function checkSubscriptionActive(subId: string): Promise<boolean> {
  try {
    const res = await fetch(`${PAYJP_API}/subscriptions/${subId}`, {
      headers: { Authorization: payjpAuth() },
    });
    const data = await res.json();
    return data.status === "active" || data.status === "trial";
  } catch {
    return true; // エラー時は維持
  }
}

export async function GET() {
  const cookieStore = await cookies();

  // PAY.JP subscription IDがある場合はリアルタイムで有効性を確認
  const subId = cookieStore.get("payjp_sub_id")?.value;
  if (subId) {
    const isActive = await checkSubscriptionActive(subId);
    if (!isActive) {
      const res = NextResponse.json({ premium: false });
      res.cookies.set("premium", "", { maxAge: 0, path: "/" });
      res.cookies.set("payjp_sub_id", "", { maxAge: 0, path: "/" });
      return res;
    }
  }

  const email = cookieStore.get('user_email')?.value;
  let premium = false;

  if (email) {
    premium = await isActiveSubscription(email, APP_ID);
  }
  if (!premium) {
    premium = cookieStore.get('stripe_premium')?.value === '1' || cookieStore.get('premium')?.value === '1';
  }

  return NextResponse.json({ premium });
}
