// nasted-layout/secondフォルダ配下専用のレイアウトコンポーネント

export default function SecondLayout({ children } : { children: React.ReactNode }) {
  return (
    <main className="mt-6 text-center">
      <p>Layout 2</p>
      { children } {/* nasted-layout/second 直下の <Page>コンポーネントが入る */}
    </main>
  )
}