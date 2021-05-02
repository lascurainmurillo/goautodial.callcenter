<?php
require __DIR__ . '/../../vendor/autoload.php';
/**
 * 
 * Cambiar el estado de vista de view status
 * Falta mejorar esto, debe ser por usuario
 * 
 */

use App\Lib\Phpjwt;

$_GET['goAction'] = 'SocialWebhookViewStatus';
include_once ("goAPI.php");


$tokenjwt 			= $astDB->escape(@$_REQUEST["utjo"]);
// Error Checking

if (empty($tokenjwt) || is_null($tokenjwt) || @!($result_jwt = Phpjwt::verifyToken($tokenjwt)['success'])) { //Phpjwt verificar token
	$apiresults 									= array(
		"result" 										=> "Error: El token no es válido."
	);
} else {

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
	


}
?>