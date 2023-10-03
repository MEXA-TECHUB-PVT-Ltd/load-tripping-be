
CREATE SEQUENCE IF NOT EXISTS my_sequence START 100000;



CREATE TABLE IF NOT EXISTS users(
  user_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  uniq_id TEXT,
  user_name TEXT,
  otp TEXT,
  verifyStatus TEXT,
  otpExpires TEXT,
  type TEXT,
  email  TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
 
);
CREATE TABLE IF NOT EXISTS messages(
  message_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  from_user TEXT,
  to_user TEXT,
  sender TEXT,
  message TEXT,
  type TEXT,
  readStatus TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
 
);
-- Check if a user with type 'admin' exists
SELECT COUNT(*) FROM users WHERE type = 'admin';

-- If no user with type 'admin' exists, insert a new user
INSERT INTO users (user_id, type, user_name, email,uniq_id)
SELECT nextval('my_sequence'), 'admin', 'Admin', 'admin@gmail.com','admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE type = 'admin');
