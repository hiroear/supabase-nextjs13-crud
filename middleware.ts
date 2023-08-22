import { NextResponse } from "next/server";        // NextResponse: Next.jsのレスポンス情報を取得する型
import type { NextRequest } from "next/server";    // NextRequest: Next.jsのリクエスト情報を取得する型
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs"; // ミドルウェアの中で supabaseのインスタンスを作成する関数

//
export async function middleware(req: NextRequest) {
  const res = NextResponse.next(); // NextResponse.next(): Next.jsのレスポンス情報を取得する関数
  const supabase = createMiddlewareSupabaseClient({ req, res }); // supabaseのインスタンスを作成

  // supabaseのインスタンスから、現在ログインしているユーザーの session情報をミドルウェアの中で取得してくる
  const { data: { session }} = await supabase.auth.getSession();

  // この sessionが存在しない、かつ、ユーザーが /auth/todo-crud にアクセスしようとしている場合は、 /auth(ログインページ) にリダイレクトする。
  if (!session && req.nextUrl.pathname.startsWith('/auth/todo-crud')) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/auth'
    return NextResponse.redirect(redirectUrl)
  }
  return res; // ミドルウェアの処理が終わったら、Next.jsのレスポンス情報を返す
}