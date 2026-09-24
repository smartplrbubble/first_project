import { createAdminClient } from '@/lib/supabaseAdmin';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function POST(request) {
  const { productId } = await request.json();

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'Non connecté' }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: profile } = await admin
    .from('profiles')
    .select('d17_phone')
    .eq('id', user.id)
    .single();

  const { data: product } = await admin
    .from('products')
    .select('title, price')
    .eq('id', productId)
    .single();

  const { data: order, error } = await admin
    .from('orders')
    .insert({
      user_id: user.id,
      product_id: productId,
      d17_phone_used: profile?.d17_phone ?? 'inconnu',
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const message =
    `🧩 Nouvelle commande\n` +
    `Produit : ${product?.title}\n` +
    `Prix : ${product?.price} DT\n` +
    `Tél. D17 utilisé : ${profile?.d17_phone}\n` +
    `Commande #${order.id}`;

  fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: message }),
  }).catch((err) => console.error('Erreur notification Telegram:', err));

  return Response.json({ order });
}
