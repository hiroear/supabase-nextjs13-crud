// Todo個別ページのコンポーネント
import { notFound } from "next/navigation"
import { headers, cookies } from "next/headers"
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs" // サーバーコンポーネント専用の supabaseインスタンスを生成するためのモジュール
import { format } from "date-fns"          // 日付をフォーマットするためのライブラリ
import type { Database } from "../../../../database.types" // supabaseのデータベースの型定義ファイル

type PageProps = {
  params: {
    todoId: string; // ダイナミックセグメントの値を受け取る際の型定義
  }
}

// propsで todoId の値を受け取る (PageProps型の params プロパティの todoId プロパティ)
export default async function TodoDetailPage({ params }: PageProps) {
  // propsで受け取った todoIdを使って supabaseに問い合わせ → idが todoIdと一致する todoデータを取得するため、ここはサーバーコンポーネントなので、サーバーコンポーネント専用の supabaseインスタンスを生成
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies
  });

  // supabaseの todos のエンドポイントから、idが todoIdと一致する 1つの todoデータを取得 → 変数 todoに格納 / error オブジェクトも取り出す (非同期関数)
  const { data: todo, error } = await supabase
    .from('todos')             // from('todos'): todosテーブルを指定
    .select('*')               // select('*'): 全てのカラムを取得
    .eq('id', params.todoId)   // eq('id', params.todoId): idが todoIdと一致する todoデータを取得
    .single()                  // single(): 1つのデータを取得

    if (!todo) return notFound() // todoが取得できなかった場合は、NotFoundページを表示

  // 取得した todoデータを表示
  return (
    <div className="mt-16 border-2 p-8">
      <p>Task ID: {todo.id}</p>
      <p>Title: {todo.title}</p>
      <p>Status: {todo.completed ? 'done' : 'not yet'}</p>
      <p>
        Created at: {todo && format(new Date(todo.created_at), 'yyyy-MM-dd HH:mm:ss')}
      </p>
    </div>
  )
}

/* ブラウザで左サイドバーの Todoリストの 1つを編集すると、リアルタイムに Todo個別ページの内容も更新される。
これは、 todo-item.tsx や todo-edit.tsx で、編集後には 一回一回 router.refresh()を実行しているから。
router.refresh()は そのページの階層のルートから再レンダリング(サーバーのみ)するため、Todo個別ページの内容も更新される。
 */