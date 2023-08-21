import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"; // クライアントコンポーネント専用の supabaseインスタンスを生成するモジュール
import { Database } from "@/database.types";

// auth.tsx(クライアントコンポーネント) で使用する supabaseのインスタンスを作成して exportしておく
export default createBrowserSupabaseClient<Database>()
