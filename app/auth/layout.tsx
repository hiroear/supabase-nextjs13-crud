// サーバーサイドで認証情報を取得し、クライアント側でログイン状態やアクセストークンの監視を行うためのレイアウトコンポーネント

import { headers, cookies } from "next/headers";                // リクエストヘッダーとクッキーを取得するためのモジュール
import SupabaseListener from "../components/supabase-listener"; // UIを表示するためのものではなく、ログイン状態やアクセストークンの監視、更新を行うためのコンポーネント
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs"; // サーバーコンポーネント専用の supabaseインスタンスを生成するためのモジュール
import type { Database } from "../../database.types";           // supabaseのデータベースの型定義ファイル


export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  // サーバーコンポーネント専用の supabaseインスタンスを生成 (引数には、リクエストヘッダーとクッキーを渡す)
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies
  });
  /**
   * headersと cookiesは、サーバーコンポーネントがブラウザからのリクエストと同じように動作するために必要な情報。
   * 通常、クライアントからのリクエストにはヘッダーとクッキーが含まれており、サーバーコンポーネント専用の supabaseインスタンスを生成する際に、リクエストヘッダーとクッキーを渡す必要がある。
   * ヘッダーとクッキーを引数に渡すことで、サーバーコンポーネント内で Supabaseクライアントがリクエストを正しく処理できるようになり、
   * 以下の getSession()でクライアントと同じように認証情報やセッション情報を取得できるようになる。(components/todo-list.tsxにも詳しく書いた)
   */

  // 上で生成したサーバーコンポーネント専用の supabaseのインスタンスを使って、サーバーサイドに保存されているユーザーのセッション情報を取得 → session変数に格納
  const { data: { session }} = await supabase.auth.getSession();

  return (
    <>
      {/* サーバーサイドの現在のセッション情報からアクセストークンを取り出して、 SupabaseListenerコンポーネントの propsに渡す */}
      <SupabaseListener accessToken={session?.access_token} />
      { children }
    </>
  )
}