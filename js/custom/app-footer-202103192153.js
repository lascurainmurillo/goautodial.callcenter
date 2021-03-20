/**
 *
 *  Ver estado de login
 * FB is SDK Facebook javascript
 */
function checkLoginState() {
    // mostrar Loading
    FB.getLoginStatus(function(response) {
        console.log(response);
        if (respomse.status == "connected") {
            // guardar en base de datos el token 
            // redireccionar a la paginas de pages face
        } else {
            // eliminar Loading
            // mostrar alerta "usted no se ha logueado correctamente"

        }
        // statusChangeCallback(response);
    });
}