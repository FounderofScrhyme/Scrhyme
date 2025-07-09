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
