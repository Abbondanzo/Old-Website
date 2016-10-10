<?php
if(isset($_POST["submit"])){
// Checking For Blank Fields..
if($_POST["vname"]==""||$_POST["vemail"]==""||$_POST["msg"]==""){
echo '<div class="success">Fill All Fields.</div>';
}else{
$name=$_POST["vname"];
// Check if the "Sender's Email" input field is filled out
$email=$_POST['vemail'];
// Sanitize E-mail Address
$email =filter_var($email, FILTER_SANITIZE_EMAIL);
// Validate E-mail Address
$email= filter_var($email, FILTER_VALIDATE_EMAIL);
if (!$email){
echo '<div class="success">Invalid Email</div>';
}
else{
$subject = "Contact Form from " . $name . " (IP: " . $_SERVER['REMOTE_ADDR'] . ")";
$message = $_POST['msg'];
$headers = 'From:'. $email . "\r\n"; // Sender's Email
$headers .= 'Cc:'. $email . "\r\n"; // Carbon copy to Sender
// Message lines should not exceed 70 characters (PHP rule), so wrap it
$message = wordwrap($message, 300);
// Send Mail By PHP Mail Function
mail("peter@abbondanzo.com", $subject, $message, $headers);
echo '<div class="success">Your mail has been sent successfully! We will be in touch soon</div>';
}
}
}