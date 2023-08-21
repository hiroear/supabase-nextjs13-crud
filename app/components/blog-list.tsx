// supabaseの blogs からブログのデータを取得し、ブログのタイトル一覧を表示するコンポーネント
import type { Database } from "@/database.types"; // supabaseのデータベースの型定義ファイル

type Blog = Database["public"]["Tables"]["blogs"]["Row"]; // ブログの型定義

const fetchBlogs = async () => {
  await new Promise((resolve) => setTimeout(resolve, 6000)) // わかりやすいように意図的に 6秒待つ

  const res = await fetch(`${process.env.url}/rest/v1/blogs?select=*`, {
    headers: new Headers({
      apikey: process.env.apikey as string,
    }),
    cache: "force-cache", 
  })

  if (!res.ok) {
    throw new Error('Failed to fetch blogs in server')
  }
  const blogs: Blog[] = await res.json()
  return blogs
}


export default async function BlogList() {
  const blogs = await fetchBlogs() // supabaseの blogs の一覧を取得
  return (
    <div className="p-4">
      <p className="mb-4 pb-3 text-xl font-medium underline underline-offset-4">
        Blogs
      </p>
      <ul className="text-sm">
        {blogs?.map((blog) => (
          <li key={blog.id} className="my-1 text-base">
            {blog.title}
          </li>
        ))}
      </ul>
    </div>
  )
}