"use server";

import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function syncUserToSupabase() {
  const clerkUser = await currentUser();
  if (!clerkUser) return;

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_user_id", clerkUser.id)
    .maybeSingle();

  if (!existing) {
    await supabase.from("users").insert({
      clerk_user_id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      username: clerkUser.username ?? clerkUser.id,
      avatar_url: clerkUser.imageUrl,
    });
  }
}

export async function getUserByClerkId(clerkUserId: string) {
  try {
    // ユーザー基本情報を取得
    const { data: user, error: userError } = await supabase
      .from("users")
      .select(
        `
        id,
        clerk_user_id,
        username,
        email,
        bio,
        avatar_url,
        created_at,
        updated_at
      `
      )
      .eq("clerk_user_id", clerkUserId)
      .single();

    if (userError) {
      console.error("Error fetching user:", userError);
      return null;
    }

    if (!user) {
      return null;
    }

    // フォロワー数とフォロー数を並行して取得
    const [followersResult, followingResult] = await Promise.all([
      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", user.id),
      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", user.id),
    ]);

    const followersCount = followersResult.count || 0;
    const followingCount = followingResult.count || 0;

    if (followersResult.error) {
      console.error("Error fetching followers count:", followersResult.error);
    }

    if (followingResult.error) {
      console.error("Error fetching following count:", followingResult.error);
    }

    return {
      ...user,
      followers_count: followersCount,
      following_count: followingCount,
    };
  } catch (error) {
    console.error("Error in getUserByClerkId:", error);
    return null;
  }
}
