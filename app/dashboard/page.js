'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

const STATUS_LABELS = {
  pending: 'En attente de vérification',
  verified: 'Payé — téléchargement disponible',
  rejected: 'Paiement non confirmé',
};

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      const { data } = await supabase
        .from('orders')
        .select('id, status, created_at, products(title, price)')
        .order('created_at', { ascending: false });
      setOrders(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p style={{ padding: 32 }}>Chargement...</p>;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 32 }}>
      <h1>Mes achats</h1>
      {orders.length === 0 && <p>Aucune commande pour l'instant.</p>}
      {orders.map((order) => (
        <div key={order.id} className="product-card" style={{ marginBottom: 12 }}>
          <h3>{order.products?.title}</h3>
          <p className={`status-${order.status}`}>{STATUS_LABELS[order.status]}</p>
          {order.status === 'verified' && (
            <a className="btn" href={`/api/download/${order.id}`}>Télécharger le PDF</a>
          )}
        </div>
      ))}
    </div>
  );
}
