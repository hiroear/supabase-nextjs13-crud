// supabaseのデータベースからブログのデータを取得し、ブログの一覧を表示するコンポーネント

import Link from "next/link";
import type { Database } from "../../database.types"; // supabaseのデータベースの型定義ファイル

type Blog = Database["public"]["Tables"]["blogs"]["Row"]; // ブログの型定義


// supabaseの blogsのエンドポイントから blogsの一覧を取得する 非同期関数
async function fetchBlogs() {
  const res = await fetch(`${process.env.url}/rest/v1/blogs?select=*`, {
    headers: new Headers({
      apikey: process.env.apikey as string,
    }),
    // cache: "no-store", // キャッシュを無効化(ダイナミックルーティング)
    cache: "force-cache", // キャッシュを強制的に更新する (キャッシュがあっても、キャッシュを無視してサーバーからデータを取得する)
  })

  if (!res.ok) {
    throw new Error('Failed to fetch blogs in server')
  }

  const blogs: Blog[] = await res.json()
  return blogs
}


export default async function BlogListStatic() {
  const blogs = await fetchBlogs() // supabaseの blogs の一覧を取得
  return (
    <div className="p-4">
      <p className="mb-4 pb-3 text-xl font-medium underline underline-offset-4">
        Blogs
      </p>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id} className="my-1 text-base">
            {/* Linkコンポーネントの prefetchプロパティを false にすると、リンク先のページのデータを事前に取得しないようにできる (デフォルトで true になっている) */}
            <Link prefetch={false} href={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}