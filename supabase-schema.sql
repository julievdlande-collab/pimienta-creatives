-- ============================================
-- Pimienta Creatives — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Credits balance per user
create table credits (
  user_id uuid references auth.users on delete cascade primary key,
  balance int not null default 5,
  updated_at timestamptz default now()
);

-- 2. Credit transaction log
create table credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  amount int not null,
  reason text not null,
  mollie_payment_id text,
  discount_code text,
  created_at timestamptz default now()
);

-- 3. Discount codes
create table discount_codes (
  code text primary key,
  discount_percent int not null default 100,
  credits_to_grant int not null default 25,
  max_uses int,
  current_uses int not null default 0,
  active boolean not null default true,
  created_at timestamptz default now()
);

-- 4. Atomic deduct function (prevents race conditions)
create or replace function deduct_credit(p_user_id uuid)
returns boolean as $$
declare
  new_balance int;
begin
  update credits
  set balance = balance - 1, updated_at = now()
  where user_id = p_user_id and balance > 0
  returning balance into new_balance;

  if not found then
    return false;
  end if;

  insert into credit_transactions (user_id, amount, reason)
  values (p_user_id, -1, 'generation');

  return true;
end;
$$ language plpgsql security definer;

-- 5. Atomic add credits function
create or replace function add_credits(p_user_id uuid, p_amount int)
returns void as $$
begin
  insert into credits (user_id, balance)
  values (p_user_id, 5 + p_amount)
  on conflict (user_id) do update
  set balance = credits.balance + p_amount, updated_at = now();
end;
$$ language plpgsql security definer;

-- 6. Auto-create credits row on new user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into credits (user_id, balance)
  values (new.id, 5)
  on conflict (user_id) do nothing;

  insert into credit_transactions (user_id, amount, reason)
  values (new.id, 5, 'signup_bonus');

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- 7. RLS policies
alter table credits enable row level security;
alter table credit_transactions enable row level security;
alter table discount_codes enable row level security;

-- Users can read their own credits
create policy "Users can view own credits"
  on credits for select using (auth.uid() = user_id);

-- Users can read their own transactions
create policy "Users can view own transactions"
  on credit_transactions for select using (auth.uid() = user_id);

-- Anyone can read active discount codes (to validate)
create policy "Anyone can read active discount codes"
  on discount_codes for select using (active = true);

-- 8. Seed BETA100 discount code
insert into discount_codes (code, discount_percent, credits_to_grant, max_uses)
values ('BETA100', 100, 25, 100);
