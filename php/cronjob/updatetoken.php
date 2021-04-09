<?php

require __DIR__ . '/../../vendor/autoload.php';

include_once ("../Config.php");
include_once ("../../goAPIv2/goDBgoautodial.php");

use App\Lib\Facebookgo;
use App\Service\FacebookService;


$goDB->where('status', 1);
$get_token_user = $goDB->getOne('go_social_token', 'id,user_id,token');

if(@$get_token_user['token']) {
    
    // obtener otro token extendido
    $new_longer_token = Facebookgo::extendTokenUser($get_token_user['token']);
    // actualizar token user
    $goDB->where('id', $get_token_user['id']);
	$upd = $goDB->update("go_social_token", ['token' => $new_longer_token['access_token'], 'date_upd' => date('Y-m-d H:i:s')]);

    $fanpages = Facebookgo::userAccounts($new_longer_token["access_token"], $get_token_user['user_id']);
	$resultmsm = FacebookService::getInstance($goDB)->regFanPage($fanpages, $get_token_user['id']);
    /*
    // depurar token
    $depura_token = Facebookgo::verifyTokenUser($response['token'], $response['token']);
    
    if($depura_token["is_valid"]) {
       echo "Ready ";
    } else {

    }
    */
} else {
    echo "Ops. ";
}

echo "Error 404"; exit;



?>