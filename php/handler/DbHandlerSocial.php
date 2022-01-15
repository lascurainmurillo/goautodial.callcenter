<?php

namespace creamy;

// dependencies
require_once(__DIR__.'/../CRMDefaults.php');
require_once(__DIR__.'/../PassHash.php');
require_once(__DIR__.'/../ImageHandler.php');
require_once(__DIR__.'/../RandomStringGenerator.php');
require_once(__DIR__.'/../LanguageHandler.php');
require_once(__DIR__.'/../APIHandler.php');
require_once(__DIR__.'/../DatabaseConnectorFactory.php');
require_once(__DIR__.'/../goCRMAPISettings.php');



class DbHandlerSocial {

    /** Database connector */
    private $dbConnector;
	private $dbConnectorAsterisk;
	/** Language handler */
	private $lh;
	private $api;
        
	/** Creation and class lifetime management */
    
    function __construct($dbConnectorType = CRM_DB_CONNECTOR_TYPE_MYSQL) {
		// Database connector
		$this->dbConnector = \creamy\DatabaseConnectorFactory::getInstance()->getDatabaseConnectorOfType($dbConnectorType);
		$this->dbConnectorAsterisk = \creamy\DatabaseConnectorFactory::getInstance()->getDatabaseConnectorOfTypeAsterisk($dbConnectorType);

		// language handler
		$locale = $this->getLocaleSetting();
		$this->lh = \creamy\LanguageHandler::getInstance($locale, $dbConnectorType);

		// api handler
		$this->api = \creamy\APIHandler::getInstance();
    
    }
    
    function __destruct() {
	    if (isset($this->dbConnector)) { unset($this->dbConnector); }
	    if (isset($this->dbConnectorAsterisk)) { unset($this->dbConnectorAsterisk); }
	    if (isset($this->api)) { unset($this->api); }
    }

	public function getLocaleSetting() { return $this->getSettingValueForKey(CRM_SETTING_LOCALE); }

	/** Returns the value for a setting with a given key */
	public function getSettingValueForKey($key, $context = CRM_SETTING_CONTEXT_CREAMY) {
		$this->dbConnector->where("setting", $key);
		$this->dbConnector->where("context", $context);
		if ($result = $this->dbConnector->getOne(CRM_SETTINGS_TABLE_NAME)) {
			return $result["value"];
		}else{
			if ($result = $this->dbConnectorAsterisk->getOne(CRM_SETTINGS_TABLE_NAME)) {
				return $result["value"];
			}else return NULL;	
		}
	}


    /* Social Network */	
	/**
	 * Obtener el registro de un token habilitado. field. status=1
	 *
	 * @return void
	 */
	public function getTokenUser() 
    {
		$this->dbConnector->where("status", 1);
		$result = $this->dbConnector->getOne(CRM_SOCIAL_TOKEN, "token,user_id,expiration_time");
		return $result;
	}

    public function getFanPagesNoToken() 
    {
        // $this->dbConnector->where("status", 1);
		$result = $this->dbConnector->get(CRM_SOCIAL_PAGE, null, "id,name,page_id,status");
		return $result;
    }


}