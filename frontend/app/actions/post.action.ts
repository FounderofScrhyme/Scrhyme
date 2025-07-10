"use server";

import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createPost(
  title: string,
  lyrics?: string,
  audioData?: string,
  beatId?: string
) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: "User not authenticated" };
    }

    // ユーザーのIDを取得
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_user_id", clerkUser.id)
      .single();

    if (userError || !user) {
      return { success: false, error: "User not found" };
    }

    // 投稿を作成
    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        title: title.trim(),
        lyrics: lyrics?.trim() || null,
        song_url: audioData || null, // Base64音声データを保存
        beat_id: beatId || null,
      })
      .select()
      .single();

    if (postError) {
      console.error("Error creating post:", postError);
      return { success: false, error: "Failed to create post" };
    }

    return { success: true, data: post };
  } catch (error) {
    console.error("Error in createPost:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function getPosts() {
  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        users (
          id,
          username,
          avatar_url
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      return { success: false, error: "Failed to fetch posts" };
    }

    return { success: true, data: posts };
  } catch (error) {
    console.error("Error in getPosts:", error);
    return { success: false, error: "Internal server error" };
  }
}
