/**
 *
 * inicilizar conexion 
 * Sockets Io
 * 
 */
socketcus = {}
socketcus.socket = null;
socketcus.init = function(DOMAIN, agent_username) {
    socketcus.socket = io.connect(DOMAIN, { 'forceNew': true });
    $("#backtransparent").addClass('hidden');
    $("#alert-socket").addClass('hidden');
    socketcus.domain = DOMAIN;
    socketcus.selectroom = null;
    socketcus.agent_username = agent_username;

    socketcus.colores = ["red", "blue", "burlywood", "fuchsia", "yellow", "peachpuff", "orange", "limegreen"];
    socketcus.color_client_current = null;
    socketcus.color_agent_current = null;
    socketcus.room = {};
    socketcus.key_enable = 0; // llave para saber si ya esta cargada la info al carga la página, 1 => no volver a cargar la info, por si otra pagina se abre y carga la info.
    socketcus.data_room = {};

    socketcus.socket.on('connect_error', function(err) {
        // handle server error here
        // ocultar chat si sucede un error
        if ($("#backtransparent").hasClass('hidden')) {
            $("#alert-socket").html(`<div>Hubo un problema en la conexión. Click aquí para continuar o recargue la página.</div><button class="btn btn-warning" onclick="socketcus.showchat();">Click aquí</button>`);
            $("#backtransparent").removeClass('hidden');
            $("#alert-socket").removeClass('hidden');
        }
        console.log('Error connecting to server');
    });

    // Obtiene y renderisa la lista de clientes 
    socketcus.socket.on('roomUsers', ({ room, agent_fromsocket }) => {
        console.log("cargando.........");
        console.log(socketcus.selectroom);
        if (socketcus.selectroom) {
            var exist_tag = $("#list" + socketcus.selectroom.replace(/\+/g, '\\+')).length <= 0 ? true : false;
        } else {
            var exist_tag = true;
        }

        if (socketcus.agent_username == agent_fromsocket && exist_tag) {
            socketcus.getRoomUsers(socketcus.agent_username)
                .then((clients) => {

                    if (socketcus.selectroom != null && clients.find(el => el.room == socketcus.selectroom) == null) {
                        clients.push(socketcus.data_room);
                    }

                    socketcus.selectroom = room; // reemplazamos el room por el que se emitio. Usualmente es el mismo pero para casos de que el client_id sea null. 

                    var list = "";
                    $('.sideBar-body').removeClass('sideBar-seleccionado');
                    $("#conversation-whats").html('');

                    clients.forEach(el => {

                        // if ($("#list" + el.client_id.replace(/\+/g, '\\+')).length <= 0) {

                        list = list + `<div id="list${el.client_id}" class="row sideBar-body ${(socketcus.selectroom == el.client_id) ? 'sideBar-seleccionado': ''}" onclick="socketcus.select_room(this, '${el.client_id}', '${el.client_name}', ${(el.image != null) ? 'la_imagen': null})">
                                <div class="${_styleRe.class[0]} sideBar-avatar">
                                    <div class="avatar-icon">
                                        <img src="${(el.image != null) ? 'la_imagen': '/img/avatars/default/defaultAvatar.png'}">
                                    </div>
                                </div>
                                <div class="${_styleRe.class[1]} sideBar-main">
                                    <div class="row">
                                        <div class="col-sm-8 col-xs-8 sideBar-name">
                                            <span class="name-meta">${el.client_name}</span>
                                        </div>
                                        <div class="col-sm-4 col-xs-4 pull-right sideBar-time">
                                            <!-- <span class="time-meta pull-right">18:18</span> -->
                                        </div>
                                    </div>
                                </div>
                            </div>`;

                        // $("#conversation-whats").append(`<div id="client${el.client_id}" class="${(socketcus.selectroom == el.client_id) ? '': 'hidden'}"></div>`);
                        // obtener mensaje anteriores
                        if (socketcus.selectroom == el.client_id) {
                            $("#conversation-whats").append(`<div id="client${el.client_id}" class="room-conversation"></div>`);

                            socketcus.getMessagesClient(socketcus.selectroom, new Date().toISOString());

                            socketcus.headernameWhatsapp(el.image, el.client_name);
                        }
                        // }

                    });

                    $("#list-clients").html(list);
                    socketcus.key_enable = 1;
                });
        }

    });

    // Escuchar mensajes de whatsapp
    socketcus.socket.on('message', message => {
        console.log("--------------- RESULT -----------------");
        console.log(message);
        // limpiar files y mostrar loader
        socketcus.clearfiles();

        socketcus.htmlchatting(message, message.room);

        // colocar scrool al final
        socketcus.scrollend(null, message.send_tipo);
    });
}

/* Al momento que contesta un cliente la llamada */
socketcus.chatwhatsapp = function(client_id = null, client_name = null, list_id = null) {

    // iniciar client que contesta
    socketcus.select_list_id = list_id;
    // if (client_id != null && client_name != null) {
    socketcus.selectroom = client_id;
    socketcus.select_client_name = client_name;

    socketcus.data_room = {
        agent_username: socketcus.agent_username,
        client_id,
        client_name,
        room: client_id,
    }

    // }
    // Color para cliente y agent actual
    socketcus.color_client_current = socketcus.getcolor();
    socketcus.color_agent_current = socketcus.getcolor();

    // Crear sala
    socketcus.socket.emit('joinRoom', socketcus.data_room);

}


/* Emitir mensaje */
socketcus.sendmessage = function() {

    let data_call = {
        agent_username: socketcus.agent_username,
        client_id: socketcus.selectroom,
        client_name: socketcus.select_client_name,
        list_id: socketcus.select_list_id,
        room: socketcus.selectroom, // phone number
        message: {
            user: socketcus.agent_username,
            msg: "",
            tipo: 'sender',
            caption: null,
            send_tipo: ""
        },
    }

    var fd = new FormData();

    // Si se está suficiente archivo
    if (socketcus.filesTemp.file.length > 0) {

        // cambiar boton a loader
        $("#message-send").addClass("hidden");
        $("#loader-send").removeClass("hidden");

        fd.append('file', socketcus.filesTemp.file[0]);
        // console.log(socketcus.filesTemp.file[0]);
        $.ajax({
            url: socketcus.domain + '/whatsapp/send-file',
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function(response) {
                // console.log(response);
                if (response.status == 200 || response.status == 201) {
                    data_call.message.msg = response.url_file;
                    data_call.message.send_tipo = socketcus.filesTemp.type;
                    data_call.message.filename = socketcus.filesTemp.file[0].name;

                    // Emitir un mensaje hacia el server
                    socketcus.socket.emit('chatMessage', data_call);
                } else {
                    alert('file not uploaded');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                // limpiar files y mostrar loader
                $("#comment-send").prop('disabled', false);
                socketcus.clearfiles();
            }
        });

    } else {
        // enviar mensaje de texto
        if ($("#comment-send").val().trim() != "" && socketcus.selectroom != null) {

            // cambiar boton a loader
            $("#message-send").addClass("hidden");
            $("#loader-send").removeClass("hidden");

            var msg_original = $('#comment-send').val();
            data_call.message.msg = msg_original;
            data_call.message.send_tipo = 'chat';

            // Emitir un mensaje hacia el server
            socketcus.socket.emit('chatMessage', data_call);
            var msg = $("#comment-send").val().trim().replace(/\n/g, "");

            $("#comment-send").val("");
            $('#comment-send').focus();
        }

    }

}

socketcus.filesTemp = {
    file: {},
    type: "",
}; //variable global del tipo de archivo
/**
 * 
 * Detect que tipo de archivo se está subiendo
 * 
 */
socketcus.fileselect = function(tag) {
    if ($('#whats_attach_multimedia')[0].files != null && tag == "#whats_attach_multimedia") { // si es imagen o video
        socketcus.filesTemp.file = $('#whats_attach_multimedia')[0].files;
        // console.log(URL.createObjectURL(socketcus.filesTemp[0]));
        switch (socketcus.filesTemp.file[0].type) {
            case 'video/mp4':
            case 'video/m4v':
            case 'video/avi':
                $("#file-previous").html(`<div align="center" class="embed-responsive embed-responsive-16by9" style="width: 150px;">
                                                <video controls loop class="embed-responsive-item">
                                                    <source src="${URL.createObjectURL(socketcus.filesTemp.file[0])}" type="video/mp4">
                                                </video>
                                            </div>`);
                if ($("#whats-previous-file").hasClass('hidden')) {
                    $("#whats-previous-file").removeClass('hidden');
                }
                socketcus.filesTemp.type = 'video';
                break;
            case 'image/jpeg':
            case 'image/png':
            case 'image/gif':
            case 'image/jpg':
                $("#file-previous").html(`<div><img src="${URL.createObjectURL(socketcus.filesTemp.file[0])}" alt="Imagen upload" style="height: 100%;" /></div>`);
                if ($("#whats-previous-file").hasClass('hidden')) {
                    $("#whats-previous-file").removeClass('hidden');
                }
                socketcus.filesTemp.type = 'image';
                break;
            default:
                socketcus.filesTemp = {
                    file: {},
                    type: "",
                };
                $("#whats-previous-file").addClass('hidden');
                alert("No es un archivo válido");
                break;
        }



        // console.log(socketcus.filesTemp);
    } else if ($('#whats_attach_files')[0].files != null && tag == "#whats_attach_files") { // si es archivo
        socketcus.filesTemp.file = $('#whats_attach_files')[0].files
        $("#file-previous").html(`<div>
        <i class="fa fa-file-text-o" aria-hidden="true" style="font-size:90px"></i> 
        </div><div>${socketcus.filesTemp.file[0].name}</div>`);
        if ($("#whats-previous-file").hasClass('hidden')) {
            $("#whats-previous-file").removeClass('hidden');
        }
        socketcus.filesTemp.type = 'document';
        // console.log(socketcus.filesTemp);
    }
}

// Presionar enter para enviar mensaje
$('#comment-send').keypress(function(event) {
    var com = $('#comment-send');
    if (event.keyCode != 13) return;
    socketcus.sendmessage();
    return false;
});

socketcus.getcolor = function() {
    var ele_index = Math.floor(Math.random() * socketcus.colores.length);
    var color_client = socketcus.colores[ele_index];
    socketcus.colores.splice(ele_index, 1);
    return color_client;
}


/**
 * 
 * Obtener mensajes
 * @param {*} room 
 */
socketcus.getMessagesClient = function(room, date, append = 1) {

    var end_previous = true;
    $.ajax({
        url: socketcus.domain + '/whatsapp/message',
        type: 'GET',
        data: { room, date },
        datatype: 'json',
        success: function(data) {
            if (data.length) {
                data.forEach(el => {
                    if (el["previous"] !== undefined) {
                        end_previous = false;
                        socketcus.htmlprevious(room, data[0].created_at);
                    } else {
                        socketcus.htmlchatting(el.message, room, append);
                    }
                });
                if (append) {
                    socketcus.scrollend();
                }
                if (end_previous) {
                    $("#message-previous" + room.replace(/\+/g, '\\+')).remove(); // eliminar definitivamente el boton previous
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}


/**
 * 
 * 
 * 
 */
socketcus.getRoomUsers = async function(agent_username, client_id = null) {

    let result;

    try {

        result = await $.ajax({
            url: socketcus.domain + '/whatsapp/rooms',
            type: 'GET',
            data: { agent_username, client_id },
            datatype: 'json',
        });

        return result;

    } catch (error) {
        console.error(error);
    }

}


/**
 * Chatting mensajes
 * @param {*} message 
 */
socketcus.htmlchatting = function(message, room, append = 1) {
    // if (message.type == "sender") {
    // var date = new Date(message.time);
    var timeampm = formatAMPM(new Date(message.time));
    var msg = fileValidation(message.msg, message.caption, message.send_tipo);

    var chatting = `<div class="row message-body">
                        <div class="col-sm-12 message-main-${message.tipo}">
                            <div class="${message.tipo}">
                                <div class="message-cont" style="color: ${ (message.tipo == "sender" ? socketcus.color_agent_current : socketcus.color_client_current) }">
                                    <strong>${message.user}</strong>
                                </div>
                                <div class="message-cont message-text">
                                    ${msg}
                                </div>
                                <span class="message-cont message-time pull-right">${timeampm}</span>
                            </div>
                        </div>
                    </div>
                `;
    // }
    // $("#conversation-whats").append(chatting);
    if ($("#client" + room.replace(/\+/g, '\\+')).length > 0) {
        if (append) {
            $("#client" + room.replace(/\+/g, '\\+')).append(chatting);
        } else {
            $(chatting).insertBefore("#message-previous" + room.replace(/\+/g, '\\+'));
        }
    }
}

/**
 * 
 * Seleccionar y mostrar una sala
 * 
 */
socketcus.select_room = function(e, room, client_name, image) {

    socketcus.selectroom = room;
    socketcus.select_client_name = client_name;

    $('.sideBar-body').removeClass('sideBar-seleccionado');
    $(e).addClass('sideBar-seleccionado');
    //socketcus.selectroom = room;

    $('.room-conversation').addClass('hidden');
    if ($("#client" + room.replace(/\+/g, '\\+')).length > 0) {
        // supuestamente no hace nada
        $('#client' + room.replace(/\+/g, '\\+')).removeClass('hidden');
    } else {
        $("#conversation-whats").append(`<div id="client${room}" class="room-conversation"></div>`);
        socketcus.getMessagesClient(room, new Date().toISOString());
    }
    socketcus.headernameWhatsapp(image, client_name); // cambiar nombre e imagen del header del cliente
    socketcus.scrollend(); // scrollear hasta el final del chat
}

/**
 * 
 * 
 * Subir archivo para whatsapp
 * 
 */
$("#what-attach-multimedia").click(function() {
    $("#whats_attach_multimedia").click();
});
$("#what-attach-files").click(function() {
    $("#whats_attach_files").click();
});
$("#whats_attach_multimedia").change(function() {
    socketcus.filesTemp = {
        file: {},
        type: "",
    };
    $("#comment-send").prop('disabled', true);
    $("#comment-send").val("");
    socketcus.fileselect("#whats_attach_multimedia");
});
$("#whats_attach_files").change(function() {
    socketcus.filesTemp = {
        file: {},
        type: "",
    };
    $("#comment-send").prop('disabled', true);
    $("#comment-send").val("");
    socketcus.fileselect("#whats_attach_files");
});



/**
 * 
 * @param {*} image 
 * @param {*} client_name 
 */
socketcus.headernameWhatsapp = function(image, client_name) {
    //colocar imagen
    $("#avatat_chats").html(`<div>
        <div id="avatar" style="width: 40px; height: 40px; border-radius: 50%; text-align: center; vertical-align: middle; display: block; background: url(${(image != null) ? 'la_imagen': './img/avatars/default/defaultAvatar.png'}) 0% 0% / 40px 40px no-repeat content-box;"></div>
    </div>
    `);
    //colocar nombre
    $("#fullname_chats").html(`<span class="first_name_chats">${client_name}</span>`);
}


/**
 * 
 * 
 * 
 */
socketcus.clearfiles = function() {
    // limpiar filesTemp
    socketcus.filesTemp = {
        file: {},
        type: "",
    };

    // Limpiar inputs files
    document.getElementById("whats_attach_multimedia").value = "";
    document.getElementById("whats_attach_files").value = "";

    // ocultar previous
    if (!$("#whats-previous-file").hasClass('hidden')) {
        $("#whats-previous-file").addClass('hidden');
        $("#file-previous").html("");
    }

    $("#comment-send").prop('disabled', false);

    if (!$("#loader-send").hasClass('hidden')) {
        $("#loader-send").addClass("hidden");
        $("#message-send").removeClass("hidden");
    }
}

/**
 * 
 * 
 * 
 */
socketcus.showchat = function() {
    if (!$("#backtransparent").hasClass('hidden')) {
        $("#backtransparent").addClass('hidden');
        $("#alert-socket").addClass('hidden');
    }
    socketcus.chatwhatsapp(null, null, 1004);
}


/**
 * 
 * 
 * 
 */
socketcus.htmlprevious = function(room, date) {

    var previ = `<div id="message-previous${room}" class="row message-previous">
                    <div class="col-sm-12 previous">
                        <a onClick="socketcus.getMessagesClient('${room}', '${date}', 0)" name="20">
                            Mostrar mensajes previos!
                        </a>
                    </div>
                </div>`;

    if ($("#message-previous" + room.replace(/\+/g, '\\+')).length > 0) {
        $("#message-previous" + room.replace(/\+/g, '\\+')).remove();
    }

    if ($("#client" + room.replace(/\+/g, '\\+')).length > 0) {
        $("#client" + room.replace(/\+/g, '\\+')).prepend(previ);
    }
}


/**
 * 
 * Scroll down final
 * 
 */
socketcus.scrollend = function(time = null, send_tipo = null) {
    if (time) {
        setTimeout(function() {
            var conver = document.getElementById('conversation-whats');
            conver.scrollTop = conver.scrollHeight;
        }, time);
    } else if (send_tipo == null || send_tipo == 'chat') {
        var conver = document.getElementById('conversation-whats');
        conver.scrollTop = conver.scrollHeight;
    } else {
        setTimeout(function() {
            var conver = document.getElementById('conversation-whats');
            conver.scrollTop = conver.scrollHeight;
        }, 1000);
    }

}


/**
 * 
 * @returns 
 * 
 */
socketcus.detectResize = function() {

    var _styless = {
        class: []
    };

    _styless.class[0] = "col-sm-3 col-xs-3";
    _styless.class[1] = "col-sm-9 col-xs-9";

    _styless.class[2] = "col-sm-1 col-xs-1";
    _styless.class[3] = "col-sm-9 col-xs-9";
    _styless.class[4] = "col-sm-1 col-xs-1";
    if (768 <= parseInt($(window).width()) && parseInt($(window).width()) < 991.98) { //md
        _styless.class[0] = 'col-xs-3 col-sm-3 col-md-12 col-lg-12';
        _styless.class[1] = 'col-xs-9 col-sm-9 col-md-12 col-lg-12';

        _styless.class[2] = "col-lg-2 col-md-2 col-sm-1 col-xs-1";
        _styless.class[3] = "col-lg-8 col-md-8 col-sm-9 col-xs-9";
        _styless.class[4] = "col-lg-1 col-lg-1 col-sm-1 col-xs-1";
    };

    if (992 <= parseInt($(window).width()) && parseInt($(window).width()) < 1281) { //lg
        _styless.class[0] = 'col-xs-3 col-sm-3 col-md-12 col-lg-12';
        _styless.class[1] = 'col-xs-9 col-sm-9 col-md-12 col-lg-12';

        _styless.class[2] = "col-lg-2 col-md-2 col-sm-1 col-xs-1";
        _styless.class[3] = "col-lg-6 col-md-6 col-sm-9 col-xs-9";
        _styless.class[4] = "col-lg-2 col-lg-1 col-sm-1 col-xs-1";
    };

    return _styless;
}


/**
 *
 * escuchar notificaciones leadgen y agregar una fila a la lista de leadgen
 * on_notify_leadgen
 * 
 */
socketcus.on_notify_leadgen = function() {
    socketcus.socket.on('notify_leadgen', function(data) {

        // console.log(data);
        let d = new Date(data.created_time);
        let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
        let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

        var new_row = `<tr>
                        <th>
                            ${data.full_name}
                        </th>
                        <th>
                            ${data.email}
                        </th>
                        <th>
                            ${data.phone_number}
                        </th>
                        <th>
                            <span class='dropdown-time text-primary' xtime='${d.toUTCString()}'></span>
                            <span class='dropdown-time text-primary'>${da} ${mo} ${ye}</span>
                        </th>
                        <th>
                            <button class=\"btn btn-warning\">Accion 1</button>
                            <!-- button class=\"btn btn-danger\">Ocultar</button> -->
                        </th>
                    </tr>`;

        $("#list_leadgen tbody").append(new_row);

        // notificar al agente
        notify.init('right bottom', "Un nuevo cliente ha solicitado más información. ¿Desea contestar la llamada?", "Contestar", 'notify_leadgen');

        // actualizar el contador
        var count = $("#viewcount").html();
        count = parseInt(count.match(/\d+/)[0]) + 1;

        if (count > 9) {
            count = "+9";
        }

        $("#viewcount").html(count);

        // notificar con sound
        var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', '/public/sounds/juntos-607.mp3');
        audioElement.play();


    });
}