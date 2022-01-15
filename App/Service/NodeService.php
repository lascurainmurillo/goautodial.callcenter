<?php

namespace App\Service;

class NodeService {


    public function login() {

    }


    public function verifytoken() {

        $url = DOMAIN_SOCKET . "/user/verifytoken";
        // $data = array("username" => "locke", "key" => "12345");
        // $post_data  = json_encode($data);  // 
        
        // post data
        $ch = curl_init(); 
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        // curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data); 
        $output = curl_exec($ch);
        curl_close($ch); 
        
        //Print the packet returned by node.js
        $json_data = json_decode($output,true); 
        var_dump($json_data);

    }

}