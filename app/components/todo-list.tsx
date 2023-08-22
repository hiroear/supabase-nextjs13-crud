// supabaseから todos一覧を取得・並び替えて todoをリストで表示するコンポーネント

import { headers, cookies } from 'next/headers'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs' // サーバーコンポーネント専用の supabaseインスタンスを生成するためのモジュール
import type { Database } from '../../database.types' // supabaseのデータベースの型定義ファイル
import TodoItem from './todo-item'                   // TodoItemコンポーネント(クライアント)

export default async function TodoList() {
  // サーバーコンポーネント専用の Supabaseインスタンスを生成し、リクエストに含まれる headers と cookies を使用して認証情報を Supabase に送信
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies
  });
  /* headers と cookies の説明は app/auth/layout.tsx の中でも書いたが、もう一つ。
    headers、cookies は next.jsの中で 「ダイナミックファンクション」 と呼ばれていて、ヘッダーやクッキーの値はリクエスト前に値が変わる可能性があるため、
    ダイナミックファンクションを使用しているページは、自動的にダイナミックレンダリングに切り替わる。最新の情報を提供するための処理を行う。
    */

   // supabaseの todos のエンドポイントから、全ての todo一覧を取得し、created_atの昇順で並び替え → 取得した todo一覧を todos変数に格納
   // { data: todos } は分割代入の構文で、supabaseオブジェクトの data プロパティの値を todos という変数に格納するために使われている。分割代入で data プロパティの値を取り出してから、todos変数に格納しているイメージ
  const { data: todos } = await supabase.from('todos').select('').order('created_at', { ascending: true })

  return (
    <ul className='my-6 mx-3'>
      {todos?.map((todo) => (
        <TodoItem key={todo.id} {...todo} />
        /* {...todo} はスプレッド構文。todoには、 id: title: completed:...などの複数のプロパティが内包されていて、そのオブジェクト内の各プロパティを展開して TodoItem コンポーネントに propsとして渡す書き方。
        todo オブジェクトのプロパティを個別に指定せずに一括してコンポーネントに渡すことができ、コードの可読性を高めつつ、冗長さを避けることができる。
        オブジェクトのプロパティが多くなる場合や、プロパティが変更された場合に都度修正する手間を省くため、{...todo} のように展開して一括で渡す方法が使われる。 */
      ))}
    </ul>
  )
}