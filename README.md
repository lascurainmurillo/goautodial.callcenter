<h1>GOautodial Open Source Omni-channel Contact Center Suite</h1>

<h2>https://goautodial.org</h2>

GOautodial is the next generation open source omni-channel contact center suite. Built from the ground-up using established open source technologies.

<h3>Major Features:</h3>

Predictive, preview and manual dialing + inbound IVR and ACD<br>
Customer Relationship Manager (CRM)<br>
Ticketing system (under development)<br>
Instant messaging (under development)<br>
Social media (under development)<br>
REST APIs and plugin based system<br>
Reports and analytics<br>
Multi-language<br>

<h3>Technology and Core Components:</h3>

Asterisk<br>
Bootstrap3<br>
HTML5<br>
JSSIP<br>
Javascript<br>
JQuery<br>
Kamailio<br>
MariaDB<br>
NodeJS<br>
PHP7<br>
SocketIO<br>
Vicidial<br>
WebRTC<br>

<h3>Requirements:</h3>

Apache 2.4 (and up)<br>
PHP version 7.0 to 7.4 (recommended)<br>
MySQLi extension for PHP<br>
MySQL (version 5.5 and up) or MariaDB 10.0.1 (recommended)<br>

<h3>Recommendations:</h3>

PHP extensions: BCMath, FPM, GD, Gettext, IMAP, Intl, JSON, MBString, OPcache, PDO, Pear, XML and XMLRPC

<h3>Help, Installation and other HOWTOs:</h3>

Visit our open source community portal: https://goautodial.org. 

If you'd like to go cloud and/or get professional help, please visit: https://goautodial.com.

<h3>License:</h3>

GOautodial is released under the AGPLv2 license (https://www.gnu.org/licenses/agpl.html). 

<h3> Actualizaciones by Mark Cornejo </h3>
Ejecutar los siguientes script

use goautodial;

CREATE TABLE IF NOT EXISTS `call_goautodial`.`go_social_webhook_data` (
  `id` VARCHAR(45) NOT NULL COMMENT 'Id entregado por el webhook changes.  En este caso seria el id de \'leadgen_id\'. El id es segun el tipo (field type)',
  `type` VARCHAR(10) NOT NULL DEFAULT 'leadgen',
  `email` VARCHAR(45) NULL DEFAULT NULL,
  `full_name` VARCHAR(70) NULL DEFAULT NULL,
  `phone_number` VARCHAR(15) NULL DEFAULT NULL,
  `status` INT(1) NOT NULL DEFAULT '1',
  `created_time` VARCHAR(45) NOT NULL,
  `view_status` INT(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`, `type`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE TABLE IF NOT EXISTS `call_goautodial`.`go_social_token` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(20) NOT NULL,
  `token` VARCHAR(300) NOT NULL,
  `expiration_time` VARCHAR(15) NOT NULL DEFAULT '',
  `status` INT(1) UNSIGNED ZEROFILL NOT NULL DEFAULT '1' COMMENT 'status = 1, habilitado, status = 0 deshabilitado',
  `date_add` DATETIME NOT NULL,
  `date_upd` DATETIME NULL DEFAULT NULL,
  `date_del` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 124
DEFAULT CHARACTER SET = latin1
COMMENT = 'status => sólo un registro puede poseer valor 1, todos los demas deben ser 0';

CREATE TABLE IF NOT EXISTS `call_goautodial`.`go_social_page` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NULL DEFAULT NULL,
  `page_id` VARCHAR(30) NOT NULL,
  `access_token` VARCHAR(300) NOT NULL,
  `status` INT(1) NOT NULL DEFAULT '1',
  `date_add` DATETIME NOT NULL,
  `date_upd` DATETIME NULL DEFAULT NULL,
  `go_social_token_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_go_social_page_go_social_token_idx` (`go_social_token_id` ASC),
  CONSTRAINT `fk_go_social_page_go_social_token`
    FOREIGN KEY (`go_social_token_id`)
    REFERENCES `call_goautodial`.`go_social_token` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 236
DEFAULT CHARACTER SET = latin1
COMMENT = 'Registro de las fan page de un login/token';

CREATE TABLE IF NOT EXISTS `call_goautodial`.`go_social_webhook_page` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `go_social_token_id` INT(11) NOT NULL,
  `type` VARCHAR(15) NOT NULL DEFAULT 'page' COMMENT 'tipo de objeto',
  `object_id` VARCHAR(30) NOT NULL,
  `time` VARCHAR(15) NOT NULL,
  `status` INT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `fk_social_webhook_leadgen_go_social_token1_idx` (`go_social_token_id` ASC),
  CONSTRAINT `fk_social_webhook_leadgen_go_social_token1`
    FOREIGN KEY (`go_social_token_id`)
    REFERENCES `call_goautodial`.`go_social_token` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 52
DEFAULT CHARACTER SET = latin1
COMMENT = 'Registro de datos enviandos por webhoot de un objeto PAGE';

CREATE TABLE IF NOT EXISTS `call_goautodial`.`go_social_webhook_change` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `social_webhook_page_id` INT(11) NOT NULL,
  `field` VARCHAR(15) NOT NULL DEFAULT 'leadgen' COMMENT 'tipo de subcription facebook',
  `form_id` VARCHAR(45) NULL DEFAULT NULL,
  `leadgen_id` VARCHAR(45) NULL DEFAULT NULL,
  `created_time` VARCHAR(15) NOT NULL,
  `status` INT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `fk_social_webhook_change_social_webhook_page1_idx` (`social_webhook_page_id` ASC),
  CONSTRAINT `fk_social_webhook_change_social_webhook_page1`
    FOREIGN KEY (`social_webhook_page_id`)
    REFERENCES `call_goautodial`.`go_social_webhook_page` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 36
DEFAULT CHARACTER SET = latin1;

use asterisk;

CREATE TABLE IF NOT EXISTS `asterisk`.`field_package` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `lead_id` INT(9) NOT NULL,
  `hotel` VARCHAR(300) NULL,
  `days` VARCHAR(300) NULL,
  `destination` VARCHAR(300) NULL,
  `validity` VARCHAR(300) NULL,
  `status` INT(1) NULL DEFAULT 1 COMMENT '1 => activo\n0 => inactivo',
  `created_at` DATETIME NOT NULL DEFAULT NOW(),
  `updated_at` DATETIME NOT NULL DEFAULT NOW(),
  PRIMARY KEY (`id`))
ENGINE = InnoDB
COMMENT = 'Campos de formularios personalizados.\nCampo tipo SCRIPT\n\nfield_package => Listar los paquetes que el cliente eligió\n\n';

ALTER TABLE `vicidial_list` ADD COLUMN `phone_code_additional` VARCHAR(10) NULL DEFAULT NULL COMMENT 'Additional code for used in WhatsApp' COLLATE 'latin1_swedish_ci' AFTER `phone_code`;

ALTER TABLE `vicidial_list`
	ADD COLUMN `photo` VARCHAR(400) NULL DEFAULT NULL AFTER `entry_list_id`,
	ADD COLUMN `social_form_id` VARCHAR(30) NULL DEFAULT NULL COMMENT 'id del formulario de facebook' AFTER `photo`,
	ADD COLUMN `social_form_data` TEXT NULL DEFAULT NULL AFTER `social_form_id`,
	ADD COLUMN `social_form_image` TEXT NULL DEFAULT NULL AFTER `social_form_data`,
	ADD COLUMN `job_title` VARCHAR(80) NULL DEFAULT NULL AFTER `social_form_image`,
	ADD COLUMN `company_name` VARCHAR(80) NULL DEFAULT NULL AFTER `job_title`,
	ADD COLUMN `id_identity` VARCHAR(45) NULL DEFAULT NULL AFTER `company_name`,
	ADD COLUMN `marital_status` VARCHAR(45) NULL DEFAULT NULL AFTER `id_identity`,
	ADD COLUMN `relationship_status` VARCHAR(45) NULL DEFAULT NULL AFTER `marital_status`,
	ADD COLUMN `military_status` VARCHAR(45) NULL DEFAULT NULL AFTER `relationship_status`,
	ADD COLUMN `work_phone_number` VARCHAR(45) NULL DEFAULT NULL AFTER `military_status`,
	ADD COLUMN `work_email` VARCHAR(45) NULL DEFAULT NULL AFTER `work_phone_number`,
	ADD COLUMN `dataother` TEXT NULL DEFAULT NULL AFTER `work_email`,
	ADD COLUMN `country` VARCHAR(45) NULL DEFAULT NULL AFTER `dataother`;

ALTER TABLE `vicidial_phone_codes` ADD COLUMN `country_code_additional` SMALLINT(5) UNSIGNED NULL DEFAULT NULL COMMENT 'Additional code for used in WhatsApp' AFTER `tz_code`;

UPDATE `vicidial_phone_codes` SET country_code_additional = country_code;

UPDATE `vicidial_phone_codes` SET country_code_additional = '521' WHERE country_code = '52';

ALTER TABLE `vicidial_statuses`
	ADD COLUMN `color_background` VARCHAR(8) NULL DEFAULT '#000000' AFTER `answering_machine`,
	ADD COLUMN `color_text` VARCHAR(8) NULL DEFAULT '#ffffff' AFTER `color_background`;

UPDATE `asterisk`.`vicidial_statuses` SET `color_background`='#5DADE2' WHERE  `status`='CALLBK';
UPDATE `asterisk`.`vicidial_statuses` SET `color_background`='#CD6155' WHERE  `status`='A';
UPDATE `asterisk`.`vicidial_statuses` SET `color_background`='#AF7AC5' WHERE  `status`='B';
UPDATE `asterisk`.`vicidial_statuses` SET `color_background`='#48C9B0' WHERE  `status`='DC';
UPDATE `asterisk`.`vicidial_statuses` SET `color_background`='#F4D03F' WHERE  `status`='DEC';
UPDATE `asterisk`.`vicidial_statuses` SET `color_background`='#EB984E' WHERE  `status`='DNC';
UPDATE `asterisk`.`vicidial_statuses` SET `color_background`='#1D8348' WHERE  `status`='SALE';
UPDATE `asterisk`.`vicidial_statuses` SET `color_background`='#F0F3F4', `color_text`='#000000' WHERE  `status`='N';
UPDATE `asterisk`.`vicidial_statuses` SET `color_background`='#CACFD2' WHERE  `status`='NI';
UPDATE `asterisk`.`vicidial_statuses` SET `color_background`='#5D6D7E' WHERE  `status`='NP';
UPDATE `asterisk`.`vicidial_statuses` SET `color_background`='#979A9A' WHERE  `status`='XFER';
UPDATE `asterisk`.`vicidial_statuses` SET `status_name`='Sin Respuesta' WHERE  `status`='NA';
UPDATE `asterisk`.`vicidial_statuses` SET `status_name`='Reprogramar Llamada' WHERE  `status`='CALLBK';
UPDATE `asterisk`.`vicidial_statuses` SET `status_name`='Mando a Buzón' WHERE  `status`='A';
UPDATE `asterisk`.`vicidial_statuses` SET `status_name`='Ocupado' WHERE  `status`='B';
UPDATE `asterisk`.`vicidial_statuses` SET `status_name`='Se Cortó la Llamada' WHERE  `status`='DC';
UPDATE `asterisk`.`vicidial_statuses` SET `status_name`='Venta Rechazada' WHERE  `status`='DEC';
UPDATE `asterisk`.`vicidial_statuses` SET `status_name`='No Vuelvas a Llamar' WHERE  `status`='DNC';
UPDATE `asterisk`.`vicidial_statuses` SET `status_name`='Venta Hecha' WHERE  `status`='SALE';
UPDATE `asterisk`.`vicidial_statuses` SET `status_name`='No Contesta' WHERE  `status`='N';
UPDATE `asterisk`.`vicidial_statuses` SET `status_name`='No Interesado' WHERE  `status`='NI';
UPDATE `asterisk`.`vicidial_statuses` SET `status_name`='Se le Hace Caro' WHERE  `status`='NP';
UPDATE `asterisk`.`vicidial_statuses` SET `status_name`='Llamada Transferida' WHERE  `status`='XFER';


<strong>OJO, en el siguiente INSERT, el valor de list_id = 1002, cambiar este valor segun la lista que desee estos campos personalizados</strong>

INSERT INTO `vicidial_lists_fields` VALUES (1,1002,'registration_date','Registration date','Fecha de registro',1,'','DATE','',10,10,'',10,'','TOP','VERTICAL',1,'N','DISABLED','N'),(2,1002,'Booking','Booking','Codigo de reservación',1,'','TEXT','',20,20,'',0,'','TOP','VERTICAL',2,'N','DISABLED','N'),(3,1002,'Marital_Status','Marital Status','Estado civil',1,'','TEXT','soltero,soltero\r\ncasado,casado\r\ndivorciado,divorciado',10,1,'',0,'','TOP','VERTICAL',3,'N','DISABLED','N'),(4,1002,'occupation','Occupation','ocupacion',1,'','TEXT','',35,35,'',0,'','TOP','VERTICAL',4,'N','DISABLED','N'),(5,1002,'toto','T.O.','toto',2,'','TEXT','',50,50,'',0,'','TOP','VERTICAL',1,'N','DISABLED','N'),(6,1002,'ext_ext','EXT','Ext',2,'','TEXT','',30,30,'',0,'','TOP','VERTICAL',2,'N','DISABLED','N'),(7,1002,'packages_booking','Packages','Paquetes de reservación',3,'','SCRIPT','<div>\r\n<div class=\"text-right\">\r\n<button id=\"btn-addpackage\" type=\"button\" class=\"btn btn-success\" onclick=\"agentinfo.addpackage();\">\r\nAgregar Package\r\n</button>\r\n</div>\r\n<div class=\"text-center\">\r\n<strong>\r\nPACKAGES:\r\n</strong>\r\n</div>\r\n<div>\r\n<table class=\"table table-bordered\">\r\n<thead>\r\n    <tr>\r\n      <th>Hotel</th>\r\n      <th>Days</th>\r\n     <th>Destination</th>\r\n      <th>Validity</th>\r\n<th>Acciones</th>\r\n    </tr>\r\n  </thead>\r\n  <tbody id=\"body-packages\">\r\n    <tr>\r\n      <td><input type=\"text\" class=\"form-control\" nom=\"hotel\" placeholder=\"Hotel\" name=\"hotel[]\"></td>\r\n      <td><input type=\"text\" class=\"form-control\" nom=\"days\" placeholder=\"Days\" name=\"days[]\"></td>\r\n<td><input type=\"text\" class=\"form-control\" nom=\"destination\" placeholder=\"Destination\" name=\"destination[]\"></td>\r\n<td><input type=\"text\" class=\"form-control\" nom=\"validity\" placeholder=\"Validity\" name=\"validity[]\"></td>\r\n<td><button id=\"btn-delpackage\" type=\"button\" class=\"btn btn-danger\" onclick=\"agentinfo.delpackage(this);\">\r\n<i class=\"fa fa-times-circle\" aria-hidden=\"true\"></i>\r\n</button></td>\r\n    </tr>\r\n  </tbody>\r\n</table>\r\n</div>\r\n</div>',100,100,'',0,'','TOP','VERTICAL',1,'N','DISABLED','N'),(8,1002,'price','Price USD','Precio',4,'','TEXT','',15,15,'',0,'','TOP','VERTICAL',1,'N','DISABLED','N'),(9,1002,'downpayment','Downpayment','deposito',4,'','TEXT','',50,50,'',0,'','TOP','VERTICAL',2,'N','DISABLED','N'),(10,1002,'pesos','Pesos MXN','precio en pesos',4,'','TEXT','',15,15,'',0,'','TOP','VERTICAL',3,'N','DISABLED','N'),(11,1002,'bal','bal','',4,'','TEXT','',30,30,'',0,'','TOP','VERTICAL',4,'N','DISABLED','N'),(12,1002,'auth_code','Auth. code','codigo de autenticacíon',5,'','TEXT','',30,30,'',0,'','TOP','VERTICAL',1,'N','DISABLED','N'),(13,1002,'terminal','Terminal','terminal',5,'','TEXT','',50,50,'',0,'','TOP','VERTICAL',2,'N','DISABLED','N'),(14,1002,'act_fee','ACT. FEE','act. fee',5,'','TEXT','',30,30,'',0,'','TOP','VERTICAL',3,'N','DISABLED','N'),(15,1002,'vlo','VLO','vlo',5,'','TEXT','',30,30,'',0,'','TOP','VERTICAL',4,'N','DISABLED','N'),(16,1002,'travel_dates','Travel Dates','fechas de viaje',6,'','DATE','',15,15,'',10,'','TOP','VERTICAL',1,'N','DISABLED','N'),(17,1002,'exchange_rate','Exchange Rate','tipo de cambio',6,'','TEXT','',15,15,'',0,'','TOP','VERTICAL',2,'N','DISABLED','N'),(18,1002,'credit_card_information','Credit card','Tarjeta de codigo',7,'','TEXT','',22,22,'',0,'','TOP','VERTICAL',1,'N','DISABLED','N'),(19,1002,'exp_date','Exp. Date','fecha de expiración',7,'','TEXT','',15,15,'',0,'','TOP','VERTICAL',2,'N','DISABLED','N'),(20,1002,'cvc_code','CVC Code','cvc codigo',7,'','TEXT','',15,15,'',0,'','TOP','VERTICAL',3,'N','DISABLED','N');


<h3> Configurar </h3>

/var/www/html/php/goCRMAPISettings.php

Configurar dominio y clave en webhooks de facebook https://developers.facebook.com/apps/146655680685042/webhooks

<h3> Opcionales </h3>

Borrar data de mongo por comando
use chatwhatsapp    #selecciona database
db.getCollection('chatmessages').find({});    #obtener data
db.chatmessages.drop();       #eliminar toda la data