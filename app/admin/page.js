'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    const res = await fetch('/api/admin/orders');
    if (res.ok) setOrders(await res.json());
  }

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setAuthorized(true);
        await loadOrders();
      }
      setLoading(false);
    }
    check();
  }, []);

  async function updateStatus(orderId, status) {
    await fetch('/api/admin/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    });
    loadOrders();
  }

  if (loading) return <p style={{ padding: 32 }}>Chargement...</p>;
  if (!authorized) return <p style={{ padding: 32 }}>Accès réservé à l'administrateur.</p>;

  const pending = orders.filter((o) => o.status === 'pending');

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <h1>Commandes en attente ({pending.length})</h1>
      {pending.map((order) => (
        <div key={order.id} className="product-card" style={{ marginBottom: 12 }}>
          <p><strong>{order.products?.title}</strong> — {order.products?.price} DT</p>
          <p>Client : {order.profiles?.d17_phone} (commande #{order.id.slice(0, 8)})</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={() => updateStatus(order.id, 'verified')}>✅ Paiement reçu</button>
            <button onClick={() => updateStatus(order.id, 'rejected')} style={{ background: '#c62828' }}>
              ❌ Rejeter
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
