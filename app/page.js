import { createClient } from '@/lib/supabaseClient';
import ProductCard from '@/components/ProductCard';

export default async function HomePage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from('products')
    .select('id, title, description, category, price, preview_file_url')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return (
    <>
      <section style={{ textAlign: 'center', padding: '48px 24px' }}>
        <h1>Des puzzles à imprimer, prêts en quelques minutes</h1>
        <p>Sudoku, labyrinthes, mots cachés, cryptogrammes et mots mêlés — en packs thématiques.</p>
      </section>
      <div className="product-grid">
        {(products ?? []).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
