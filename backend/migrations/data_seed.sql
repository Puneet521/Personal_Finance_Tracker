-- SET search_path TO public; --
-- Insert users -- password generated using generate_hashes.js --

INSERT INTO users (username, password, role) VALUES
('admin', '$2b$10$3gcuSHZF.oZX743647MLhuXiJFDxFyJW6RS4kF.ZsygY6.ZF3P80e', 'admin'),
('user1', '$2b$10$KEt909gBDa8r59ywV/mLJ.K6SCJ/vqqmJq31fn4vs7I6XKA3L0AfO', 'user'),
('readonly1', '$2b$10$CNopvAV83Y7AMQsvurGtouuAlLBkL4yFH9YjAI.uT7xqgtjfdOUvG', 'read-only');

-- Insert categories -- 
INSERT INTO categories (name) VALUES
('Food'),
('Transport'),
('Entertainment'),
('Utilities'),
('Salary');
