<?php

$_GET['goAction'] = 'SocialCrud';
include_once ("goAPI.php");


$token 				= $astDB->escape($_REQUEST["token"]);
$expiration_time 	= $astDB->escape($_REQUEST["expiration_time"]);
$user_id 			= $astDB->escape($_REQUEST["user_id"]);

// Error Checking
/*
if (empty($goUser) || is_null($goUser)) {
	$apiresults 									= array(
		"result" 										=> "Error: goAPI User Not Defined."
	);
} elseif (empty($goPass) || is_null($goPass)) {
	$apiresults 									= array(
		"result" 										=> "Error: goAPI Password Not Defined."
	);
} elseif (empty($log_user) || is_null($log_user)) {
	$apiresults 									= array(
		"result" 										=> "Error: Session User Not Defined."
	);
} else*/if ( empty($token) || is_null($token) ) {
	$apiresults 									= array(
		"result" 										=> "Error: No se obtuvo token."
	);
} elseif ( empty($expiration_time) || is_null($expiration_time) || !is_numeric($expiration_time) ) {
	$apiresults 									= array(
		"result" 										=> "Error: La expiration time no se obtuvo o el valor no es permitido"
	);
} elseif ( empty($user_id) || is_null($user_id) || !is_numeric($user_id) ) {
	$apiresults 									= array(
		"result" 										=> "Error: La user_id no se obtuvo o el valor no es permitido"
	);
} else {
	
	// cambiar todos los registros a status 0
	$goDB->udpate("go_social_token", ['status' => 0]);

	$data_script 							= array(
		"token" 							=> $token, 
		"user_id" 							=> $user_id, 
		"expiration_time" 					=> $expiration_time, 
		"date_add" 							=> date('Y-m-d H:i:s'), 
	);

	// único registro activo
	$goDB->insert("go_social_token", $data_script);

}
var_dump($apiresults); exit;
// echo "ddssds"; exit;
// var_dump($_SESSION); exit;
//check access

// check required fields
/*
$validated = 1;
if (!isset($_POST["token"])) {
	$validated = 0;
}
if (!isset($_POST["expiration_time"])) {
	$validated = 0;
}
if (!isset($_POST["user_id"])) {
	$validated = 0;
}
*/

?>