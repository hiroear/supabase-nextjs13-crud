// ログイン・新規登録ページを表示するコンポーネント

// useStateや supabaseのログイン用の APIはブラウザ側で実行していくため、クライアントコンポーネントで作る
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid' // ログインボタンに使うアイコン
import supabase from '../../utils/supabase'    // クライアントコンポーネント専用の supabaseインスタンスを import
import useStore from '../../store/index'       // zustandの storeを import


export default function Auth() {
  const { loginUser } = useStore()              // zustandの storeから loginUser() を呼び出す
  const [isLogin, setIsLogin] = useState(true)  // ログイン・新規登録の切り替え用の state (true: ログイン, false: 新規登録。 初期値は trueでログインモードで開始)
  const [email, setEmail] = useState('')        // メールアドレス用の state
  const [password, setPassword] = useState('')  // パスワード用の state
  const router = useRouter()                    // ルーティング用の routerを取得


  // ユーザーが email、 password を入力し submitボタンを押した時に呼び出される関数
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // フォームのデフォルトの挙動をキャンセル (ページ遷移をキャンセル)

    // ログインモードの場合 (isLogin = true の時に submitボタンが押された場合)
    if (isLogin) {
      /* ログイン用の API(supabase.auth.signInWithPassword) を使い、emailと password を引数に渡してログインする
      返り値: ログインに成功した場合は { user: User | null, session: Session | null, error: Error | null } というオブジェクトが返る
      ログインに失敗した場合は、{ user: null, session: null, error: Error } というオブジェクトが返る。
      → その中の error オブジェクトを取り出しておく  */
      const { error } = await supabase.auth.signInWithPassword({ email, password }) // supabase.auth.signInWithPasswordは、非同期関数なので awaitを付けて実行

      setEmail('')      // 通信が終わったら stateをリセット
      setPassword('')

      if (error) {
        alert(error.message)   // ログインに失敗した場合、エラーメッセージを alertで表示
      } else {
        router.push('/auth/todo-crud')       // ログインに成功した場合、Todo一覧ページに遷移
      }

    // 新規登録モードの場合 (isLogin = false)
    } else {
      // 新規登録の場合は supabase.auth.signUp() を使う (非同期関数)
      const { error } = await supabase.auth.signUp({ email, password })

      setEmail('')
      setPassword('')

      if (error) {
        alert(error.message)
      }
    }
  } // handleSubmit() ここまで


  // サインアウト用の関数
  function signOut() {
    supabase.auth.signOut() // supabaseの authのログアウト用 APIを実行
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      <p>{loginUser.email}</p> {/* 現在ログインしているユーザーの email を表示 */}

      <ArrowRightOnRectangleIcon
        className='my-6 h-6 w-6 cursor-pointer text-blue-500'
        onClick={signOut}
      />

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type='text'
            required
            className='my-2 rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:outline-none'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type='password'
            required
            className='my-2 rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:outline-none'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='my-6 flex justify-center text-sm'>
          <button
            type='submit'
            className='rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700'
          >
            {/* isLogin = trueの時は 「Login」 / isLogin = falseの時は 「Register」 を表示 (初期値は trueで、Login表示で開始) */}
            {isLogin ? 'Login' : 'Register'}
          </button>
        </div>
      </form>

      <p
        // ログインモード ・ 新規登録モード の切り替えボタン  /  isLoginの stateをトグルして反転させる
        onClick={() => setIsLogin(!isLogin)}
        className='cursor-pointer text-medium hover:text-indigo-500'
      >
        change mode ?
      </p>
    </div>
  )
}