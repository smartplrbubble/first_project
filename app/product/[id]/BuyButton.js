'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

export default function BuyButton({ productId }) {
  const [status, setStatus] = useState('idle');

  async function handleBuy() {
    setStatus('loading');
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });

    setStatus(res.ok ? 'done' : 'error');
  }

  if (status === 'done') {
    return (
      <div>
        <p>Commande créée ! Envoie le paiement via D17, la vérification se fait
        généralement rapidement. Tu retrouveras le statut dans "Mes achats".</p>
      </div>
    );
  }

  return (
    <button onClick={handleBuy} disabled={status === 'loading'}>
      {status === 'loading' ? 'Création de la commande...' : 'Commander (paiement D17)'}
    </button>
  );
}
