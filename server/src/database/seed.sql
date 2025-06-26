-- Sample data for testing
-- Password for test@example.com is 'test123'

-- Insert sample user
INSERT IGNORE INTO users (id, email, password, name) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'test@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test User');

-- Insert sample contacts
INSERT IGNORE INTO contacts (id, user_id, name, email, phone, address, notes) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'John Doe', 'john@example.com', '+1234567890', '123 Main St, City, State', 'Work contact'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Jane Smith', 'jane@example.com', '+0987654321', '456 Oak Ave, Town, State', 'Personal friend'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Bob Johnson', 'bob@example.com', '+1122334455', '789 Pine Rd, Village, State', 'Business partner'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Alice Brown', 'alice@example.com', '+1555666777', '321 Elm St, Borough, State', 'College friend'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Charlie Wilson', 'charlie@example.com', '+1888999000', '654 Maple Dr, District, State', 'Neighbor'); 