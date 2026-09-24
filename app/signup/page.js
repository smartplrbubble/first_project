'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [d17Phone, setD17Phone] = useState('');
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      return;
    }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        d17_phone: d17Phone,
      });
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="form-page">
        <h1>Vérifie ta boîte mail</h1>
        <p>Un lien de confirmation vient de t'être envoyé.</p>
      </div>
    );
  }

  return (
    <form className="form-page" onSubmit={handleSubmit}>
      <h1>Créer un compte</h1>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <input type="tel" placeholder="Numéro D17" value={d17Phone} onChange={(e) => setD17Phone(e.target.value)} required />
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <button type="submit">S'inscrire</button>
    </form>
  );
}
