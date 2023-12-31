// Appフォルダ直下の layoutコンポーネントは、ルートレイアウトとみなされ、12以前の_app.tsxと同じような役割を果たす
// アプリケーション全体に適用したい初期設定などをここに書く

import NavBar from './components/nav-bar'
import './globals.css' // tailwindcss読み込み

// Metaタグの設定 (SEO対策) : <Head>タグに対応した特殊な書き方 (本来は head.tsxに metadataを書くが 13.4以降は head.tsxが廃止になったため、 layout.tsxに記述 )
export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}


export default function RootLayout({ children }: { children: React.ReactNode}) {
  return (
    // ルートレイアウトには必ず <html> と <body> が必要
    <html>
      <body>
        <NavBar />
        {children} {/*ここに、<Page>コンポーネント (全てのコンポーネント) が入る*/}
      </body>
    </html>
  )
}