<?php
// Database configuration
$host = 'localhost';
$dbname = 'ecoholding_db';
$username = 'your_db_username';
$password = 'your_db_password';

// Email configuration
$admin_email = 'ecoholding192@gmail.com';
$smtp_host = 'smtp.gmail.com';
$smtp_port = 587;
$smtp_username = 'ecoholding192@gmail.com';
$smtp_password = 'your_app_password';

// Set response headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['firstName', 'lastName', 'email', 'phone', 'clientType', 'service'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Le champ $field est requis"]);
        exit;
    }
}

// Sanitize input data
$firstName = htmlspecialchars(trim($input['firstName']));
$lastName = htmlspecialchars(trim($input['lastName']));
$email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars(trim($input['phone']));
$clientType = htmlspecialchars(trim($input['clientType']));
$service = htmlspecialchars(trim($input['service']));
$location = htmlspecialchars(trim($input['location'] ?? ''));
$message = htmlspecialchars(trim($input['message'] ?? ''));

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email invalide']);
    exit;
}

try {
    // Database connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Insert contact into database
    $stmt = $pdo->prepare("
        INSERT INTO contacts (
            first_name, last_name, email, phone, client_type, 
            service_requested, location, message, created_at
        ) VALUES (
            :firstName, :lastName, :email, :phone, :clientType,
            :service, :location, :message, NOW()
        )
    ");
    
    $stmt->execute([
        ':firstName' => $firstName,
        ':lastName' => $lastName,
        ':email' => $email,
        ':phone' => $phone,
        ':clientType' => $clientType,
        ':service' => $service,
        ':location' => $location,
        ':message' => $message
    ]);
    
    // Get the inserted ID
    $contactId = $pdo->lastInsertId();
    
    // Prepare email notification
    $subject = "Nouvelle demande de contact - ECO+HOLDING";
    $emailBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #0b3d91; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .info-block { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .label { font-weight: bold; color: #0b3d91; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h2>ECO+HOLDING - Nouvelle demande</h2>
        </div>
        <div class='content'>
            <p>Une nouvelle demande de contact a été reçue sur le site web.</p>
            
            <div class='info-block'>
                <p><span class='label'>Nom complet:</span> $firstName $lastName</p>
                <p><span class='label'>Email:</span> $email</p>
                <p><span class='label'>Téléphone:</span> $phone</p>
                <p><span class='label'>Type de client:</span> $clientType</p>
                <p><span class='label'>Service demandé:</span> $service</p>
                <p><span class='label'>Zone géographique:</span> " . ($location ?: 'Non spécifiée') . "</p>
            </div>
            
            " . ($message ? "<div class='info-block'><p><span class='label'>Message:</span></p><p>$message</p></div>" : "") . "
            
            <p><small>ID de contact: #$contactId | Date: " . date('d/m/Y H:i:s') . "</small></p>
        </div>
    </body>
    </html>
    ";
    
    // Send email notification using PHP's mail function
    // For production, consider using PHPMailer or similar library
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: noreply@ecoholding.ci',
        'Reply-To: ' . $email,
        'X-Mailer: PHP/' . phpversion()
    ];
    
    $mailSent = mail($admin_email, $subject, $emailBody, implode("\r\n", $headers));
    
    // Send auto-reply to client
    $clientSubject = "Merci pour votre demande - ECO+HOLDING";
    $clientBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #0b3d91; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h2>ECO+HOLDING</h2>
            <p>Cabinet d'affaires & d'intermédiations</p>
        </div>
        <div class='content'>
            <p>Bonjour $firstName $lastName,</p>
            
            <p>Nous avons bien reçu votre demande concernant nos services de <strong>$service</strong>.</p>
            
            <p>Notre équipe va étudier votre demande et vous recontacter dans les plus brefs délais (généralement sous 24h ouvrées).</p>
            
            <p>En attendant, n'hésitez pas à nous contacter directement :</p>
            <ul>
                <li>📧 Email : ecoholding192@gmail.com</li>
                <li>📱 WhatsApp : +225 XX XX XX XX XX</li>
                <li>🕐 Horaires : Lun-Ven 08h00-18h00</li>
            </ul>
            
            <p>Merci de votre confiance !</p>
            
            <p><strong>L'équipe ECO+HOLDING</strong></p>
        </div>
    </body>
    </html>
    ";
    
    $clientHeaders = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ECO+HOLDING <ecoholding192@gmail.com>',
        'X-Mailer: PHP/' . phpversion()
    ];
    
    mail($email, $clientSubject, $clientBody, implode("\r\n", $clientHeaders));
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Votre demande a été envoyée avec succès!',
        'contact_id' => $contactId
    ]);
    
} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de base de données']);
    
} catch (Exception $e) {
    error_log('General error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Une erreur est survenue']);
}
?>

