import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createAdminClient } from '@/lib/supabaseAdmin';

async function requireAdmin() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Accès refusé' }, { status: 403 });
  }
  const admin = createAdminClient();
  const { data } = await admin
    .from('orders')
    .select('id, status, created_at, products(title, price), profiles(d17_phone)')
    .order('created_at', { ascending: true });
  return Response.json(data ?? []);
}

export async function POST(request) {
  if (!(await requireAdmin())) {
    return Response.json({ error: 'Accès refusé' }, { status: 403 });
  }
  const { orderId, status } = await request.json();
  const admin = createAdminClient();
  const { error } = await admin
    .from('orders')
    .update({ status, verified_at: status === 'verified' ? new Date().toISOString() : null })
    .eq('id', orderId);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
