<?php

// Make sure all the required variables are set, if not then exit
if (!isset($_REQUEST['username']) && !isset($_REQUEST['password']) && !isset($_REQUEST['email'])) {
	echo "usernameExists";
	exit;
}

include ('db_class.php'); // Include the database class

// Get the variables and set them
$username = $_REQUEST['username'];
$password = $_REQUEST['password'];
$email = $_REQUEST['email'];
if (isset($_REQUEST['phone'])) {
    $phone = $_REQUEST['phone'];
} else {
    $phone = "";
}

// MySQL sanitize
$username = stripslashes($username);
$password = stripslashes($password);
$email = stripslashes($email);
$phone = stripslashes($phone);

$username = mysql_real_escape_string($username);
$password = mysql_real_escape_string($password);
$email = mysql_real_escape_string($email);
$phone = mysql_real_escape_string($phone);

// Check to see if the username already exists
$sql_username_check = "SELECT username FROM users WHERE username= '$username' LIMIT 1";
$result_username_check = mysqli_query($conn, $sql_username_check);

if(mysqli_fetch_row($result_username_check)) {
	echo "usernameExists"; exit;
}

// Check to see if the email already exists
$sql_email_check = "SELECT email FROM users WHERE email= '$email' LIMIT 1";
$result_email_check = mysqli_query($conn, $sql_email_check);

if(mysqli_fetch_row($result_email_check)) {
	echo "emailExists"; exit;
}

// If the username and email are free begin to create the user
// Loop that interacts with the database to insert the user
$error_counter = 0;
do {
    $available = true;
    $user_id = generate_HexCode();

    $sql_user_id_check = "SELECT user_id FROM users WHERE user_id= '$user_id' LIMIT 1";
    $result_user_id_check = mysqli_query($conn, $sql_user_id_check);

    //Check to see if the User ID Already Exists
    if(mysqli_fetch_row($result_user_id_check)){
            $available = false;
            $error_counter++;
        }else{
            $available = true;
            $sql_create_user = "INSERT INTO users (user_id, username, password, email, phone, date_created) VALUES ('$user_id', '$username', '$password', '$email', '$phone', NOW())";
            if(mysqli_query($conn, $sql_create_user)) {
                echo "success"; exit();
            }
            // Close the connection down here somewhere
        }
    if($error_counter == 100){
        echo "Problem with connection, please try again.";
    }
}while($available == false && $error_counter < 100);

//Function to generate Hex Code
function generate_HexCode() {
    //Length of Hex Code
    $hexIDLength = 12;
    //Characters to use in Hex Code
    $hexOptions = 'ABCDEF1234567890';
    $hexID = '';
    //Assigns the
    $optionsLength = (strlen($hexOptions) - 1);
    //Loops through and randomly creates a hex string
    for ($i = 0; $i < $hexIDLength; $i++) {
        $n = mt_rand(0, $optionsLength);
        $hexID = $hexID . $hexOptions[$n];
    }
    return $hexID;
}

?>
