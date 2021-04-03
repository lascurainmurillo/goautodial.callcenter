<?php
require __DIR__ . '/../../vendor/autoload.php';
use App\Lib\Phpjwt;

$_GET['goAction'] = 'SocialLogout';
include_once ("goAPI.php");


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
} elseif ( empty($token) || is_null($token) ) {
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
} else {*/
	
	// cambiar todos los registros a status 0
	try {
		//code...
		$goDB->where('status', 1);

		// actualizar estado
		$updateScript = $goDB->update("go_social_token", ['status' => 0, 'date_del' => date('Y-m-d H:i:s')]);

		if (!$updateScript) {
			$apiresults 						= array(
				"result" 							=> "Error: Add failed, check your details"
			);
		} else {
			$log_id 							= log_action($goDB, "ADD", /*$log_user*/'mark', /*$log_ip*/'124.241.241.212', "Update New token: State", @$log_group, $goDB->getLastQuery());
			$apiresults 						= array(
				"result" 							=> "success"
			);
		}
		
	} catch (Exception $e) {
		$err = $e->getMessage();
		$err_msg 									= error_handle("10001");
		$apiresults 								= array(
			"code" 										=> "10001", 
			"result" 									=> $err_msg." - ".$err,
			);	
	}
	


//}
?>