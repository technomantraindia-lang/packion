<?php
/**
 * Packion Systems - Inquiry Form Handler
 * Uses PHPMailer to send emails via SMTP
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Require PHPMailer files
// Make sure you have downloaded PHPMailer and placed it in the 'phpmailer' folder
require 'phpmailer/Exception.php';
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Get form data
    $name         = strip_tags(trim($_POST["fullName"]));
    $company      = strip_tags(trim($_POST["companyName"]));
    $phone        = strip_tags(trim($_POST["phoneNumber"]));
    $email        = filter_var(trim($_POST["emailAddress"]), FILTER_SANITIZE_EMAIL);
    $product_type = strip_tags(trim($_POST["reqType"]));
    $message      = strip_tags(trim($_POST["message"]));

    // Check required fields
    if (empty($name) || empty($email) || empty($phone)) {
        echo "Please fill in all required fields.";
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // --- SMTP SETTINGS (PLACEHOLDERS) ---
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com'; // Add SMTP Host here
        $mail->SMTPAuth   = true;
        $mail->Username   = 'vivekpatel2472003@gmail.com';                   // Add SMTP Email ID here
        $mail->Password   = 'lyxiohxgeariabih';                   // Add SMTP Password here
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; 
        $mail->Port       = 587;

        // --- EMAIL CONTENT ---
        $mail->setFrom('info@packion.co.in', 'Packion Website');
        $mail->addAddress('info@packion.co.in'); // Recipient email
        $mail->addReplyTo($email, $name);

        $mail->isHTML(true);
        $mail->Subject = "New Inquiry from " . $name;
        
        $email_body = "
        <div style='font-family: Arial, sans-serif; background-color: #f5f8fb; padding: 40px 20px; color: #102335;'>
            <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e1e8ed;'>
                
                <!-- Header -->
                <div style='background-color: #065a98; padding: 25px 30px; text-align: center;'>
                    <h1 style='color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;'>Packion Systems</h1>
                    <p style='color: #bfe8ff; margin: 5px 0 0; font-size: 14px;'>New Website Inquiry Received</p>
                </div>
                
                <!-- Body -->
                <div style='padding: 30px;'>
                    <p style='font-size: 16px; line-height: 1.5; margin-bottom: 25px;'>Hello Team,<br><br>You have received a new inquiry from the website contact form. Here are the details:</p>
                    
                    <table width='100%' cellpadding='0' cellspacing='0' style='border-collapse: collapse; margin-bottom: 25px;'>
                        <tr>
                            <td style='padding: 12px 15px; border-bottom: 1px solid #eee; width: 35%; color: #526474; font-weight: bold;'>Name</td>
                            <td style='padding: 12px 15px; border-bottom: 1px solid #eee; font-weight: 600;'>{$name}</td>
                        </tr>
                        <tr>
                            <td style='padding: 12px 15px; border-bottom: 1px solid #eee; color: #526474; font-weight: bold;'>Company</td>
                            <td style='padding: 12px 15px; border-bottom: 1px solid #eee; font-weight: 600;'>{$company}</td>
                        </tr>
                        <tr>
                            <td style='padding: 12px 15px; border-bottom: 1px solid #eee; color: #526474; font-weight: bold;'>Email Address</td>
                            <td style='padding: 12px 15px; border-bottom: 1px solid #eee; font-weight: 600;'><a href='mailto:{$email}' style='color: #065a98; text-decoration: none;'>{$email}</a></td>
                        </tr>
                        <tr>
                            <td style='padding: 12px 15px; border-bottom: 1px solid #eee; color: #526474; font-weight: bold;'>Phone Number</td>
                            <td style='padding: 12px 15px; border-bottom: 1px solid #eee; font-weight: 600;'><a href='tel:{$phone}' style='color: #065a98; text-decoration: none;'>{$phone}</a></td>
                        </tr>
                        <tr>
                            <td style='padding: 12px 15px; border-bottom: 1px solid #eee; color: #526474; font-weight: bold;'>Requirement</td>
                            <td style='padding: 12px 15px; border-bottom: 1px solid #eee; font-weight: 600;'>{$product_type}</td>
                        </tr>
                    </table>

                    <div style='background-color: #f9fbfd; border-left: 4px solid #6abbe2; padding: 20px; border-radius: 4px;'>
                        <h4 style='margin: 0 0 10px 0; color: #065a98; font-size: 15px;'>Message Details:</h4>
                        <p style='margin: 0; font-size: 15px; line-height: 1.6; color: #333; white-space: pre-wrap;'>{$message}</p>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style='background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e1e8ed;'>
                    <p style='margin: 0; font-size: 12px; color: #7393ae;'>This email was generated automatically from the Packion Systems website contact form.</p>
                </div>
            </div>
        </div>
        ";

        $mail->Body = $email_body;

        $mail->send();
        
        // Redirect on success
        header("Location: contact.html?status=success");
        exit;

    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }

} else {
    // Not a POST request
    header("Location: contact.html");
    exit;
}
?>
