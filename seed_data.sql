-- IMPORTANT: Replace 'YOUR_USER_ID' with your actual Supabase User ID.
-- You can find this in the 'Authentication' tab under 'Users' in your Supabase dashboard.

DO $$
DECLARE
    user_uuid UUID := 'e81a4b88-eca6-4ef2-96ba-a25d9a49611a'; -- REPLACE THIS WITH YOUR AUTH USER ID
    primary_wallet_id UUID;
    savings_wallet_id UUID;
    investment_wallet_id UUID;
BEGIN
    -- 1. Insert Wallets and Capture IDs
    INSERT INTO wallets (user_id, name, balance, color, icon, is_primary)
    VALUES (user_uuid, 'Primary Wallet', 4250.00, '#00D09C', 'wallet', true)
    RETURNING id INTO primary_wallet_id;

    INSERT INTO wallets (user_id, name, balance, color, icon, is_primary)
    VALUES (user_uuid, 'Savings Account', 12800.50, '#4D9AFF', 'card', false)
    RETURNING id INTO savings_wallet_id;

    INSERT INTO wallets (user_id, name, balance, color, icon, is_primary)
    VALUES (user_uuid, 'Investment', 2450.00, '#9C27B0', 'trending-up', false)
    RETURNING id INTO investment_wallet_id;

    -- 2. Insert Transactions linked to those wallets
    INSERT INTO transactions (user_id, wallet_id, title, category, amount, type, icon, date)
    VALUES 
    (user_uuid, primary_wallet_id, 'Starbucks Coffee', 'Food', 5.4, 'expense', 'cafe', '2026-03-14 09:45:00'),
    (user_uuid, primary_wallet_id, 'Uber Trip', 'Transport', 12.5, 'expense', 'car', '2026-03-13 20:20:00'),
    (user_uuid, savings_wallet_id, 'Rent Payment', 'Housing', 1700.0, 'expense', 'home', '2026-03-01 10:00:00'),
    (user_uuid, savings_wallet_id, 'Salary Deposit', 'Income', 4500.0, 'income', 'wallet', '2026-03-01 09:00:00'),
    (user_uuid, primary_wallet_id, 'Grocery Store', 'Food', 156.40, 'expense', 'basket', '2026-03-05 15:00:00'),
    (user_uuid, savings_wallet_id, 'Electricity Bill', 'Bills', 85.20, 'expense', 'flash', '2026-03-10 11:00:00'),
    (user_uuid, primary_wallet_id, 'Freelance Work', 'Income', 850.0, 'income', 'cash', '2026-03-15 14:00:00'),
    (user_uuid, savings_wallet_id, 'Gym Membership', 'Health', 50.0, 'expense', 'fitness', '2026-03-01 08:00:00'),
    (user_uuid, primary_wallet_id, 'New Shoes', 'Shopping', 120.0, 'expense', 'cart', '2026-02-20 16:00:00');

    RAISE NOTICE 'Seed completed successfully for user %', user_uuid;
END $$;
