-- Insert a default admin user (update email as needed)
INSERT INTO users (email, full_name, is_admin)
VALUES ('admin@example.com', 'Admin User', TRUE)
ON CONFLICT (email) DO NOTHING;
