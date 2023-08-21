// ローディング画面を表示するコンポーネント
// <Page>コンポーネントをラップする形で <Suspense fallback={<Loading/>} > のように next.js側で設計されている
// <Layout><ErrorBoundary><Suspense><Page> のような構造になっている

import Spinner from "./components/spinner"; // スピナーを表示するコンポーネント

export default function Loading() {
  return <Spinner />
};