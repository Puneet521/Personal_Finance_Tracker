-- Users table --
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Categories table --
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Transactions table --
CREATE TABLE IF NOT EXISTS public.transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES public.users(id),
    amount NUMERIC NOT NULL,
    type VARCHAR(20) NOT NULL,
    category_id INT REFERENCES public.categories(id),
    created_at TIMESTAMP DEFAULT NOW()
);
