<?php
/**
 * @file        socialpages.php
 * @brief       Gestion de paginas de facebook e instagram
 * @copyright   Copyright (c) 2021 GOautodial Inc.
 * @author		Mark Cornejo Bonifacio
 *
 * @par <b>License</b>:
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

	require_once('./php/UIHandler.php');
	require_once('./php/UIHandlerSocial.php');
	require_once('./php/APIHandler.php');
	require_once('./php/CRMDefaults.php');
    require_once('./php/LanguageHandler.php');
    include('./php/Session.php');

	$ui = \creamy\UIHandler::getInstance();
	$uisocial = \creamy\UIHandlerSocial::getInstance();
	$api = \creamy\APIHandler::getInstance();
	$lh = \creamy\LanguageHandler::getInstance();
	$user = \creamy\CreamyUser::currentUser();
	
	$perm = $api->goGetPermissions('voicefiles,moh', $_SESSION['usergroup']);
?>
<html>
    <head>
        <meta charset="UTF-8">
        <title><?php $lh->translateText('portal_title'); ?> - <?php $lh->translateText("audiofiles"); ?></title>
        <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>

        <?php 
			print $ui->standardizedThemeCSS(); 
			print $ui->creamyThemeCSS();
			print $ui->dataTablesTheme();
		?>

    	<!-- Wizard Form style -->
        <link href="css/style.css" rel="stylesheet" type="text/css" />
    </head>

    <?php print $ui->creamyBody(); ?>

        <div class="wrapper">
			<!-- header logo: style can be found in header.less -->
			<?php print $ui->creamyHeader($user); ?>
			<!-- Left side column. contains the logo and sidebar -->
			<?php print $ui->getSidebar($user->getUserId(), $user->getUserName(), $user->getUserRole(), $user->getUserAvatar()); ?>

			<!-- Right side column. Contains the navbar and content of the page -->
			<aside class="right-side">
				<!-- Content Header (Page header) -->
				<section class="content-header">
					<h1>
						<?php echo "Redes sociales" ?>
						<small><?php echo "Administracion de redes sociales" //$lh->translateText("audiofiles_management"); ?></small>
					</h1>
					<ol class="breadcrumb">
						<li><a href="./index.php"><i class="fa fa-phone"></i> <?php $lh->translateText("home"); ?></a></li>
						<li>Redes sociales</li>
						<li class="active">Fan pages</li>
					</ol>
				</section>

				<!-- Main content -->
				<section class="content">

					<div class="panel panel-default">
						<div class="panel-body">
							<legend>
								Fan pages
							</legend>

							<div class="row">
								<div class="col-lg-12">
									<div class="pull-right">
										<?php if($uisocial->isloginface()){ ?> 
											<button class="btn btn-danger" onClick="logoutFacebook();"><i class="fa fa-door-open"></i>Cerra sesion de red social</button>
										<?php } else { ?>
											<div class="fb-login-button" data-width="" data-size="large" data-button-type="login_with" data-layout="default" data-auto-logout-link="false" data-use-continue-as="false" style="margin: 10px 0px" onlogin="checkLoginState('<?php echo $_SESSION['user']?>', '<?php echo $_SESSION['usergroup'] ?>');"></div>
										<?php } ?>
									</div>
								</div>
								<div class="col-lg-12">
									<div class="">
										hola
									</div>
								</div>
							</div>
						</div><!-- /. body -->
					</div><!-- /. panel -->
				</section><!-- /.content -->
			</aside><!-- /.right-side -->
			<?php print $ui->getRightSidebar($user->getUserId(), $user->getUserName(), $user->getUserAvatar()); ?>
		</div><!-- ./wrapper -->


		<!-- MOH MODALS -->
		<!-- end of modal -->


		<!-- VOICE FILES MODALS -->
			<!-- Playback Modal -->
			<div id="voice-playback-modal" class="modal fade" role="dialog">
			<div class="modal-dialog modal-sm">

				<!-- Modal content-->
				<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title"><b><?php $lh->translateText("voice_files_playback"); ?></b></h4>
				</div>
				<div class="modal-body">
					<center class="mt"><em class="fa fa-music fa-5x"></em></center>
					<div class="row mt mb">
						<center><span class="voice-details"></span></center>
					</div>
					<br/>
					<div class="voice-player"></div>
					<!-- <audio controls>
					<source src="http://www.w3schools.com/html/horse.ogg" type="audio/ogg" />
					<source src="http://www.w3schools.com/html/horse.mp3" type="audio/mpeg" />
					<a href="http://www.w3schools.com/html/horse.mp3">horse</a>
				</audio> -->
				</div>
				<div class="modal-footer">
				<a href="" class="btn btn-primary download-audio-file<?=($perm->voicefiles->voicefiles_download === 'N' ? ' hidden' : '')?>" download><?php $lh->translateText("download_file"); ?></a>
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				</div>
				</div>
				<!-- End of modal content -->
			</div>
			</div>
			<!-- End of modal -->

			<!-- Upload Voice Files Modal -->
			<div id="form-voicefiles-modal" class="modal fade" role="dialog">
			<div class="modal-dialog">

				<!-- Modal content-->
				<div class="modal-content">
					<div class="modal-header">
						<h4 class="modal-title animated bounceInRight">
							<b><?php $lh->translateText("upload_voice_file"); ?></b>
							<button type="button" class="close" data-dismiss="modal" aria-label="close_ingroup"><span aria-hidden="true">&times;</span></button>
						</h4>
					</div>
					<div class="modal-body clearfix">
						<form action="./php/AddVoiceFiles.php" method="POST" id="voicefile_form" enctype="multipart/form-data">
							<input type="hidden" name="session_user" value="<?=$_SESSION['user']?>" />
							<div class="row">
								<h4>
									<?php $lh->translateText("voice_file_wizard_header"); ?><br/>
									<small><?php $lh->translateText("voice_file_wizard_sub_header"); ?></small>
								</h4>
								<fieldset>
									<div class="col-lg-12">
										<div class="form-group mt">
											<div class="input-group">
												<input type="text" class="form-control voice_file_holder" placeholder="<?php $lh->translateText("choose_a_file"); ?>" required>
												<span class="input-group-btn">
													<button class="btn btn-default btn-browse-file" type="button"><?php $lh->translateText("browse"); ?></button>
												</span>
											</div><!-- /input-group -->
											<input type="file" name="voice_file" class="hide" id="voice_file" accept="audio/*">
										</div>
									</div>
									<div class="form-group">
										<div class="upload-loader" style="display:none;">
											<center>
												<div class="fl spinner2" style="position: absolute;">
													<div class="spinner-container container1">
														<div class="circle1"></div>
														<div class="circle2"></div>
														<div class="circle3"></div>
														<div class="circle4"></div>
													</div>
													<div class="spinner-container container2">
														<div class="circle1"></div>
														<div class="circle2"></div>
														<div class="circle3"></div>
														<div class="circle4"></div>
													</div>
													<div class="spinner-container container3">
														<div class="circle1"></div>
														<div class="circle2"></div>
														<div class="circle3"></div>
														<div class="circle4"></div>
													</div>
													<h4 class="upload-text"><b><?php $lh->translateText("uploading"); ?></b></h4>
												</div>
											</center>
										</div>
									</div>
								</fieldset>
							</div>
						</form>
					</div>
				</div>
				<!-- End of modal content -->
			</div>
			</div>
			<!-- End of modal -->
		<!-- End of VOICE FILE Modals -->

		<?php print $ui->standardizedThemeJS(); ?>
        <!-- JQUERY STEPS-->
  		<script src="js/dashboard/js/jquery.steps/build/jquery.steps.js"></script>

		<?php print $ui->creamyFooter(); ?>
    </body>
</html>
