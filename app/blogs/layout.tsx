// 左サイドバーにブログのタイトル一覧と、リフレッシュボタンを表示する layoutコンポーネント
import BlogListStatic from "../components/blog-list-static"; // supabaseの DBからブログのデータを取得し、ブログの一覧を表示するコンポーネント (サーバー)
import RefreshBtn from "../components/refresh-btn";          // リフレッシュボタンを表示するコンポーネント (クライアント)

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  // layoutファイルなので propsで childrenを受け取れるようにしておく

  return (
    <section className="flex">
      <aside className={`h-[calc(100vh-56px)] w-1/4 bg-gray-200 p-2`}>
        {/* @ts-ignore */}
        <BlogListStatic />
        <div className="flex justify-center">
          <RefreshBtn />
        </div>
      </aside>
    
      {/* app/blogs/page.tsx の内容が children に入る */}
      <main className="flex flex-1 justify-center">{children}</main>
    </section>
  )
}