// グローバルステートを管理するための zustand を設定 (https://zustand.surge.sh/)、型定義も行う
import create from 'zustand'; // グローバルステートを管理するためのライブラリ (create: zustandの storeを作成する関数)

// 管理したいグローバルステートの型を定義
type EditedTask = {    // TODOアプリの編集中のタスクを管理するグローバルステート
  id: string
  title: string | null
}

type LoginUser = {     // ログインしているユーザーの emailと IDを管理するグローバルステート
  id: string | undefined
  email: string | undefined
}

// ↓ zustandの storeの中の stateと関数の型を定義
type State = {
  editedTask: EditedTask             //上で定義した EditedTask型を editedTask に割り当てる
  updateEditedTask: (payload: EditedTask) => void  // editedTaskの値を更新する関数 (引数 payloadに EditedTask型を設定、返り値は void)
  resetEditedTask: () => void        // editedTask をリセットする関数 (引数なしの返り値は void)
  loginUser: LoginUser               //上で定義した LoginUser型を loginUser に割り当てる
  updateLoginUser: (payload: LoginUser) => void   // loginUserの値を更新する関数 (引数 payloadに LoginUser型を設定、返り値は void)
  resetLoginUser: () => void         // loginUserをリセットする関数 (引数なしの返り値は void)
}

// zustandの create関数を使って storeを作成 → 具体的に stateの初期値と 関数の処理内容を定義 (<State>型)
// set: storeの中の stateを更新する関数 | get: storeの中の stateを取得する関数
const useStore = create<State>(set => ({
  editedTask: { id: '', title: '' },      // state (editedTask) の初期値を設定
  updateEditedTask: (payload) => set({ editedTask: payload }), // 引数 payloadで受け取った値で editedTask の値を更新
  resetEditedTask: () => set({ editedTask: { id: '', title: '' } }),  // editedTask の値を初期値にリセット

  loginUser: { id: '', email: '' },       // state (loginUser) の初期値を設定
  updateLoginUser: (payload) => set({ loginUser: payload }),   // 引数 payloadで受け取った値で loginUser の値を更新
  resetLoginUser: () => set({ loginUser: { id: '', email: '' } })    // loginUser の値を初期値にリセット
}))

export default useStore; // 他のファイルで import できるように export