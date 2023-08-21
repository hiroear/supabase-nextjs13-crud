// nasted-layoutフォルダ配下専用のレイアウトコンポーネント
/* ネスティッドルーティング の layoutファイルは、階層を下げたその中に更に layoutファイルを作成すると、Layout1と Layout2のように、
上の階層の layoutファイルを継承しながら、現在の階層の layoutファイルを適用することができる */

export default function FirstLayout({ children } : { children: React.ReactNode }) {
  return (
    <main className="mt-6 text-center">
      <p>Layout 1</p>
      { children } {/* nasted-layoutフォルダ直下の <Page>コンポーネントが入る */}
    </main>
  )
}