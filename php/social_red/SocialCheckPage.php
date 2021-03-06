<?php
require __DIR__ . '/../../vendor/autoload.php';
use App\Lib\Phpjwt;
use App\Lib\Facebookgo;
use App\Service\FacebookService;

$_GET['goAction'] = 'SocialCheckPage';
include_once ("goAPI.php");

$status 			= $astDB->escape(@$_REQUEST["status"]); //status de checkbox
$tokenjwt 			= $astDB->escape(@$_REQUEST["utjo"]);
$id 				= $astDB->escape(@$_REQUEST["id"]); // id de la tabla go_social_page

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
	); */
if (empty($id) || is_null(@$id) || !is_numeric($id)) { //Phpjwt verificar token
	$apiresults 									= array(
		"result" 										=> "Error: El id no es válido."
	);
} elseif (empty($tokenjwt) || is_null($tokenjwt) || @!($result_jwt = Phpjwt::verifyToken($tokenjwt)['success'])) { //Phpjwt verificar token
	$apiresults 									= array(
		"result" 										=> "Error: El token no es válido."
	);
} elseif ( /*empty($status) || */ is_null($status) || !is_numeric($status) ) {
	$apiresults 									= array(
		"result" 										=> "Error: El status no se obtuvo o el valor no es permitido"
	);
} else {

	// cambiar todos los registros a status 0
	try {
		
		// actualizar estado
		$goDB->where('id', $id);
		$updateScript = $goDB->update("go_social_page", ['status' => $status, 'date_upd' => date('Y-m-d H:i:s')]);
		
		// Si el status es 0 desubcribir de webhook, si status es 1 subcribir webhook
		$goDB->where('id', $id);
		$page = $goDB->getOne("go_social_page", 'page_id, access_token');
		if(count($page) > 0) {
			if($status == "1") {
				$resultmsm = Facebookgo::subscribedApps($page["access_token"], $page["page_id"]); // subcribir
			} else {
				$resultmsm = Facebookgo::subscribedApps($page["access_token"], $page["page_id"], "DELETE"); // dessubcribir
			}
		}

		if (!$updateScript || !@$resultmsm["success"]) {
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

}

?>