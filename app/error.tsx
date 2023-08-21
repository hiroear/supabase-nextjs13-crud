// <ErrorBoundary fallback={<Error />}> で囲まれたコンポーネントで発生したエラーをキャッチして、自動的にエラーメッセージを表示する
// <Layout><ErrorBoundary><Suspense><Page> のような構造になっている

// サーバーコンポーネントで発生したエラーを、クライアント側で表示する必要があるため 明示的にクライアントコンポーネントにする
'use client';

export default function Error({ error }: { error: Error }) {
  return (
    <div>
      {/* エラーメッセージ */}
      <p className="mt-6 text-center text-red-500">
        Data fetching in server component failed
      </p>
    </div>
  )
}