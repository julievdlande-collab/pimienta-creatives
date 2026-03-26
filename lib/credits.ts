import { createServiceSupabase } from "./supabase";

function getDb() {
  return createServiceSupabase();
}

export async function getBalance(userId: string): Promise<number> {
  const { data } = await getDb()
    .from("credits")
    .select("balance")
    .eq("user_id", userId)
    .single();

  return data?.balance ?? 0;
}

export async function ensureCreditsRow(userId: string): Promise<void> {
  // Upsert: create with 5 free credits if not exists
  await getDb().from("credits").upsert(
    { user_id: userId, balance: 5 },
    { onConflict: "user_id", ignoreDuplicates: true }
  );
}

export async function deductCredit(userId: string): Promise<boolean> {
  // Atomic deduct: only if balance > 0
  const { data, error } = await getDb().rpc("deduct_credit", {
    p_user_id: userId,
  });

  if (error) {
    console.error("Deduct credit error:", error);
    return false;
  }

  return data === true;
}

export async function addCredits(
  userId: string,
  amount: number,
  reason: string,
  opts?: { molliePaymentId?: string; discountCode?: string }
): Promise<boolean> {
  // Add credits + log transaction
  const { error: updateErr } = await getDb().rpc("add_credits", {
    p_user_id: userId,
    p_amount: amount,
  });

  if (updateErr) {
    console.error("Add credits error:", updateErr);
    return false;
  }

  // Log transaction
  await getDb().from("credit_transactions").insert({
    user_id: userId,
    amount,
    reason,
    mollie_payment_id: opts?.molliePaymentId ?? null,
    discount_code: opts?.discountCode ?? null,
  });

  return true;
}
