// [Nav to ~] ボタンがクリックされた時に、ボタンの表示が変更され、router.push()を使って特定のページに遷移する
'use client'
// router.push()を使うため useRouter()を import (useRouter()は、クライアントコンポーネントでしか使えない)
import { useRouter } from 'next/navigation'

export default function RouterBtn({ destination = '' }: { destination?: string}) {
  // destination: router.push()で遷移先を変える際に必要なパスを受け取るための props (デフォルト値: '')
  // このコンポーネントを使う側で、<RouterBtn destination='blogs' /> として propsを送る → router.push(/blogs) となり = app/blogs/page.tsx のページに遷移できる

  const router = useRouter() // useRouter()を展開
  return (
    <button
      className='rounded bg-indigo-600 py-1 px-3 font-medium text-white hover:bg-indigo-700'
      onClick={() => router.push(`/${destination}`)}
    >
      Nav to {destination ? destination : 'home'} {/* destinationがあれば、destinationを表示。なければ、'home'を表示 */}
    </button>
  )
}