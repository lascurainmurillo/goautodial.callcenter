<?php
require __DIR__ . '/../../vendor/autoload.php';
use App\Lib\Phpjwt;

$_GET['goAction'] = 'SocialWebhookViewStatus';
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
        
        // verificar token de acceso


		//code...
		$autoCommit = (isset($goDB->_transaction_in_progress) ? !$goDB->_transaction_in_progress : true);

		if($autoCommit) {
			$goDB->startTransaction();
		}
		
		// actualizar view_status
		$goDB->where('view_status', 0);
		$updateScript = $goDB->update("go_social_webhook_data", ['view_status' => 1]);

		if($autoCommit) {
			$goDB->commit();
		}

		if (!$updateScript) {
			$apiresults 						= array(
				"result" 							=> "Error: Add failed, check your details"
			);
			if($autoCommit) {
				$goDB->rollback();
			}
		} else {
			$log_id 							= log_action($goDB, "ADD", /*$log_user*/'mark', /*$log_ip*/'124.241.241.212', "Update New token: State", @$log_group, $goDB->getLastQuery());
			$apiresults 						= array(
				"result" 							=> "success"
			);
		}
		
	} catch (Exception $e) {
		if($autoCommit) {
			$goDB->rollback();
		}
		$err = $e->getMessage();
		$err_msg 									= error_handle("10001");
		$apiresults 								= array(
			"code" 										=> "10001", 
			"result" 									=> $err_msg." - ".$err,
			);	
	}
	


//}
?>