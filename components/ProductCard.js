export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <div className="price-row">
        <strong>{product.price} DT</strong>
        {product.preview_file_url && (
          <a href={product.preview_file_url} target="_blank" rel="noreferrer">
            Aperçu gratuit
          </a>
        )}
      </div>
      <a className="btn" href={`/product/${product.id}`} style={{ display: 'block', textAlign: 'center', marginTop: 10 }}>
        Voir le pack
      </a>
    </div>
  );
}
