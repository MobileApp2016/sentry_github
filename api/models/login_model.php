<?php

// Make sure all the required variables are set, if not then exit
if (!isset($_REQUEST['username']) && !isset($_REQUEST['password'])) {
	exit;
}

include('db_class.php');

// Get the variables and set them
$username = $_REQUEST['username'];
$password = $_REQUEST['password'];

// MySQL sanitize
$username = stripslashes($username);
$password = stripslashes($password);

$username = mysql_real_escape_string($username);
$password = mysql_real_escape_string($password);

// Check to see if the username already exists
$sql_username_check = "SELECT 1 FROM users WHERE username='$username' AND password='$password'";
$result_username_check = mysqli_query($conn, $sql_username_check);

if(mysqli_fetch_row($result_username_check)) {
	echo "correct"; exit;
} else {
	echo "wrong"; exit;
}


?>