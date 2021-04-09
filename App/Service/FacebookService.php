<?php 

namespace App\Service;

class FacebookService 
{

    private $db;

    /**
     * Returns the singleton instance of UIHandler.
     * @staticvar UIHandler $instance The UIHandler instance of this class.
     * @return UIHandler The singleton instance.
     */
    public static function getInstance($db)
    {
        static $instance = null;
        if (null === $instance) {
            $instance = new static($db);
        }

        return $instance;
    }

    
    public function __construct($db) 
    {
        $this->db = $db;
    }

    public function regFanPage($fanpages, $user_id) {

        $autoCommit = (isset($this->db->_transaction_in_progress) ? !$this->db->_transaction_in_progress : true);
        try {

            if($autoCommit) {
                $this->db->startTransaction();
            }

            //code
            $id = $this->db->delete('go_social_page'); // se eleimina todos los registros
            $this->insertFanPage($fanpages, $user_id); // se insertar los nuevos

            if($autoCommit) {
                $this->db->commit();
            }
   
        } catch (\Exception $e) {
            if($autoCommit) {
                $this->db->rollback();
            }

            return ["success" => false, "error" => $e->getMessage()];
        }

        return ["success" => true];
    }
    

    public function insertFanPage($fanpages, $user_id)
    {

        $arr = [];
        if(count($fanpages) > 0 ) {
            foreach ($fanpages as $key => $value) {
                $ids = $this->db->insert("go_social_page", [
                                            "access_token"          => $value["access_token"],
                                            "name"                  => $value["name"],
                                            "page_id"               => $value["id"],
                                            "go_social_token_id"    => $user_id,
                                            "date_add"              => date('Y-m-d H:i:s')
                                        ]);
                                        // $this->db->commit();
            }
        }
    }

}