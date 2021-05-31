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
    socketcus.selectroom = "";
    socketcus.agent_username = agent_username;

    socketcus.colores = ["red", "blue", "burlywood", "fuchsia", "yellow", "peachpuff", "orange", "limegreen"];
    socketcus.color_client_current = "";
    socketcus.color_agent_current = "";
    socketcus.room = {};
}

/* Al momento que contesta un cliente la llamada */
socketcus.chatwhatsapp = function(client_id, client_name, list_id) {

    socketcus.selectroom = client_id;
    const data_room = {
        agent_username: socketcus.agent_username,
        client_id,
        client_name,
        room: client_id,
    }

    // Color para cliente y agent actual
    socketcus.color_client_current = socketcus.getcolor();
    socketcus.color_agent_current = socketcus.getcolor();

    // Crear sala
    socketcus.socket.emit('joinRoom', data_room);

    // Get room and users
    socketcus.socket.on('roomUsers', ({ room, clients }) => {
        // console.log(clients);
        var list = "";
        clients.forEach(el => {
            list = list + `<div class="row sideBar-body">
                                <div class="col-sm-3 col-xs-3 sideBar-avatar">
                                    <div class="avatar-icon">
                                        <img src="/img/avatars/default/defaultAvatar.png">
                                    </div>
                                </div>
                                <div class="col-sm-9 col-xs-9 sideBar-main">
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
        });

        // var color = ["red", "blue", "burlywood", "fuchsia", "yellow", "peachpuff", "orange", "limegreen"];
        // console.log(Math.floor(Math.random() * color.length));


        var elegi = [];
        elegi[room] = "";
        $("#list-clients").html(list);
    });

    // Escuchar mensajes de whatsapp
    socketcus.socket.on('message', message => {
        console.log("--------------- RESULT -----------------");
        console.log(message);
        var color = ["red", "blue", "burlywood", "fuchsia", "yellow", "peachpuff", "orange", "limegreen"];
        // if (message.type == "sender") {
        var chatting = `<div class="row message-body">
                                <div class="col-sm-12 message-main-sender">
                                    <div class="${message.type}">
                                        <div style="color: ${ (message.type == "sender" ? socketcus.color_agent_current : socketcus.color_client_current) }">
                                            <strong>Agente015</strong>
                                        </div>
                                        <div class="message-text">
                                            ${message.msg}
                                        </div>
                                        <span class="message-time pull-right">${message.time}</span>
                                    </div>
                                </div>
                            </div>
                        `;
        // }

        $("#conversation-whats").append(chatting);
        // Scroll down
        var conver = document.getElementById('conversation-whats');
        conver.scrollTop = conver.scrollHeight;
    });

}

/* Emitir mensaje */
socketcus.sendmessage = function(client_id, client_name, list_id) {

    var msg_original = $('#comment-send').val();
    const data_call = {
        agent_username: socketcus.agent_username,
        client_id,
        client_name,
        list_id,
        room: socketcus.selectroom, // phone number
        message: {
            user: socketcus.agent_username,
            msg: msg_original,
            tipo: 'sender'
        },
    }

    // Emitir un mensaje hacia el server
    socketcus.socket.emit('chatMessage', data_call);
    var msg = $("#comment-send").val().replace(/\n/g, "");

    $("#comment-send").val("");
    $('#comment-send').focus();
}

// Presionar enter para enviar mensaje
$('#comment-send').keypress(function(event) {
    var com = $('#comment-send');
    if (event.keyCode != 13) return;
    socketcus.sendmessage(com.attr("client_id"), com.attr("client_name"), com.attr("list_id"));
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