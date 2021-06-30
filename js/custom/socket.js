/**
 *
 * inicilizar conexion 
 * Sockets Io
 * 
 */
socketcus = {}
socketcus.socket = null;
socketcus.init = function(DOMAIN, agent_username) {
    socketcus.socket = io.connect(DOMAIN, {
        'forceNew': true,
        query: {
            "agent_username": agent_username
        }
    });
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
    socketcus.filesTemp = {}; //inicializar variable para los upload archivos
    socketcus.dataGalerySelected = {}; //object de data seleccionada
    socketcus.usegalery = {} // si se esta usando galeria;

    socketcus.socket.on('connect_error', function(err) {
        // handle server error here
        // ocultar chat si sucede un error
        if ($("#backtransparent").hasClass('hidden')) {
            $("#alert-socket").html(`
                    <div style="margin: 0px 10px 10px 10px">
                        Hubo un problema en la conexión con el servidor. Espere a que se reestablezca la conexión.
                    </div>
                    <div>
                        <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw txt-skin-blue"></i>
                    </div>
            `);
            $("#backtransparent").removeClass('hidden');
            $("#alert-socket").removeClass('hidden');
        }
    });

    socketcus.socket.on("error", (error) => {
        console.log("ESTOY EN error");
    });

    // Obtiene y renderisa la lista de clientes 
    socketcus.socket.on('roomUsers', ({ room, agent_fromsocket }) => {
        console.log(socketcus.selectroom);
        if (socketcus.selectroom) {
            var exist_tag = $("#list" + socketcus.selectroom.replace(/\+/g, '\\+')).length <= 0 ? true : false;
        } else {
            var exist_tag = true;
        }

        if (socketcus.agent_username == agent_fromsocket && exist_tag) {
            // obtener los salones
            socketcus.getRoomUsers(socketcus.agent_username)
                .then((clients) => {

                    if (socketcus.selectroom != null && clients.find(el => el.room == socketcus.selectroom) == null) {
                        clients.push(socketcus.data_room); // agregar el nuevo salon
                    }

                    socketcus.selectroom = room; // reemplazamos el room por el que se emitio. Usualmente es el mismo pero para casos de que el client_id sea null. 

                    var list = "";
                    $('.sideBar-body').removeClass('sideBar-seleccionado');
                    $("#conversation-whats").html(''); // limpiar tag de conversaciones
                    $("#reply-whats").html(''); // limpiar tag controles del chat
                    $("#previous-whats").html(''); // limpiar tag boton de previous o mensaje anteriores

                    clients.forEach(el => {

                        list = list + template.chatconversation(el, socketcus.selectroom, _styleRe); // usando template

                        if (socketcus.selectroom == el.client_id) {
                            // crear tag para el Chat de este cliente
                            $("#conversation-whats").append(`<div id="client${el.client_id}" class="room-conversation"></div>`);

                            // obtener y agregar mensaje anteriores al Chat
                            socketcus.getMessagesClient(socketcus.selectroom, new Date().toISOString());

                            // crear box de controles
                            $("#reply-whats").append(`<div id="reply${el.client_id}" class="reply-conversation"></div>`);
                            socketcus.makeReply(socketcus.selectroom);

                            // crear box previous
                            $("#previous-whats").append(`<div id="roomprevios${el.client_id}" class="roomprevios" ><div id="whatspreviousfile${el.client_id}" class="previous-conversation whatspreviousfile hidden"></div></div>`);
                            socketcus.makePrevious(socketcus.selectroom);

                            // Imagen y nombre del cliente
                            socketcus.headernameWhatsapp(el.image, el.client_name);
                        }

                    });

                    $("#list-clients").html(list);
                    socketcus.key_enable = 1;
                });
        }

    });

    // Escuchar mensajes de whatsapp
    socketcus.socket.on('message', (message) => {
        console.log("--------------- RESULT -----------------");
        console.log(message);

        // escribir chat en pantalla
        socketcus.htmlchatting(message, message.room);

        // colocar scrool al final
        socketcus.scrollend(null, message.send_tipo);
    });

    //recibe un mensaje cuando está conectado el socket servidor
    socketcus.socket.on('conectadocustom', (data) => {

        // oculta venta de alert de desconectado
        socketcus.showchat();
    });
}



/* Al momento que contesta un cliente la llamada */
socketcus.chatwhatsapp = function(client_id = null, client_name = null, list_id = null) {

    // iniciar client que contesta
    socketcus.select_list_id = list_id;

    socketcus.selectroom = client_id;
    socketcus.select_client_name = client_name;

    socketcus.data_room = {
        agent_username: socketcus.agent_username,
        client_id,
        client_name,
        room: client_id,
    }

    // Color para cliente y agent actual
    socketcus.color_client_current = socketcus.getcolor();
    socketcus.color_agent_current = socketcus.getcolor();

    // Crear sala
    socketcus.socket.emit('joinRoom', socketcus.data_room);

}


/* Emitir mensaje */
socketcus.sendmessage = function(room, enter = false) {

    //variable reply
    var reply = "#reply" + room.replace(/\+/g, '\\+');
    var onlyroom = room.replace(/\+/g, '\\+');

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

    // si el mensaje proviene de galery
    if (socketcus.usegalery[onlyroom] && Object.keys(socketcus.dataGalerySelected[onlyroom]).length > 0) {

        data_call.message.msg = socketcus.dataGalerySelected[onlyroom].file;
        data_call.message.send_tipo = socketcus.dataGalerySelected[onlyroom].tipo;
        data_call.message.filename = socketcus.dataGalerySelected[onlyroom].name;

        // Emitir un mensaje hacia el server
        socketcus.socket.emit('chatMessage', data_call);

        // limpiar files y mostrar loader
        socketcus.clearfiles(room);

    } else if (socketcus.filesTemp[onlyroom].file.length > 0) { // Si se está enviando archivo

        // cambiar boton a loader
        $(reply + " #message-send").addClass("hidden");
        $(reply + " #loader-send").removeClass("hidden");

        fd.append('file', socketcus.filesTemp[onlyroom].file[0]);

        $.ajax({
            url: socketcus.domain + '/whatsapp/send-file',
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function(response) {

                if (response.status == 200 || response.status == 201) {
                    data_call.message.msg = response.url_file;
                    data_call.message.send_tipo = socketcus.filesTemp[onlyroom].type;
                    data_call.message.filename = socketcus.filesTemp[onlyroom].file[0].name;

                    // Emitir un mensaje hacia el server
                    socketcus.socket.emit('chatMessage', data_call);

                } else {
                    alert('file not uploaded');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                // limpiar files y mostrar loader
                $(reply + " #comment-send")[0].emojioneArea.enable();
                socketcus.clearfiles(room);
            }
        }).always(function(response) {
            // limpiar files y mostrar loader
            socketcus.clearfiles(room);
        });

    } else { // enviar mensaje de texto

        var comment_emoji = reply + " #comment-send";
        var contar = $(comment_emoji)[0].emojioneArea.getText().length;
        if (enter) {
            var msg_original = $(comment_emoji)[0].emojioneArea.getText().substring(0, contar - 2).trim();
        } else {
            var msg_original = $(comment_emoji)[0].emojioneArea.getText().trim();
        }
        // $(comment_emoji)[0].emojioneArea.setText("");
        if (msg_original != "" && socketcus.selectroom != null) {

            // cambiar boton a loader
            $(reply + " #message-send").addClass("hidden");
            $(reply + " #loader-send").removeClass("hidden");

            // var msg_original = msg_original; // $(reply + ' #comment-send').val();
            data_call.message.msg = msg_original;
            data_call.message.send_tipo = 'chat';

            // Emitir un mensaje hacia el server
            console.log("Emitiendo a chatMessage", data_call);
            socketcus.socket.emit('chatMessage', data_call);

            // borrar espacios en el text area
            // var msg = $(reply + " #comment-send").val().trim().replace(/\n/g, "");

            // limpiar files y mostrar loader
            socketcus.clearfiles(room);

            $(comment_emoji)[0].emojioneArea.setText("");
        }

    }

}


/**
 * 
 * Detect que tipo de archivo se está subiendo
 * 
 */
socketcus.fileselect = function(tag, room) {
    console.log(socketcus.filesTemp);
    var reply = "#reply" + room.replace(/\+/g, '\\+');
    var previous = "#whatspreviousfile" + room.replace(/\+/g, '\\+');
    var onlyroom = room.replace(/\+/g, '\\+');
    $(reply + " #comment-send")[0].emojioneArea.disable();

    // si es multimedia imagen o video
    if ($(reply + ' #whats_attach_multimedia')[0].files != null && tag == "#whats_attach_multimedia") { // si es imagen o video
        socketcus.filesTemp[onlyroom].file = $(reply + ' #whats_attach_multimedia')[0].files;

        if (socketcus.filesTemp[onlyroom].file.length === 1) {
            switch (socketcus.filesTemp[onlyroom].file[0].type) {
                case 'video/mp4':
                case 'video/m4v':
                case 'video/avi':
                    $(previous + " #file-previous").html(template.previousShowVideo(URL.createObjectURL(socketcus.filesTemp[onlyroom].file[0]))); // usando template
                    if ($(previous).hasClass('hidden')) {
                        $(previous).removeClass('hidden');
                    }
                    socketcus.filesTemp[onlyroom].type = 'video';
                    break;
                case 'image/jpeg':
                case 'image/png':
                case 'image/gif':
                case 'image/jpg':
                    $(previous + " #file-previous").html(template.previousShowImage(URL.createObjectURL(socketcus.filesTemp[onlyroom].file[0]))); // usando template
                    if ($(previous).hasClass('hidden')) {
                        $(previous).removeClass('hidden');
                    }
                    socketcus.filesTemp[onlyroom].type = 'image';
                    break;
                default:
                    socketcus.declareFilesRoom(room); // limpiar files
                    $(previous).addClass('hidden');
                    alert("No es un archivo válido");
                    break;
            }
        } else {
            socketcus.clearfiles(room);
        }

        // si es archivo *.*
    } else if ($(reply + ' #whats_attach_files')[0].files != null && tag == "#whats_attach_files") { // si es archivo
        socketcus.filesTemp[onlyroom].file = $(reply + ' #whats_attach_files')[0].files;
        if (socketcus.filesTemp[onlyroom].file.length === 1) {
            // socketcus.filesTemp[onlyroom].file = $(reply + ' #whats_attach_files')[0].files
            $(previous + " #file-previous").html(template.previousShowDocument(URL.createObjectURL(socketcus.filesTemp[onlyroom].file[0].name)));
            if ($(previous).hasClass('hidden')) {
                $(previous).removeClass('hidden');
            }
            socketcus.filesTemp[onlyroom].type = 'document';
            // console.log(socketcus.filesTemp);
        } else {
            socketcus.clearfiles(room);
        }
    }
}

/**
 * 
 * Enviar archivo seleccionado desde Galery
 * @param {String} room 
 * @param {object} data  // 
 * @param {object} type  // imagen, video o file
 */
socketcus.sendGalery = function(room, data) {

    var onlyroom = room.replace(/\+/g, '\\+');
    var reply = "#reply" + room.replace(/\+/g, '\\+');
    var previous = "#whatspreviousfile" + room.replace(/\+/g, '\\+');

    // usando galeria true
    socketcus.usegalery[onlyroom] = true;

    // setiando datos en variable global
    socketcus.dataGalerySelected[onlyroom] = data;

    //mostrando previous de la imagen seleccionada
    $(reply + " #comment-send")[0].emojioneArea.disable();

    switch (data.tipo) {
        case 'image':
            $(previous + " #file-previous").html(template.previousShowImage(data.file)); // usando template
            break;
        case 'video':
            $(previous + " #file-previous").html(template.previousShowVideo(data.file)); // usando template
            break;
        case 'document':
            $(previous + " #file-previous").html(template.previousShowDocument(data.file)); // usando template
            break;

        default:
            alert("problema en galery");
            break;
    }
    if ($(previous).hasClass('hidden')) {
        $(previous).removeClass('hidden');
    }
}



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
 * obtenes salones
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
 * 
 * crear botones de envio de mensaje
 * @param {*} room 
 */
socketcus.makeReply = function(room) {

    var reply = "#reply" + room.replace(/\+/g, '\\+');
    var onlyroom = room.replace(/\+/g, '\\+');
    var htmlreply = template.reply(room); // usando template

    if ($(reply).length > 0) {

        // agregar al html
        $(reply).append(htmlreply);

        // agregar emoticons y presionar enter para enviar mensaje
        $(reply + " #comment-send").emojioneArea({
            events: {
                keypress: function(editor, event) {
                    if (event.keyCode != 13) return;

                    setTimeout(function() {
                        socketcus.sendmessage(room);
                    }, 50);

                    return false;
                }
            }
        });

        //variable para controlar los archivos cargados
        socketcus.declareFilesRoom(room); // limpiar files

        /**
         * Para subir archivo para whatsapp
         */
        var faa = $._data($(reply + " #what-attach-multimedia").get(0), "events");
        if (typeof faa == 'undefined') {
            console.log("estoy creando el click");
            $(reply + " #what-attach-multimedia").click(function() {
                $(reply + " #whats_attach_multimedia").click();
            });

            $(reply + " #whats_attach_multimedia").change(function() {
                socketcus.declareFilesRoom(room); // limpiar files
                socketcus.fileselect("#whats_attach_multimedia", room); // enviar variable para indicar que es un archivo multimedia
            });
        }

        var faa = $._data($(reply + " #what-attach-files").get(0), "events");
        if (typeof faa == 'undefined') {
            $(reply + " #what-attach-files").click(function() {
                $(reply + " #whats_attach_files").click();
            });

            $(reply + " #whats_attach_files").change(function() {
                socketcus.declareFilesRoom(room); // limpiar files
                socketcus.fileselect("#whats_attach_files", room); // enviar variable para indicar que es cualquier tipo de archivo
            });
        }

        // agregar columnas
        $(reply + ' #what-emojis').addClass(_styleRe.class[2]);
        $(reply + ' #what-attach').addClass(_styleRe.class[2]);
        $(reply + ' #what-reply').addClass(_styleRe.class[3]);
        $(reply + ' #message-send').addClass(_styleRe.class[4]);
    }

}


/**
 * Box de previsualizacion de imagen, video
 * @param {*} room 
 */
socketcus.makePrevious = function(room) {
    var previous = "#whatspreviousfile" + room.replace(/\+/g, '\\+');
    var onlyroom = room.replace(/\+/g, '\\+');

    var htmlprevious = template.previousimage(room);

    if ($(previous).length > 0) {
        // agregar al html
        $(previous).append(htmlprevious);
    }
}


socketcus.dateChat = "";
/**
 * Chatting mensajes
 * @param {*} message 
 */
socketcus.htmlchatting = function(message, room, append = 1) {

    var timeampm = formatAMPM(new Date(message.time));
    var msg = fileValidation(message.msg, message.caption, message.send_tipo);

    var date_chat_temp = formatDate(message.time, '-');

    var chatting = template.htmlchatting(message, msg, socketcus.color_agent_current, socketcus.color_client_current, date_chat_temp, timeampm); // usando template

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
    var reply = "#reply" + room.replace(/\+/g, '\\+');
    var previous = "#whatspreviousfile" + room.replace(/\+/g, '\\+');
    var roomprevios = "#roomprevios" + room.replace(/\+/g, '\\+');
    var onlyroom = room.replace(/\+/g, '\\+');

    $('.sideBar-body').removeClass('sideBar-seleccionado'); // remueve la selecciones
    $(e).addClass('sideBar-seleccionado'); // agrega clase de seleccion

    $('.room-conversation').addClass('hidden'); // oculta todos los salas de conversacion
    if ($("#client" + onlyroom).length > 0) {
        // si ya existe desoculta
        $('#client' + onlyroom).removeClass('hidden');
    } else {
        // si no existe crea client{room} y agrega los chats
        $("#conversation-whats").append(`<div id="client${room}" class="room-conversation"></div>`);
        socketcus.getMessagesClient(room, new Date().toISOString());
    }

    $('.reply-conversation').addClass('hidden'); // ocultar todos los box chats
    if ($(reply).length > 0) {
        // si ya existe lo desoculta
        $(reply).removeClass('hidden');
    } else {
        // si no existe crea reply{room}
        $("#reply-whats").append(`<div id="reply${room}" class="reply-conversation"></div>`);
        socketcus.makeReply(room);
    }

    $(".roomprevios").addClass('hidden'); // ocultamos todos los previous al del room
    if ($(previous).length > 0) {
        // no hace nada
        $(roomprevios).removeClass('hidden');
    } else {
        // crear box previous
        $("#previous-whats").append(`<div id="roomprevios${room}" class="roomprevios" ><div id="whatspreviousfile${room}" class="previous-conversation whatspreviousfile hidden"></div></div>`);
        socketcus.makePrevious(room);
    }

    socketcus.headernameWhatsapp(image, client_name); // cambiar nombre e imagen del header del cliente
    socketcus.scrollend(); // scrollear hasta el final del chat
}


/**
 * 
 * Header del chat
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
 * Limpiar variables
 * 
 */
socketcus.clearfiles = function(room) {

    //variable reply
    var reply = "#reply" + room.replace(/\+/g, '\\+');
    var previous = "#whatspreviousfile" + room.replace(/\+/g, '\\+');
    var onlyroom = room.replace(/\+/g, '\\+');

    // limpiar filesTemp
    socketcus.declareFilesRoom(room);

    // Limpiar inputs files
    $(reply + "#whats_attach_multimedia").val("");
    $(reply + "#whats_attach_files").val("");

    // no usando galeria
    socketcus.usegalery[onlyroom] = false;

    // ocultar previous
    if (!$(previous).hasClass('hidden')) {
        $(previous).addClass('hidden');
        $(previous + "#file-previous").html("");
    }

    // cambiar loader button send
    $(reply + " #comment-send")[0].emojioneArea.enable();
    if (!$(reply + " #loader-send").hasClass('hidden')) {
        $(reply + " #loader-send").addClass("hidden");
        $(reply + " #message-send").removeClass("hidden");
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
    // socketcus.chatwhatsapp(null, null, 1004);
}


/**
 * 
 * 
 * 
 */
socketcus.htmlprevious = function(room, date) {

    var previ = template.previouschat(room, date); // usando template

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
    var conver = document.getElementById('conversation-whats');
    if (time) {
        setTimeout(function() {
            var conver = document.getElementById('conversation-whats');
            conver.scrollTop = conver.scrollHeight;
        }, time);
    } else if (send_tipo == null || send_tipo == 'chat' /*&& socketcus.scrollCurrent < (conver.scrollTop - 10)*/ ) {
        var conver = document.getElementById('conversation-whats');
        conver.scrollTop = conver.scrollHeight;
    } else /*if (send_tipo != 'chat')*/ {
        setTimeout(function() {
            var conver = document.getElementById('conversation-whats');
            conver.scrollTop = conver.scrollHeight;
        }, 1000);
    }

}


socketcus.scrollCurrent = 0;
$("#conversation-whats").scroll(function() {
    socketcus.scrollCurrent = $("#conversation-whats").scrollTop();
    // console.log($("#conversation-whats").scrollTop())
});


/**
 * 
 * Declarar filesTemp
 * @param {*} room 
 */
socketcus.declareFilesRoom = function(room) {
    // limpiar filesTemp
    var onlyroom = room.replace(/\+/g, '\\+');
    socketcus.filesTemp[onlyroom] = {
        file: {},
        type: "",
    };
}

/**
 * 
 * Declarar filesTemp
 * @param {*} room 
 */
socketcus.declareDataGalery = function(room) {
    // limpiar filesTemp
    var onlyroom = room.replace(/\+/g, '\\+');
    socketcus.dataGalerySelected[onlyroom] = {};
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
const _styleRe = socketcus.detectResize(); // obtener class para resize


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