/**
 *
 * obtener data de una cookie. cname = nombre de la cookie
 * getCookie
 * param cname string 
 * return string
 */
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/**
 * ******************************************************************************************
 * countup. tiempo de duracion de un registro.
 * 
 * Declara en etiqueta html <span xtime="" ... ></span>
 * 
 * param date_rfc date rfc2822
 *
 */
var countup = {};
countup.h = 0;

countup.datenow = function(date_rfc) {
    countup.h = Date.parse(date_rfc);
}

countup.xcon_ = function() {
    countup.h = countup.h + 1000;
    setTimeout("countup.xcon_()", 1000)
}

countup.xtimeCont = function() {
    h = countup.h;
    $('span[xtime]').each(function(index, element) {
        var t_ = $(this).attr('xtime');
        var t = Date.parse(t_);
        var c = h - t;
        var txt = '',
            c_, txt_ = '',
            txt__ = '';

        if (c <= "59000") {
            c_ = Math.floor(c / 1000);
            if (c_ > 1) {
                txt__ = 's ';
            }
            txt = 'Hace ' + c_ + ' segundo' + txt__;
            $(this).next().hide();
        } else if (c <= "3599000") {
            c_ = Math.floor(c / 60000);
            if (c_ > 1) {
                txt__ = 's ';
            }
            txt = 'Hace ' + c_ + ' minuto' + txt__;
            $(this).next().hide();
        } else if (c <= "86399000") {
            c_ = Math.floor(c / 3600000);
            if (c_ > 1) {
                txt__ = 's ';
            }
            txt = 'Hace ' + c_ + ' hora' + txt__;
            $(this).next().hide();
        } else if (c <= "345599000") {
            c_ = Math.floor(c / 86400000);
            c_ = Math.floor(c / 86400000);
            if (c_ > 1) {
                txt = 'Hace ' + c_ + ' días';
            } else {
                txt = 'Ayer';
            }
            $(this).next().hide();
        } else {
            $(this).next().show();
            $(this).remove();
        }

        $(this).html(txt);
    });
    setTimeout("countup.xtimeCont()", 5000);
}

/******************************************************************************************** */



/**
 * 
 * Obtener la hora am pm.
 * @param {Date} date 
 * @returns String
 */
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}


/**
 * 
 * Obtener Date() en formato yyyy-mm-dd
 * @param {*} date 
 * @param {*} separacion
 * @returns 
 */
function formatDate(date, separacion = "-") {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join(separacion);
}

/**
 * 
 * validar imagen obtener tag de imagen
 * @param {String} img 
 * @returns 
 */
function fileValidation(file, caption = null, send_tipo = null) {

    var allowedExtensions = /(.jpg|.jpeg|.png|.gif)$/i;
    if (allowedExtensions.exec(file) && send_tipo == 'image') {
        return `<div><a href="${file}" target="_blank" ><img src="${file}" alt="Imagen antigua" width="150" /></a><div>${(caption != null) ? caption : '' }</div></div>`;
    }

    var allowedExtensions = /(.mp4|.wma|.avi)$/i;
    if (allowedExtensions.exec(file) && send_tipo == 'video') {
        return `<div align="center" class="embed-responsive embed-responsive-16by9" style="width: 150px;">
                    <video controls loop class="embed-responsive-item">
                        <source src="${file}" type="video/mp4">
                    </video>
                </div>
                <div>${(caption != null) ? caption : '' }</div>`;
    }

    var allowedExtensions = /(.oga|.mp3)$/i;
    if (allowedExtensions.exec(file) && send_tipo == 'ptt') {
        return `<div><audio controls>
            <source src="${file}" type="audio/ogg">
            Your browser does not support the audio element.
          </audio><div>${(caption != null) ? caption : '' }</div></div>`;
    }

    var allowedExtensions = /(.xlsx|.xls|.cvs|.rar|.zip|.pdf|.txt|.docx|.doc|.ppt|.pptx|.sql)$/i;
    if (allowedExtensions.exec(file) && send_tipo == 'document') {
        return `<div><div><a href="${file}" target="_blank">Click aquí para descargar archivo</a></div><div>${(caption != null) ? caption : '' }</div></div>`;
    }


    if (file == 'Video upload disabled') {
        return `<div>${file}</div><div>${(caption != null) ? caption : '' }</div>`;
    }

    return file;
}


/**
 * ******************************************************************************************
 * notify. tiempo de duracion de un registro.
 * notify.addnewstyle: crear un html template para mostrar en la notificacion
 * notify.events: eventos para los botones
 * 
 * param date_rfc date rfc2822
 *
 */
var notify = {}
notify.htmlstyleleadgen = "<div>" +
    "<div class='clearfix'>" +
    "<div class='title' data-notify-html='title'/>" +
    "<div class='buttons'>" +
    "<button class='btn btn-warning yes' data-notify-text='button'></button>" +
    "<button class='btn btn-danger no'>Cancel</button>" +
    "</div>" +
    "</div>" +
    "</div>";

notify.addnewstyle = function(html, stylename) {

    // debes crear los estilos para stylename. Por ejemplo si stylename = 'notify_custom' entonces crear los estilos siguientes
    /*
    .notifyjs-notify_custom-base {}
    .notifyjs-notify_custom-base .title {}
    .notifyjs-notify_custom-base .buttons {} 
    .notifyjs-notify_custom-base button {}
    */
    $.notify.addStyle(stylename, {
        html: html
    });
}

// eventos exclusivo para notify leadgen
notify.events = function() {

    //listen for click events from this style
    $(document).on('click', '.notifyjs-notify_leadgen .no', function() {
        //programmatically trigger propogating hide event
        $(this).trigger('notify-hide');
    });

    $(document).on('click', '.notifyjs-notify_leadgen-base .yes', function() {
        //show button text
        alert($(this).text() + " Haciendo la llamada");
        //hide notification
        $(this).trigger('notify-hide');
    });
}

notify.init = function(position, message, buttontext, stylename) {
    // Documentation https://notifyjs.jpillora.com/
    $.notify({
        title: message,
        button: buttontext
    }, {
        style: stylename,
        position: position, // "right bottom",
        // className: classtype, // info
        autoHideDelay: 500000,
        clickToHide: false
    });
}

/******************************************************************************************** */