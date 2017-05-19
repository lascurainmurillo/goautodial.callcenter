<?php
/*
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
*/
require_once('goCRMAPISettings.php');	

	$url 	= gourl."/goPhones/goAPI.php"; # URL to GoAutoDial API file
	$postfields["goUser"] 	= goUser; #Username goes here. (required)
	$postfields["goPass"] 	= goPass; #Password goes here. (required)
	$postfields["goAction"] 	= "goAddPhones"; #action performed by the [[API:Functions]]
	$postfields["responsetype"] 	= responsetype; #json. (required)
	
	if($_POST['add_phones'] !== "CUSTOM")
	$postfields["seats"]	= $_POST['add_phones'];
	else
	$postfields["seats"]	= $_POST['custom_seats'];
	
	$postfields["extension"] 	= $_POST['phone_ext']; #Deisred extension (required)
	$postfields["server_ip"] 	= $_POST['ip']; #Desired server_ip (required)
	$postfields["hostname"] 	= $_SERVER['REMOTE_ADDR']; #Default value
	$postfields["pass"] 	= $_POST['phone_pass']; #Desired password (required)
	$postfields["protocol"] 	= $_POST['protocol']; #SIP, Zap, IAX2, or EXTERNAL. (required)
	$postfields["dialplan_number"]	= "9999".$_POST['phone_ext']; #Desired dialplan number (required)
	$postfields["voicemail_id"] 	= $_POST['phone_ext']; #Desired voicemail (required)
	$postfields["status"] 	= "ACTIVE"; #ACTIVE, SUSPENDED, CLOSED, PENDING, or ADMIN (required)
	$postfields["active"] 	= "Y"; #Y or N (required)
	$postfields["fullname"] 	= $_POST['pfullname']; #Desired full name (required)
	$postfields["gmt"] 	= $_POST['gmt']; #Deisred extension (required)
	$postfields["messages"] 	= "0"; #Desire message (required)
	$postfields["old_messages"] 	= "0"; #Desired old message (required)
	$postfields["user_group"] 	= $_POST['user_group']; #Assign to user group (required)
	$postfields["session_user"]	= $_POST['log_user'];
 
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_TIMEOUT, 100);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $postfields);
	$data = curl_exec($ch);
	curl_close($ch);
	$output = json_decode($data);
	 
	//var_dump($data);
	
	if ($output->result=="success") {
		# Result was OK!
		$status = 1;
		//$return['msg'] = "New User has been successfully saved.";
	} else {
		# An error occured
		//$status = 0;
		// $return['msg'] = "Something went wrong please see input data on form.";
        $status = $output->result;
	}

	//var_dump($output->errors); 
	
	echo $status;

?>