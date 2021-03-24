/**
 *
 *  Ver estado de login
 * FB is SDK Facebook javascript
 */
function checkLoginState(log_user, log_group) {
    // mostrar Loading
    // $(".preloader").show();
    FB.getLoginStatus(function(response) {

        if (response.status == "connected") {

            var data = {
                log_user: "goadmin", // log_user,
                log_group: "ADMIN", // log_group,
                token: response.authResponse.accessToken,
                expiration_time: response.authResponse.data_access_expiration_time,
                user_id: response.authResponse.userID
            }

            // guardar en base de datos el token
            $.ajax({
                url: "./php/social_red/SocialCrud.php",
                type: 'POST',
                data: data,
                success: function(data) {
                    console.log(data);
                    if (data) {

                    } else {
                        // sweetAlert("<?php $lh->translateText("add_user_failed"); ?>", data, "error");
                    }
                }
            });

            // redireccionar a la paginas de pages face
            // window.location.replace("/socialpages.php");
        } else {
            // eliminar Loading
            // mostrar alerta "usted no se ha logueado correctamente"
            $(".preloader").hide();
        }
        // statusChangeCallback(response);
    });
}