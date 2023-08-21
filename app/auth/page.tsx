// auth関係の UIを表示するためのコンポーネント

import Auth from '../components/auth'  // ログイン・新規登録ページのコンポーネント

export default async function AuthPage() {
  return (
    <main className={`flex h-[calc(100vh-56px)] flex-col items-center justify-center`}>
      <Auth /> {/* ログイン・新規登録画面を表示 */}
    </main>
  )
}