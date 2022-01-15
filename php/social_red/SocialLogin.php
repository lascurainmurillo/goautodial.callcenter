<?php
require __DIR__ . '/../../vendor/autoload.php';
/**
 * 
 * Login con facebook
 * 
 */

use App\Lib\Phpjwt;
use App\Lib\Facebookgo;
use App\Service\FacebookService;

$_GET['goAction'] = 'SocialLogin';
require_once ("goAPI.php");


$token 				= $astDB->escape(@$_REQUEST["token"]);
$expiration_time 	= $astDB->escape(@$_REQUEST["expiration_time"]);
$user_id 			= $astDB->escape(@$_REQUEST["user_id"]);
$tokenjwt 			= $astDB->escape(@$_REQUEST["utjo"]);

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
} else*/
if (empty($tokenjwt) || is_null($tokenjwt) || @!($result_jwt = Phpjwt::verifyToken($tokenjwt)['success'])) { //Phpjwt verificar token
	$apiresults 									= array(
		"result" 										=> "Error: El token no es válido."
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
} else {

	// require_once (__DIR__.'/../handler/UIHandlerSocial.php');
	try {

		// Ampliar el tiempo de caducidad del access_token user face
		$new_longer_token = Facebookgo::extendTokenUser($token);

		// eliminar el anterior usuario activado
		$upd = $goDB->update("go_social_token", ['status' => 0]);

		$data_script 							= array(
			"token" 							=> $new_longer_token["access_token"], 
			"user_id" 							=> $user_id, 
			"expiration_time" 					=> $new_longer_token["expiration_time"], 
			"date_add" 							=> date('Y-m-d H:i:s'), 
		);

		// único registro activo
		$insertScript = $goDB->insert("go_social_token", $data_script);

		// obtener lista de pages y registrar lista de pages en tabla con sus respectivos tokens
		$fanpages = Facebookgo::userAccounts($new_longer_token["access_token"], $user_id);
		$resultmsm = FacebookService::getInstance($goDB)->regFanPage($fanpages, $insertScript);

		if($resultmsm["success"]) { // si todo va bien...

			// subcribir fan pages
			foreach ($fanpages as $key => $val) {
				Facebookgo::subscribedApps($val["access_token"], $val["id"]);
			}

			if (!$insertScript || !$resultmsm["success"]) {
				$apiresults 		= array(
					"result" 		=> ((@$resultmsm["error"]) ? $resultmsm["error"] : "Error: Add failed, check your details")
				);
			} else {
				$log_id 		= log_action($goDB, "ADD", /*$log_user*/'mark', /*$log_ip*/'124.241.241.212', "Added New token: $token", $log_group, $goDB->getLastQuery());
	
				$apiresults 	= [
					"result" 	=> "success",
					"data" => $result_jwt,
				];
			}

		} else {
			throw new \Exception($resultmsm["error"]);
		}
		
	} catch (Exception $e) {
		$err = $e->getMessage();
		$err_msg 									= error_handle("10001");
		$apiresults 								= array(
			"code" 										=> "10001", 
			"result" 									=> $err_msg." - ".$err,
			);	
	}
}



?>