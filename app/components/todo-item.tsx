// todoの タスク一覧のチェックボックス、ゴミ箱アイコン、編集アイコン、タイトルをクリックした際の挙動をそれぞれ定義

'use client'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid"
import supabase from "../../utils/supabase" //クライアントサイドの supabaseインスタンス
import useStore from "../../store/index"    // zustand の useStore
import type { Database } from "../../database.types"

type Todo = Database['public']['Tables']['todos']['Row']  //Todoの型

export default function TodoItem(todo: Todo) {
  // todo: propsでタスクのオブジェクトを受け取れるようにしておく(データ型は Todo)
  const router = useRouter()

  /*↓ useStore フックに関数を渡して特定のステートやアクション (updateEditedTask) を取得する、コールバック関数として取得する書き方。
  これにより、updateTask 変数に updateEditedTask アクションを格納し、以降 updateTask()関数として updateEditedTask を呼び出すことができる。
  コールバック関数内で 引数(state) を利用することで、コンポーネントの外部で定義された zustand ストア内のステートやアクションにアクセスできるようになる。
  updateEditedTask: (payload) => set({ editedTask: payload })
  resetEditedTask: () => set({ editedTask: { id: '', title: '' } }) */
  const updateTask = useStore((state) => state.updateEditedTask)
  const resetTask = useStore((state) => state.resetEditedTask)

  // ユーザーがチェックボックスをクリックした際呼び出される関数
  async function updateMutate(id: string, completed: boolean) {
    // 引数で、更新する Taskの id と completed の値を受け取る ↑
    // ↓ supabaseの APIを使って更新したいテーブルの名前として todos を指定 → 更新したい新しい値をオブジェクト形式で update関数の引数に渡す → eq(イコール)で更新する Taskの idを渡す
    await supabase.from('todos').update({ completed: completed }).eq('id', id)
    resetTask() // 編集中のタスクをリセット (編集中のタスクがあると、編集中のタスクのタイトルが表示されてしまうため)
    router.refresh() // 更新した内容を Task一覧に反映 （ページ全体をリロードせずに、サーバーコンポーネントの再実行だけを行う）
  }

  // ユーザーがゴミ箱アイコンをクリックした際に呼び出される関数
  async function deleteMutate(id: string) {  // 引数で、削除する Taskの id を受け取る
    // ↓ supabaseの API、DELETE を実行
    await supabase.from('todos').delete().eq('id', id)
    router.refresh() // 削除後の内容を Task一覧に反映
  }


  return (
    <li className="my-2">
      <input
        className="mr-1" type="checkbox" checked={todo.completed} //propsで受け取った todo.completed
        onChange={(e) => updateMutate(todo.id, !todo.completed)} // チェックボックスをクリックした際に updateMutate関数を実行 (completedの値を反転させたものを新しいデータとして渡す)
      />

      {/* ↓ todo のタイトルをクリックすると、ダイナミックセグメントで todoの個別ページに遷移 */}
      <Link href={`auth/todo-crud/${todo.id}`}>{todo.title}</Link>

      <div className="flex float-right ml-20">
        <PencilIcon
          className="mx-1 h-5 w-5 cursor-pointer text-blue-500"
          onClick={() => updateTask({ id: todo.id, title: todo.title }) } // 編集アイコンをクリックしたら、updateTask関数を実行 (引数に todoの id,title を渡す)
        />
        <TrashIcon
          className="h-5 w-5 cursor-pointer text-blue-500"
          onClick={() => deleteMutate(todo.id)} // ゴミ箱アイコンをクリックしたら、deleteMutate関数を実行 (引数に todoの id を渡す)
        />
      </div>
    </li>
  )
}

