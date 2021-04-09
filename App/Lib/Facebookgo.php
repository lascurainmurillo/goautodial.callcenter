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

    public static function subscribedApps($access_token, $page_id, $method = 'POST', $sub_fields = 'leadgen') 
    {
        new Facebookgo();
        try {
            // Returns a `Facebook\FacebookResponse` object
            if($method == 'POST') {
                $response = self::$fb->post(
                    '/'.$page_id.'/subscribed_apps',
                    array (
                    'subscribed_fields' => $sub_fields,
                    ),
                    $access_token
                );
            } else if ($method == "DELETE") {
                $response = self::$fb->delete(
                    '/'.$page_id.'/subscribed_apps',
                    array (
                    'subscribed_fields' => $sub_fields,
                    ),
                    $access_token
                );
            }
        
        } catch( \Facebook\Exceptions\FacebookResponseException $e) {
            echo 'Graph returned an error: ' . $e->getMessage();
            exit;
        } catch( \Facebook\Exceptions\FacebookSDKException $e) {
            echo 'Facebook SDK returned an error: ' . $e->getMessage();
            exit;
        }
        
        // $graphEdge = $response->getGraphEdge();
        $graphNode = $response->getGraphNode();
        return $graphNode;
    }



    public static function extendTokenUser($short_access_token) {
        
        new Facebookgo();
        try {
            $response = self::$fb->getOAuth2Client()->getLongLivedAccessToken($short_access_token);
            /*
            $response = self::$fb->get(
                '/oauth/access_token',
                array (
                'grant_type' => 'fb_exchange_token',
                // 'fb_exchange_token' => 
                ),
                $short_access_token
            );
            */
       
        } catch( \Facebook\Exceptions\FacebookResponseException $e) {
            echo 'Graph returned an error: ' . $e->getMessage();
            exit;
        } catch( \Facebook\Exceptions\FacebookSDKException $e) {
            echo 'Facebook SDK returned an error: ' . $e->getMessage();
            exit;
        }
        

        if(@$response->getExpiresAt()){
            $expiration_time = @$response->getExpiresAt()->getTimestamp();
        } else {
            $expiration_time = "";
        }

        $return = [
            "access_token" => $response->getValue(),
            "expiration_time" => $expiration_time,
        ];

        return $return;
    }


    public static function verifyTokenUser($input_token, $access_token) {

        new Facebookgo();
        try {
            // Returns a `Facebook\FacebookResponse` object
            $response = self::$fb->get(
              '/debug_token?input_token=' . $input_token,
              $access_token
            );
        } catch(\Facebook\Exceptions\FacebookResponseException $e) {
            echo 'Graph returned an error: ' . $e->getMessage();
            exit;
        } catch(\Facebook\Exceptions\FacebookSDKException $e) {
            echo 'Facebook SDK returned an error: ' . $e->getMessage();
            exit;
        }

        $graphNode = $response->getGraphNode();;
        return $graphNode;
    }

}