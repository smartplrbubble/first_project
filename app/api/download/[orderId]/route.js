import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createAdminClient } from '@/lib/supabaseAdmin';

export async function GET(request, { params }) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Non connecté' }, { status: 401 });

  const admin = createAdminClient();
  const { data: order } = await admin
    .from('orders')
    .select('id, status, user_id, products(full_file_url)')
    .eq('id', params.orderId)
    .single();

  if (!order || order.user_id !== user.id || order.status !== 'verified') {
    return Response.json({ error: 'Accès refusé' }, { status: 403 });
  }

  // full_file_url stocke le CHEMIN du fichier dans le bucket privé "products"
  // (ex: "pack-sudoku-1.pdf"), pas une URL complète — on génère une URL
  // signée valable 60 secondes à chaque téléchargement, pour éviter qu'un
  // lien copié/partagé reste valable indéfiniment.
  const { data: signed, error } = await admin.storage
    .from('products')
    .createSignedUrl(order.products.full_file_url, 60);

  if (error || !signed) {
    return Response.json({ error: 'Fichier introuvable' }, { status: 404 });
  }

  return Response.redirect(signed.signedUrl);
}
