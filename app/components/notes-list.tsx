// supabaseの notes テーブルからデータを取得し、一覧表示するコンポーネント
import type { Database } from "../../database.types"; // supabaseのデータベースの型定義ファイル
import { format } from "date-fns"; // 日付をフォーマットするためのライブラリ

type Note = Database["public"]["Tables"]["notes"]["Row"]; // ノートの型定義

// supabaseの notesのエンドポイントから notesの一覧を取得する 非同期関数
async function fetchNotes() {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // わかりやすいように意図的に 2秒待つ

  const res = await fetch(`${process.env.url}/rest/v1/notes?select=*`, {
    // process.env.url : .env.local に書いた supabase の URL
    // この URL は、supabase のプロジェクトのページの APIDocs → notes → READ ALL ROWS のコマンド(Bash)に書いてある

    // リクエストヘッダーに、supabaseの APIキーを設定 (.env.local に書いた APIキー)
    headers: new Headers({
      apikey: process.env.apikey as string,
    }),
    cache: "no-store", // キャッシュを無効化(ダイナミックルーティング)
    // next: { revalidate: 10 }, // ISR ・ 10秒ごとに再検証 (10秒経つまでは何度リロードしても再更新されない)
  })

  // レスポンスがエラーだったら、エラーを投げる (res.ok は、レスポンスのプロパティで、レスポンスがエラーの時 false になる)
  if (!res.ok) {
    // throw new Error() : 関数の実行を止めて、関数の呼び出し元で try-catch でキャッチしてエラーを投げる (関数の中でしか使えない)
    throw new Error('Failed to fetch notes in server')
  }

  // 取得に成功したら、取得結果を JSON に変換して notes に代入 (JSON の返り値のデータ型として配列のデータ型 (Note[]) を指定)
  const notes: Note[] = await res.json()

  return notes // 取得した JSON形式の notes の一覧を返す
}


// supabaseの notes テーブルからデータを取得し、一覧表示する サーバーコンポーネント
// fetchNotes() が非同期関数なので、NotesList() も非同期関数にする必要がある
export default async function NotesList() {
  const notes = await fetchNotes() // supabaseの notes の一覧を取得
  return (
    <div>
      <p className="my-4 pb-3 text-xl font-medium underline underline-offset-4">
        Notes
      </p>
      <ul className="m-3">
        {notes.map((note) => (
          <li key={note.id}>
            <p>{note.title}</p>
            <p>
              <strong className="mr-3">Created at:</strong>
              {note && format(new Date(note.created_at), 'yyyy-MM-dd HH:mm:ss')} {/* 日付をフォーマット */}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}