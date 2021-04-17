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
    $('span[xtime]').each(function(index, element) {
        h = countup.h;
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