// このコンポーネントの戻り値は null で、UIを表示するためのものではなく、ログイン状態やアクセストークンの監視、更新を行うためのコンポーネント

'use client'  // useEffect や supabaseのインスタンスを使うためクライアントコンポーネントで作る

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '../../utils/supabase'    // クライアントコンポーネント専用の supabaseインスタンスを import
import useStore from '../../store/index'       // zustandの storeを import

export default function SupabaseListener({ accessToken }: { accessToken?: string }) {
  // layout.tsxの <AuthLayout/>から、サーバーサイドに保存されているアクセストークンが propsに渡ってきている

  const router = useRouter()
  const { updateLoginUser } = useStore() // zustandの storeから updateLoginUser()を呼び出し

  useEffect(() => {
    const getUserInfo =async () => {
      const { data } = await supabase.auth.getSession() // クライアント側のユーザーセッション情報を取得 (今ログインしているユーザー情報)

      // セッションが存在する場合 loginUser(zustandの store) に、今ログインしているユーザーの情報をセット(更新)
      if (data.session) {
        updateLoginUser({ // zustandの 更新関数 updateLoginUser: (payload) => set({ loginUser: payload })
          id: data.session?.user.id,
          email: data.session?.user.email!,
        })
      }
    }
    getUserInfo() // 上の関数を実行 (loginUserを、今ログインしているユーザーの情報に更新)

    /* supabase.auth.onAuthStateChange(): ユーザーのログイン状態が変化する度に、中の処理を実行する
      第一引数には前回の認証セッション、第二引数には現在の認証セッションが渡される。(今回は _ として第一引数を使わず、前回の認証セッションを無視)
      第2引数の sessionに 現在の認証 session が渡され、この sessionを使って中の処理を行う。 */
    supabase.auth.onAuthStateChange((_, session) => {
      updateLoginUser({ id: session?.user.id, email: session?.user.email! })  // zustandの loginUserを、最新の値に更新

      /* このコンポーネントで取得した session(クライアント側の session)のアクセストークンと、 propsで受け取ったサーバーサイドの accessToken が一致しない場合
        サーバーコンポーネント(layout.tsxの <AuthLayout/>) を再実行して、最新のサーバーサイドの accessToken を取得しに行く */
      if (session?.access_token !== accessToken) {
        router.refresh()
      }
      /*
      router.refresh()はページ全体を リロードせずに、特定の部分だけを再実行するための手段として使用されるメソッド。
      ページ全体をリロードせずに、サーバーコンポーネントの再実行だけを行うことができる。
      */
    })
  }, [accessToken])

  return null
}