/**
 *
 *  Ver estado de login. Se esjecuta despues de que el usuario se logea
 * FB is SDK Facebook javascript
 */
function checkLoginState(log_user, log_group) {
    // mostrar Loading
    $(".preloader").show();
    FB.getLoginStatus(function(response) {

        if (response.status == "connected") {

            var data = {
                log_user: "goadmin", // log_user,
                log_group: "ADMIN", // log_group,
                token: response.authResponse.accessToken,
                expiration_time: response.authResponse.data_access_expiration_time,
                user_id: response.authResponse.userID,
                responsetype: 'json',
                utjo: localStorage.getItem('utjo') // token
            }

            // guardar en base de datos el token
            $.ajax({
                url: "./php/social_red/SocialLogin.php",
                type: 'POST',
                dataType: "json",
                data: data,
                success: function(data) {
                    // console.log(data);
                    $(".preloader").hide();
                    if (data.result == "success") {
                        // redireccionar a la paginas de pages face
                        // localStorage.setItem('user', JSON.stringify(data.data));
                        window.location.replace("/socialpages.php");
                    } else {
                        // colocar un swal para notificar que el usuario no se logeo correctamente
                        swal("Cerrar", data.result, "error");
                        // sweetAlert("<?php $lh->translateText("add_user_failed"); ?>", data, "error");
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    swal("Cerrar", "Sucedió un problema inténtelo nuevamente. " + errorThrown, "error");
                }
            });
        } else {
            // eliminar Loading
            $(".preloader").hide();
            swal("Cerrar", "Usted no se ha logueado correctamente.", "error");
        }

    });

}


function logoutFacebook() {

    // ajax cerrar sesion cambiar estado en base de datos
    $.ajax({
        url: "./php/social_red/SocialLogout.php",
        type: 'POST',
        dataType: "json",
        data: { responsetype: 'json', tokenjwt: localStorage.getItem('user') },
        success: function(data) {
            // console.log(data);
            if (data.result == "success") {
                // cambiar boton cerrar a boton de facebook
                // localStorage.removeItem('user');
                window.location.replace("/index.php");
            } else {
                // colocar un swal para notificar que el usuario no se logeo correctamente
                swal("Cerrar", data.result, "error");
                // sweetAlert("<?php $lh->translateText("add_user_failed"); ?>", data, "error");
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            swal("Cerrar", "Sucedió un problema inténtelo nuevamente. " + errorThrown, "error");
        }
    });
}