<?php

namespace App\Lib;

use Firebase\JWT\JWT;

class Phpjwt 
{

    private static $key = "";
    private static $payload = [];
    private static $aud = null;
    
    /**
     * __construct
     *  constantes de inicio
     * 
     */
    public function __construct()
    {
        
        $time = time();
        self::$key = "rf3tGss2shjh4mdjlsjsmMMfDAFej350L3";
        self::$payload = [
            // "iss" => self::Aud(),
            "aud" => self::Aud(),
            "iat" => $time, // Tiempo que inició el token
            "exp" => $time + (3 * 24 * 60 * 60) // Tiempo que expirará el token (+1 hora)
        ];
    
    }
    
    /**
     * getToken
     * Obtener token 
     *
     * @return String
     */
    public static function getToken()
    {
        new Phpjwt();
        $jwt = JWT::encode(self::$payload, self::$key);
        return $jwt;
       
    }
    
    /**
     * verifyToken
     * Verificar token devuelto
     *
     * @param String $token
     * @return Array[success, error]
     */
    public static function verifyToken($token) {

        try {
            
            //verificar si el token existe
            if(empty($token))
            {
                throw new \Exception("Invalid token supplied.");
            }

            //verificar si es un token borrado. Token borrados en la base de datos.
            // code ... ... ...

            // decodificar token
            JWT::$leeway = 60; // $leeway in seconds
            $decode = self::decodet($token, array('HS256'));

            // verificar procedencia
            if($decode->aud !== self::Aud())
            {
                throw new \Exception("Invalid user logged in.");
            }

        } catch (\Exception $e) {
            return ["success" => false, "error" => $e->getMessage()];
        }

        return [
                "success" => $decode,
                "error" => false,
            ];

    }
    
    /**
     * deleteToken
     * Borrar token de acceso. Los token borrado se deben registrar en bd
     * 
     *
     * @param  String $token
     * @return String / boolean
     */
    public static function deleteToken($token) {
        // OJO: se debe registrar los token borrados en una tabla Db

        /*
        if(!empty($token)){
            $deco = (array) self::decodet($token, array('HS256'));
            $deco['iat'] = time();   // se igualan los tiempos
            $deco['exp'] = time();   // se igualan los tiempos
            $enc = JWT::encode($deco, self::$key);
            return $enc;
        } else {
            return false;
        }
        */

    }

    
    /**
     * decode token
     *
     * @param  String $token
     * @param  Array $algo
     * @return Array
     */
    public static function decodet($token, $algo) {
        new Phpjwt();
        return JWT::decode($token, self::$key, $algo);
    }

    /*
    public static function GetData($token)
    {
        return JWT::decode(
            $token,
            self::$secret_key,
            self::$encrypt
        )->data;
    }
    */
    
    /**
     * Aud
     * Obtener domain de procedencia.
     *
     * @return String
     */
    private static function Aud()
    {
        $aud = '';

        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $aud = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $aud = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $aud = $_SERVER['REMOTE_ADDR'];
        }

        $aud .= @$_SERVER['HTTP_USER_AGENT'];
        $aud .= gethostname();

        return sha1($aud);
    }

}