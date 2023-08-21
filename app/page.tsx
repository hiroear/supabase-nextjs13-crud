// 全てのコンポーネントは app直下の Pageコンポーネントにラップされる
// Appディレクトリでは全てのコンポーネントがデフォルトでサーバーコンポーネントとなっている

/* サーバーコンポーネント側からクライアントコンポーネントを importすることはできるが、クライアントコンポーネント側からサーバーコンポーネントの import はできない。
  例外として、クライアントコンポーネントの children としてサーバーコンポーネントを渡す形で import することはできる。 */

import { Suspense } from "react";
import NotesList from "./components/notes-list";       // ノートの一覧を表示するコンポーネント (サーバー)
import TimerCounter from "./components/timer-counter"; // タイマーを表示するコンポーネント (クライアント)
import Spinner from "./components/spinner";            // スピナーを表示するコンポーネント (サーバー)
import RefreshBtn from "./components/refresh-btn";     // リフレッシュボタンを表示するコンポーネント (クライアント)

export default function Page() {
  return (
    <main>
      <div className="m-10 text-center">
        <p>Hello World🚀</p>

        <Suspense fallback={<Spinner color="border-green-500"/>}>
          {/* @ts-ignore */}
          <NotesList />
        </Suspense>
        {/* <loading />コンポーネントが適用される時に <Suspense/>で この<Page/>コンポーネントをラップする仕様のため、Pageコンポーネント全体の処理が解決してから
          <Loading/>のスピナーを表示 → <Page/>コンポーネントの中身を表示 → <TimerCounter/>が開始される。
          実際に処理に時間がかかっているのは <NotesList/>の setTimeout部分だけなのに、その他の HelloWorldや <TimerCounter/>もそれに引っ張られて、表示が遅くなってしまう。
          それを防ぐため、streaming HTMLという技術を使って、<NotesList/>の処理完了を待たずに、他のコンポーネントを表示させておくことができる。
          方法は、コンポーネントレベルで 足を引っ張っている <NotesList/>を <Suspense/>でラップしてあげるだけ。
          そうすることで、コンポーネントごとに処理を分けることができて <NotesList/>の処理完了を待たずに、HelloWorldや <TimerCounter/>は
          クライアント側にストリーミングで HTMLが表示され、さらに必要な javascriptが読み込まれ、すぐにインタラクティブにすることができる。
          → 結果>> ローディングのスピナーが回っている間に、HelloWorldや <TimerCounter/>が表示されるようになった。
        */}

        <TimerCounter />

        <RefreshBtn />
      </div>
    </main>
  );
};

// streaming HTML : HTMLコンテンツが完全に読み込まれるのを待つのではなく、利用可能な部分を徐々にレンダリングして表示する方法