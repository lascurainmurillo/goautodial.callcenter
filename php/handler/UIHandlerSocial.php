<?php

namespace creamy;

// dependencies
require_once(__DIR__.'/../CRMDefaults.php');
require_once(__DIR__.'/../LanguageHandler.php');
require_once(__DIR__.'/../CRMUtils.php');
// require_once(__DIR__.'/../ModuleHandler.php');
require_once(__DIR__.'/../goCRMAPISettings.php');
//require_once('Session.php');

// constants
define ('CRM_UI_DEFAULT_RESULT_MESSAGE_TAG', "resultmessage");
error_reporting(E_ERROR | E_PARSE);

/**
 *  UIHandler.
 *  This class is in charge of generating the dynamic HTML code for the basic functionality of the system.
 *  Every time a page view has to generate dynamic contact, it should do so by calling some of this class methods.
 *  UIHandler uses the Singleton pattern, thus gets instanciated by the UIHandler::getInstante().
 *  This class is supposed to work as a ViewController, stablishing the link between the view (PHP/HTML view pages) and the Controller (DbHandler).
 */
 class UIHandlerSocial {

	// language handler
	private $lh;
	// Database handler
	private $db;
	// API handler
	private $api;
	/** Creation and class lifetime management */

	/**
     * Returns the singleton instance of UIHandler.
     * @staticvar UIHandler $instance The UIHandler instance of this class.
     * @return UIHandler The singleton instance.
     */
    public static function getInstance()
    {
        static $instance = null;
        if (null === $instance) {
            $instance = new static();
        }

        return $instance;
    }


    /**
     * Protected constructor to prevent creating a new instance of the
     * *Singleton* via the `new` operator from outside of this class.
     */
    protected function __construct()
    {
        require_once dirname(__FILE__) . '/DbHandlerSocial.php';

        // opening db connection
        $this->db = new \creamy\DbHandlerSocial();
        $this->api = \creamy\APIHandler::getInstance();
        $this->lh = \creamy\LanguageHandler::getInstance();
    }

    /**
     * Private clone method to prevent cloning of the instance of the
     * *Singleton* instance.
     *
     * @return void
     */
    private function __clone()
    {
    }

    /**
     * Private unserialize method to prevent unserializing of the *Singleton*
     * instance.
     *
     * @return void
     */
    private function __wakeup()
    {
    }

    /** Query helpers */
		
	/**
	 * verifica si esta logueado en facebook
	 *
	 * @return void
	 */
	public function isloginface() {
		return $this->db->getTokenUser();
	}

    public function listPage() {
        return $this->db->getFanPagesNoToken();
    }
	
}

?>
