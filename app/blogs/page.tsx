// ブログのルートページのコンポーネント
import RouterBtn from "../components/router-btn"; // ボタンがクリックされた時に、router.push()を使って特定のページに遷移するコンポーネント (クライアント)

export default function BlogPage() {
  return (
    <div className="m-10 text-center">
      <span className="text-lg">
        Click a title on the left to view detail 🚀
      </span>
      <div className="my-5 flex justify-center">
        <RouterBtn destination='' />
      </div>
    </div>
  )
}