// 左サイドバーのブログ一覧のタイトルをクリックすると、それぞれのブログの個別ページに対応した詳細ページを SSGで遷移・表示するコンポーネント
// ダイナミックセグメント ([blogId]) を使うと、URLの一部を動的に変更できる。→ ダイナミックルーティング

import Link from "next/link";
import type { Database } from "../../../database.types"; // supabaseのデータベースの型定義ファイル
import { notFound } from "next/navigation";
import { format } from "date-fns"; // 日付をフォーマットするためのライブラリ
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid"; // ブログ一覧に戻るボタンに使うアイコン

type Blog = Database["public"]["Tables"]["blogs"]["Row"]; // ブログの型定義

/* ユーザーが /blogs/[blogId] にアクセスすると、params.blogId には、[blogId] の値が入る (例: /blogs/1 にアクセスすると、params.blogId には、1 が入る)
このように、ダイナミックセグメントの値を受け取る際は、PageProps の params プロパティを使い、型定義しておく必要がある
PageProps: Next.jsが提供する型定義。  params: ダイナミックセグメントの値を受け取るためのプロパティ */
type PageProps = {
  params: {
    blogId: string; // ダイナミックセグメントの値を受け取る際の型定義
  }
}


/* ビルド時に SSG(静的生成)で blogの個別ページを生成するためには、事前にそれぞれの blog_idの一覧を取得しておく必要がある。
  Next.js12では、getStaticPaths()を使って、id一覧を生成・取得していたが、 Next.js13 からは generateStaticParams()を使う。
  generateStaticParams関数の中で、動的fetch()リクエストにより一覧データを fetch → 取得した blog一覧から idだけを取り出し、文字列に変換して配列 blogId に格納 → blogIdを returnで返す。
  という一連の流れを個々のサーバーコンポーネントで実行できるようになった。
  generateStaticParams()の中で、ダイナミックセグメントと紐づくプロパティを returnすることで、事前情報(blog一覧の全id)を Next.js に教えてあげることにより それぞれの個別ページの HTMLを事前に生成し、SSGでレンダリングできるようになる。
*/
export async function generateStaticParams() {
  const res = await fetch(`${process.env.url}/rest/v1/blogs?select=*`, { // supabaseの blogs のエンドポイントから、全てのブログ一覧を取得
    headers: new Headers({
      apikey: process.env.apikey as string,
    }),
  })
  const blogs: Blog[] = await res.json()

  return blogs.map((blog) => ({
    blogId: blog.id.toString(),
    // blogId: ダイナミックセグメントの値と紐づくプロパティ。ダイナミックセグメントの値は、文字列である必要があるため、blog.idを文字列に変換
  }))
}



// supabaseの blogs のエンドポイントから、idが blogIdと一致する 1つのブログデータを配列で取得する 非同期関数
async function fetchBlog(blogId: string) {
  const res = await fetch(`${process.env.url}/rest/v1/blogs?id=eq.${blogId}&select=*`,
  {
    headers: new Headers({
      apikey: process.env.apikey as string,
    }),
    cache: "force-cache", // default: Next.js13.4以降は fetch単位で cacheオプションを指定する必要がある。
  })
  // if (!res.ok) {
  //   throw new Error('Failed to fetch blog in server')
  // }

  // 取得に成功したら、取得結果を JSON に変換して blogs に代入 (JSON の返り値のデータ型として配列のデータ型 (Blog[]) を指定)
  const blogs: Blog[] = await res.json()
  return blogs[0] // blogsは配列で、1つの要素が入っているはずなので blogs[0]でオブジェクトを取得
}


// fetchBlog()が非同期関数なので、BlogDetailPage() も非同期関数にする必要がある
export default async function BlogDetailPage({ params }: PageProps) {
  // params には、ダイナミックセグメントの値が入っている (PagePropsの型定義を参照)
  // console.log(params.blogId) -> 1 | console.log(params) -> { blogId: '1' }

  const blog = await fetchBlog(params.blogId) // 対象のブログデータを 1つフェッチしてくる

  if (!blog) return notFound // 対象の blogが取得できなかったら 404ページを表示

  return (
    <div className="mt-16 border-2 p-8">
      <p>
        <strong className="mr-3">Task ID:</strong>{blog.id}
      </p>
      <p>
        <strong className="mr-3">Title:</strong>{blog.title}
      </p>
      <p>
        <strong className="mr-3">Created at:</strong>
        {blog && format(new Date(blog.created_at), 'yyyy-MM-dd HH:mm:ss')} {/* 日付をフォーマット */}
      </p>

      {/* ブログ一覧(blogsのルート [Nav to home]ボタンのページ) に戻るボタン */}
      <Link href={`/blogs`}>
        <ArrowUturnLeftIcon className="mt-3 h-6 w-6 cursor-pointer text-blue-500" />
      </Link>
    </div>
  )
}

