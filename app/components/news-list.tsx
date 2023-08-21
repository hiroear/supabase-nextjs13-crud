// supabaseの news から newsデータを取得し、newsのタイトル一覧を表示するコンポーネント
import type { Database } from "@/database.types"; // supabaseのデータベースの型定義ファイル
import Counter from "./counter";                  // カウンターコンポーネント

type News = Database["public"]["Tables"]["news"]["Row"]; // ニュースの型定義

const fetchNews = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const res = await fetch(`${process.env.url}/rest/v1/news?select=*`, {
    headers: new Headers({
      apikey: process.env.apikey as string,
    }),
    cache: "force-cache", 
  })
  if (!res.ok) {
    throw new Error('Failed to fetch news in server')
  }
  const news: News[] = await res.json()
  return news
}


export default async function NewsList() {
  const news = await fetchNews() // supabaseの news の一覧を取得
  return (
    <div className="m-1 border border-blue-500 p-4">
      <Counter /> {/* カウンターコンポーネント(クライアント) */}
      <p className="mb-4 pb-3 text-xl font-medium underline underline-offset-4">
        News
      </p>
      <ul className="m-3">
        {news.map((news) => (
          <li key={news.id} className="my-1 text-base">
            {news.title}
          </li>
        ))}
      </ul>
    </div>
  )
}