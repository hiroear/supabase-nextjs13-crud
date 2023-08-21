// nasted-layout/second/third フォルダ配下専用のレイアウトコンポーネント

export default function ThirdLayout({ children } : { children: React.ReactNode }) {
  return (
    <main className="mt-6 text-center">
      <p>Layout 3</p>
      { children } {/* nasted-layout/second/third 直下の <Page>コンポーネントが入る */}
    </main>
  )
}