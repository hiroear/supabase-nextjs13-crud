// ログイン後の画面で、タスクの編集と新規作成を行うコンポーネント
'use client'
import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid'
import useStore from "../../store/index"       // zustandの storeを import
import supabase from "../../utils/supabase"    //クライアントコンポーネント専用の supabaseインスタンスを import

export default function EditTask() {
  const router = useRouter()
  const { editedTask, loginUser } = useStore() // zustandの storeから editedTask, loginUser を呼び出す
  const updateTask = useStore((state) => state.updateEditedTask) // zustandの storeから updateEditedTask を呼び出し、updateTaskに格納
  const reset = useStore((state) => state.resetEditedTask) // zustandの storeから resetEditedTask を呼び出し、resetに格納

  // ログアウト用の関数
  function signOut() {
    supabase.auth.signOut()
    router.push('/auth') // ログアウト後はログインページに遷移
  }

  // todoの編集時と、新規作成時に submitボタンが押された時に呼び出される関数
  async function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // 新規作成時
    if (editedTask.id === '') {
      // supabaseの APIを使って、todosテーブルに新しいデータを追加
      const { error } = await supabase.from('todos').insert({ title: editedTask.title, user_id: loginUser.id })
      router.refresh()  // 新規作成後の内容を Todo一覧に反映
      reset()           // 編集中のタスクをリセット

    // 編集時
    } else {
      // supabaseの APIを使って、todosテーブルのデータを更新
      const { error } = await supabase.from('todos').update({ title: editedTask.title }).eq('id', editedTask.id)
      router.refresh()  // 編集後の内容を Todo一覧に反映
      reset()           // 編集中のタスクをリセット
    }
  }

  return (
    <div className="m-5 text-center">
      <p className='my-3'>{loginUser.email}</p>
      <div className='flex justify-center'>
        {/* ログアウトアイコン */}
        <ArrowRightOnRectangleIcon
          className='my-3 h-6 w-6 cursor-pointer text-blue-500'
          onClick={signOut}
        />
      </div>
      <form onSubmit={submitHandler}>
        <input
          type='text'
          className='my-2 rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:outline-none'
          placeholder='New task ?'
          value={editedTask.title || ''} // 編集中のタスクのタイトルを表示 (editedTask.titleが空の場合は、空文字を表示)
          onChange={(e) => updateTask({ ...editedTask, title: e.target.value })} // 編集中(or 新規)タスクのタイトルを更新 (editedTaskの中身を展開して、titleの値を更新)
        />
        <button
          type='submit'
          className='ml-2 rounded bg-indigo-600 py-2 px-3 text-sm font-medium text-white hover:bg-indigo-700'
        >
          {editedTask.id === '' ? 'Create' : 'Update'} {/* 編集中のタスクの id が空の場合は、Createを表示。空でない場合は、Updateを表示 */}
        </button>
      </form>
    </div>
  )
}