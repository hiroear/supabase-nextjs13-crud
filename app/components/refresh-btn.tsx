// ブラウザをリロードせずに、ページを最新の状態に更新するボタン
'use client'

// next.jsの router.refresh()を使うため useRouter()を import (useRouter()は、クライアントコンポーネントでしか使えない)
import { useRouter } from 'next/navigation'

export default function RefreshBtn() {
  const router = useRouter() // useRouter()を実行すると、routerオブジェクトが返る

  return (
    <button
      className='rounded bg-indigo-600 py-1 px-3 font-medium text-white hover:bg-indigo-700'
      onClick={() => router.refresh()} //ページ全体を リロードせずに、特定の部分だけを再実行するための手段として使用される
    >
      Refresh current route
    </button>
  )
}

/* <Page/>コンポーネントでこのコンポーネントを import して <TimerCounter/> の下に配置した。
  結果>> ブラウザ上の [Refresh current route]ボタンをクリックすると、最新のページに更新されたにも関わらず、
  カウンターの値はそのまま保持され、インクリメントされ続けていることを確認。
  router.refresh経由でページを更新すると、<Page/>コンポーネントは再レンダリングされないため、<TimerCounter/>コンポーネントも再レンダリングされない。
  そのため、<TimerCounter/>コンポーネントの useStateのローカルの値も保持され続け <Page/>コンポーネントが再レンダリングされるまで、カウンターがインクリメントされ続ける。
  このような挙動をするのは、<Page/>コンポーネントがクライアントコンポーネントであるため。
  クライアントコンポーネントは、ページの再読み込みが発生しない限り、再レンダリングされない。
  一方、サーバーコンポーネントは、ページの再読み込みが発生しなくても、再レンダリングされるので <NotesList/>コンポーネントは再レンダリングされ、supabaseにアクセスして最新のデータを取得し直す。
*/