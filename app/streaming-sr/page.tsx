export const revalidate = 0 // ダイナミックレンダリングを有効化。 セグメントレベルで一括してキャッシュのオプションを設定

import { Suspense } from "react"
import BlogList from "../components/blog-list" // supabaseの blogsからブログのデータを取得し、ブログの一覧を表示するコンポーネント (サーバー)
import NewsList from "../components/news-list" // supabaseの newsからニュースのデータを取得し、ニュースの一覧を表示するコンポーネント (サーバー)
import Spinner from "../components/spinner"    // スピナーを表示するコンポーネント (サーバー)

export default function StreamingServerRenderingPage() {
  return (
    <section className="flex">
      <aside className="w-1/4">  {/* 左サイドバー | <BlogList/>を<Suspense/>でラップ */}
        <section className="fixed m-1 h-full w-1/4 border border-blue-500 bg-gray-200 p-1">
          {/* <Suspense/>でラップすることで、<BlogList/>の処理完了を待たずに、他のコンポーネントを表示させておくことができる。 */}
          <Suspense fallback={<Spinner color="border-green-500"/>}>
            {/* @ts-ignore */}
            <BlogList />
          </Suspense>
        </section>
      </aside>

      <main> {/* メイン | <NewsList/>を<Suspense/>でラップ */}
        <section className="fixed w-3/4">
          {/* <Suspense/>でラップすることで、<NewsList/>の処理完了を待たずに、他のコンポーネントを表示させておくことができる。 */}
          <Suspense fallback={<Spinner />}>
            {/* @ts-ignore */}
            <NewsList />
          </Suspense>
        </section>
      </main>
    </section>
  )
}