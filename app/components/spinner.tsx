// スピナーを生成するサーバーコンポーネント  Usage: <Spinner color="border-red-500" />

export default function Spinner({ color = 'border-blue-500' }: { color?: string}) {
  // props で color を受け取り、スピナーの色を変えれるようにしている (デフォルト値: 'border-blue-500')
  return (
    <div className="my-16 flex justify-center">
      {/* ↓ tailwindCSS でスピナーを設定・表示 */}
      <div className={`h-10 w-10 animate-spin rounded-full border-4 ${color} border-t-transparent`}/>
    </div>
  )
}