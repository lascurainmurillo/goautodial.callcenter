socketcus = {}
socketcus.socket = null;
socketcus.init = function() {
    socketcus.socket = io.connect('https://goautodial-node.herokuapp.com', { 'forceNew': true });
}

// escuchar notify leadgen
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