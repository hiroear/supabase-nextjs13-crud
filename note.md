## cache: 'force-cache'
Next.js12 の時の getStaticPropsしたものに近い。  
Next.js13 でも引き続き defaultの挙動となっているが、13.4以降は fetch単位で cacheオプションを指定する必要がある。  
ネットワークからのレスポンスをキャッシュせず、常にキャッシュされたリソースを使用することを示す。  
つまり、リソースがキャッシュに保存されている場合でも、ネットワークリクエストが行われ、レスポンスが再度キャッシュに保存され、常に最新のデータを取得しようとする場合に使用される。  
```
fetch(url, {
  method: "GET",
  cache: "force-cache"
})
```


## next: { revalidate: 10 }
Next.js12 の時の getStaticPropsで revalidateしたものに近い。  
データのリソース再取得を制御するためのオプション。  
このオプションを使用することで、ページのデータを定期的に再取得して最新の情報を提供することができる。
```
fetch(url, {
  next: { revalidate: 10 },  // 10秒ごとに再取得を試みる
})
```
上の例では、関数内の fetch時に revalidate オプションを設定。データは最初に取得された後、10秒ごとにデータが再取得される。  
主に静的生成（SSG）モードのページで使用されることが一般的。  
例えば、特定のページのデータが時間の経過とともに変化する場合に、定期的に最新のデータを取得して表示するなど。  
しかし、revalidate を過剰に短い間隔で設定すると、サーバーへの負荷が増加する可能性があるため、適切な間隔を選ぶことが重要。  


## cache: 'no-store'
Next.js12 の時の getServerSidePropsしたものに近い。  
ブラウザーが特定のリクエストに対してキャッシュを使用しないように指示する。  
リクエストごとに必ずサーバーからデータを取得し、キャッシュを無効化する。
```
const response = await fetch(url, {
  cache: 'no-store', // キャッシュを使用しない
});
```
上のコードは、指定されたURLに対してリクエストを行う際に、キャッシュを使用せずに常にサーバーからデータを取得することを指示している。  
リアルタイムなデータやセンシティブな情報の場合、特にAPIリクエストなどで頻繁に使用される。  
サーバーサイドから返されるHTTPヘッダーにこの指示が含まれていれば、ブラウザーはキャッシュを使用せずに常に新しいデータを取得することになる。  
しかし、キャッシュを無効化するため、リクエストごとにサーバーへの負荷が増加する可能性があることに注意が必要。  


## generateStaticParams()
generateStaticParams 関数を利用することで Dynamic Routes もビルド時に静的なファイルとして作成することができる。  
generateStaticParams を利用して id の値を blogs/[blogId]/page.tsx ファイルで Next.js に教えてあげる必要がある。  
Next.js12では、getStaticPaths()を使って、id一覧を生成・取得していたが、 Next.js13 からは generateStaticParams 関数内での動的fetch()リクエストにより一覧データを fetch → 取得した blog一覧から idだけを取り出し、文字列に変換して配列 blogId に格納 → blogIdを returnで返す、という一連の流れを個々のサーバーコンポーネントで実行できるようになった。  
```
export async function generateStaticParams() {
  const res = await fetch(`${process.env.url}/rest/v1/blogs?select=*`, {
    headers: new Headers({
      apikey: process.env.apikey as string,
    }),
  })
  const blogs: Blog[] = await res.json()

  return blogs.map((blog) => ({
    blogId: blog.id.toString(),
    // blogId: ダイナミックセグメントの値と紐づくプロパティ。ダイナミックセグメントの値は、文字列である必要があるため、blog.idを文字列に変換
  }))
}
```
上で return した blogId を元に、事前に blog個別ページが SSGで生成され、タイトルの 1つをクリックすると blog個別ページを表示する関数の引数に params として blogId が渡され、1つの blog個別ページが fetchされ、そのサーバーコンポーネント内の returnで HTMLとして表示していく。


## useRouter の router.push
useRouterは、クライアントコンポーネントのみで import可能。
router.push で遷移されたページは、Next.js13.4以前までは、毎回ハードナビゲーションが適用されていたが、13.4以降は初回のみハードナビゲーション、2回目以降はソフトナビゲーションが適用されてレンダリングされる。
※ ちなみに、ダイナミックセグメント([blogId]のようなファイルルーティング)でルーティングされたページは、URLの[blogId]部分が変更される度に毎回、ハードナビゲーションが適用されてレンダリングされる。