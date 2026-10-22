import './globals.css';
import ClickSound from '../components/ClickSound';

export const metadata = { title: 'Sydney | Portfolio', description: 'Web and mobile developer portfolio' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Rubik:wght@300;400;500;600&family=Pixelify+Sans&display=swap" rel="stylesheet" />
      </head>
      <body><ClickSound />{children}</body>
    </html>
  );
}
