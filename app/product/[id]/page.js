import { createClient } from '@/lib/supabaseClient';
import BuyButton from './BuyButton';

export default async function ProductPage({ params }) {
  const supabase = createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!product) return <p style={{ padding: 32 }}>Produit introuvable.</p>;

  return (
    <div style={{ maxWidth: 560, margin: '40px auto', padding: 24 }}>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p><strong>{product.price} DT</strong></p>
      {product.preview_file_url && (
        <a href={product.preview_file_url} target="_blank" rel="noreferrer">
          Télécharger l'aperçu gratuit
        </a>
      )}
      <div style={{ marginTop: 24 }}>
        <BuyButton productId={product.id} />
      </div>
    </div>
  );
}
