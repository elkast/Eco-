-- Database setup for ECO+HOLDING contact system
-- Run this SQL script to create the necessary database and table

CREATE DATABASE IF NOT EXISTS ecoholding_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ecoholding_db;

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    client_type ENUM('particulier', 'entreprise', 'investisseur') NOT NULL,
    service_requested VARCHAR(100) NOT NULL,
    location VARCHAR(255) DEFAULT NULL,
    message TEXT DEFAULT NULL,
    status ENUM('nouveau', 'en_cours', 'traite', 'ferme') DEFAULT 'nouveau',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_service (service_requested)
);

-- Services table for reference
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_code VARCHAR(50) UNIQUE NOT NULL,
    service_name VARCHAR(200) NOT NULL,
    category ENUM('eco-holding', 'eco-immobilier', 'eco-trans') NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default services
INSERT INTO services (service_code, service_name, category, description) VALUES
('comptabilite', 'Comptabilité & Fiscalité', 'eco-holding', 'Services comptables et fiscaux complets'),
('creation', 'Création d\'entreprise', 'eco-holding', 'Accompagnement création d\'entreprise'),
('recouvrement', 'Recouvrement de créances', 'eco-holding', 'Recouvrement amiable et contentieux'),
('conseil', 'Conseil en gestion', 'eco-holding', 'Conseil stratégique et opérationnel'),
('financement', 'Recherche de financement', 'eco-holding', 'Aide à la recherche de financements'),
('immobilier-gestion', 'Gestion immobilière', 'eco-immobilier', 'Gestion locative et administrative'),
('immobilier-vente', 'Transaction immobilière', 'eco-immobilier', 'Vente et achat de biens immobiliers'),
('immobilier-conseil', 'Conseil en investissement', 'eco-immobilier', 'Conseil en investissement immobilier'),
('vtc', 'Services VTC', 'eco-trans', 'Transport VTC premium'),
('logistique', 'Transport & Logistique', 'eco-trans', 'Solutions transport et logistique'),
('flotte', 'Gestion de flotte', 'eco-trans', 'Gestion et maintenance de véhicules'),
('vente-auto', 'Vente de véhicules', 'eco-trans', 'Vente de véhicules neufs et d\'occasion');

-- Create admin user table (optional, for backend management)
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'operator') DEFAULT 'operator',
    active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: 'admin123' - change in production!)
INSERT INTO admin_users (username, email, password_hash, role) VALUES
('admin', 'ecoholding192@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Contact notes table (for follow-up)
CREATE TABLE IF NOT EXISTS contact_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contact_id INT NOT NULL,
    admin_user_id INT NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_user_id) REFERENCES admin_users(id)
);

-- Statistics view for dashboard
CREATE VIEW contact_stats AS
SELECT 
    COUNT(*) as total_contacts,
    COUNT(CASE WHEN status = 'nouveau' THEN 1 END) as nouveaux,
    COUNT(CASE WHEN status = 'en_cours' THEN 1 END) as en_cours,
    COUNT(CASE WHEN status = 'traite' THEN 1 END) as traites,
    COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as aujourd_hui,
    COUNT(CASE WHEN WEEK(created_at) = WEEK(CURDATE()) THEN 1 END) as cette_semaine,
    COUNT(CASE WHEN MONTH(created_at) = MONTH(CURDATE()) THEN 1 END) as ce_mois
FROM contacts;

-- Grant necessary permissions (adjust username as needed)
-- GRANT SELECT, INSERT, UPDATE ON ecoholding_db.* TO 'web_user'@'localhost';
-- FLUSH PRIVILEGES;

