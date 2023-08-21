import Link from "next/link";

export default function NavBar() {
  return (
    <header className="bg-gray-800 p-4">
      <nav className="space-x-4">
        <Link
          href="/"  // app/page.tsx に遷移
          className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
        >
          Home
        </Link> 

        <Link
          href="/blogs"  // app/blogs/page.tsx に遷移
          className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
        >
          Nested Layout with Blogs
        </Link>

        <Link
          href="/streaming-sr"  // app/streaming-sr/page.tsx に遷移
          className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
        >
          Streaming SR
        </Link>

        <Link
          href="/auth"  // app/auth/page.tsx に遷移
          className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
        >
          Auth with CRUD
        </Link>
      </nav>
    </header>
  )
}