import './globals.css';

export const metadata = {
  title: 'Enigma Souk',
  description: 'Packs de puzzles à imprimer : sudoku, labyrinthes, mots cachés, cryptogrammes, mots mêlés.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <header className="site-header">
          <a href="/" className="logo">Enigma Souk</a>
          <nav>
            <a href="/">Catalogue</a>
            <a href="/dashboard">Mes achats</a>
            <a href="/login">Connexion</a>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
