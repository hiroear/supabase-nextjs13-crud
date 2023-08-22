// TodoのCRUDを行うページのレイアウトを定義するコンポーネント
import { Suspense } from "react";
import Spinner from "../../components/spinner";
import EditTask from "../../components/todo-edit"; // タスクの編集・新規作成を行うコンポーネント
import TodoList from "../../components/todo-list"; // supabaseから todos一覧を取得し、リストで表示するコンポーネント

// async をつける理由は、<TodoList/>コンポーネントの中で supabaseから、todo一覧を取得する非同意処理を行っているため。<TodoList/>を使う TodoLayoutコンポーネントも非同期処理になる。
export default async function TodoLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex">
      <aside className={`h-[calc(100vh-56px)] w-1/4 bg-gray-200`}>
        <EditTask />
        <Suspense fallback={<Spinner />}>
          <TodoList /> {/* <Suspense/>で囲ってストリーミングできるようにしておく */}
        </Suspense>
      </aside>
      <main className="flex flex-1 justify-center">{children}</main>
    </section>
  )
}