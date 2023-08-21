// マウントされた時に 0.5秒ごとにカウントアップする数字を表示 ・ 数字をリセットするボタンを配置したクライアントコンポーネント
// クライアントサイドでのみ動作するコンポーネントは components ディレクトリに配置する
'use client'
import { useState, useEffect } from 'react'

export default function TimerCounter() {
  const [count, setCount] = useState(0)

  // このクライアントコンポーネントがマウントされた時に 0.5秒ごとにカウントアップ
  useEffect(() => {
    const timer = setInterval(() => setCount((prevCount) => prevCount + 1), 500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      <p>{count}</p>
      <button
        className='font-sm my-3 rounded bg-indigo-600 py-1 px-3 text-white hover:bg-indigo-700'
        onClick={() => setCount(0)}
      >
        reset  {/* カウントをリセットするボタン */}
      </button>
    </div>
  )
}