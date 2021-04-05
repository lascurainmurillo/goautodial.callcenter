<?php

namespace App\Lib;

use Facebook\Facebook;

class Facebookgo
{

    private static $fb;
    
    /**
     * __construct
     *  constantes de inicio
     * 
     */
    public function __construct()
    {
        
        self::$fb = new Facebook([
            'app_id' => APP_ID_FACEBOOK,
            'app_secret' => APP_SECRET_FACEBOOK,
            'default_graph_version' => APP_VERSION_FACEBOOK,
            //'default_access_token' => '{access-token}', // optional
        ]);
    
    }
    
    
    public static function profileUser($access_token) 
    {
        new Facebookgo();
        try {
            // Get the \Facebook\GraphNodes\GraphUser object for the current user.
            // If you provided a 'default_access_token', the '{access-token}' is optional.
            $response = self::$fb->get('/me', $access_token);
        } catch(\Facebook\Exceptions\FacebookResponseException $e) {
            // When Graph returns an error
            echo 'Graph returned an error: ' . $e->getMessage();
            exit;
        } catch(\Facebook\Exceptions\FacebookSDKException $e) {
            // When validation fails or other local issues
            echo 'Facebook SDK returned an error: ' . $e->getMessage();
            exit;
        }
        
        $me = $response->getGraphUser();
    }

    public static function userAccounts($access_token, $user_face_id)
    {
        new Facebookgo();
        try {
            // Returns a `Facebook\FacebookResponse` object
            $response = self::$fb->get('/'.$user_face_id.'/accounts', $access_token);
        } catch(\Facebook\Exceptions\FacebookResponseException $e) {
            echo 'Graph returned an error: ' . $e->getMessage();
            exit;
        } catch(\Facebook\Exceptions\FacebookSDKException $e) {
            echo 'Facebook SDK returned an error: ' . $e->getMessage();
            exit;
        }
        
        $graphEdge = $response->getGraphEdge();
        return $graphEdge;
        /*
        foreach ($graphEdge as $key => $value) {
            var_dump($value["access_token"]);
        }
        exit;
        */
    }

}