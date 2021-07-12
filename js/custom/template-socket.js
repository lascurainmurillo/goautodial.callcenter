var template = {};

template.chatconversation = function(el, selectroom, styleRe) {

    return `<div id="list${el.client_id}" class="row sideBar-body ${(selectroom == el.client_id) ? 'sideBar-seleccionado': ''}" onclick="socketcus.select_room(this, '${el.client_id}', '${el.client_name}', ${(el.image != null) ? 'la_imagen': null})">
                <div class="${styleRe.class[0]} sideBar-avatar">
                    <div class="avatar-icon">
                        <img src="${(el.image != null) ? 'la_imagen': '/img/avatars/default/defaultAvatar.png'}">
                    </div>
                </div>
                <div class="${styleRe.class[1]} sideBar-main">
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

}


template.reply = function(room) {
    return ` <!-- Emojis -->
            <div id="what-emojis" class="dropup">
                <div class="reply-emojis dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fa fa-microphone fa-2x" aria-hidden="true"></i>
                </div>
                <ul class="dropdown-menu" aria-labelledby="what-emojis">
                    <li><a href="#">En construcción...</a></li>
                </ul>
            </div>

            <!-- Adjuntar archivo -->
            <div id="what-attach" class="dropup">
                <div class="reply-send" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fa fa-paperclip fa-2x" aria-hidden="true"></i>
                </div>
                <ul class="dropdown-menu" aria-labelledby="what-attach">
                    <li>
                        <a id="what-misdocumentos" onClick="agent.modalGalery('${room}')" ><i class="fa fa-book" aria-hidden="true" ></i> Mi galeria</a>
                    </li>
                    <li>
                        <a id="what-attach-multimedia"><i class="fa fa-picture-o" aria-hidden="true"></i> Fotos y videos</a>
                    </li>
                    <li>
                        <a id="what-attach-files"><i class="fa fa-file" aria-hidden="true"></i> Archivos</a>
                    </li>
                </ul>
            </div>

            <!-- text area -->
            <div id="what-reply" class="reply-main">
                <textarea class="" rows="1" id="comment-send"></textarea>
            </div>

            <!-- Enviar mensaje -->
            <div id="message-send" class="reply-send" onclick="socketcus.sendmessage('${room}');">
                <i class="fa fa-send fa-2x" aria-hidden="true"></i>
            </div>
            <div id="loader-send" class="reply-send hidden">
                <i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw "></i>
            </div>

            <!-- files -->
            <form method="post" action="" enctype="multipart/form-data" id="myform-multimedia" class="hidden">
                <input accept="image/png, image/jpeg, image/gif, image/jpg, video/mp4, video/avi, video/wmv" type="file" id="whats_attach_multimedia" name="file" />
            </form>
            <form method="post" action="" enctype="multipart/form-data" id="myform-files" class="hidden">
                <input accept="*/*" type="file" id="whats_attach_files" name="file" />
            </form>`;
}


template.previousimage = function(room) {
    return `<div>
                <button type="button" class="close" onclick="socketcus.clearfiles('${room}');"><span aria-hidden="true">×</span><span class="sr-only">Cerrar</span></button>
                <div id="file-previous">
                </div>
            </div>`;
}


template.previousShowVideo = function(objectURL) {
    return `<div align="center" class="embed-responsive embed-responsive-16by9" style="width: 150px;">
                <video controls loop class="embed-responsive-item">
                    <source src="${objectURL}" type="video/mp4">
                </video>
            </div>`;
}


template.previousShowImage = function(objectURL) {
    return `<div><img src="${objectURL}" alt="Imagen upload" style="height: 100%;" /></div>`;
}


template.previousShowDocument = function(objectURL) {
    return `<div><i class="fa fa-file-text-o" aria-hidden="true" style="font-size:90px"></i> </div><div>${objectURL}</div>`;
}


template.htmlchatting = function(message, msg, color_agent_current, color_client_current, date_chat_temp, timeampm) {
    return `<div class="row message-body">
                <div class="col-sm-12 message-main-${message.tipo}">
                    <div class="${message.tipo}">
                        <div class="message-cont" style="color: ${ (message.tipo == "sender" ? color_agent_current : color_client_current) }">
                            <strong>${message.user}</strong>
                        </div>
                        <div class="message-cont message-text">
                            ${msg}
                        </div>
                        <span class="message-cont message-time pull-right">${ date_chat_temp + '&nbsp;&nbsp;&nbsp;' + timeampm}</span>
                    </div>
                </div>
            </div>`;
}

template.chattingLoaderFile = function(username, color_agent_current) {
    return `<div class="row message-body">
                <div class="col-sm-12 message-main-sender">
                    <div class="sender">
                        <div class="message-cont" style="color: ${color_agent_current}">
                            <strong>${username}</strong>
                        </div>
                        <div class="message-cont message-text">
                            <div class="loader-custom-chatting">
                                <i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw "></i>
                            </div>
                            <div class="text-center">
                                Cargando...
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

}


template.previouschat = function(room, date) {
    return `<div id="message-previous${room}" class="row message-previous">
                <div class="col-sm-12 previous">
                    <a onClick="socketcus.getMessagesClient('${room}', '${date}', 0)" name="20">
                        Mostrar mensajes previos!
                    </a>
                </div>
            </div>`;
}