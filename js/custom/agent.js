var agent = {}

agent.objectSelected = {}; // object seleccionado para enviarlo via chat
agent.typeChat = "";
agent.tags = {
    contentImages: $("#content-images"),
    contentVideos: $("#content-videos"),
    contentDocument: $("#content-documents"),
    chatGalery: $("#chat-galery"), // id del modal
    modalFormUploadGalery: $("#form-upload-galery"), // formulario de modal upload
    modalUploadGalery: $("#upload-galery") // modal upload files
}

agent.modalGalery = function(room, typeChat = 'whatsapp') {

    agent.objectSelected = {}; // object seleccionado para enviarlo via chat

    // inicializando
    agent.arrImages = []; // todas las imagenes
    agent.arrVideos = []; // todos los videos
    agent.arrDocument = []; // todos los files
    agent.typeChat = typeChat;

    // activar modal
    agent.tags.chatGalery.modal();

    // activar loader
    agent.tags.contentImages.html(agent.templateloader());

    // consultar Imagenes
    agent.arrImages = [{
            id: 1,
            file: "http://localhost:3001/assets/whatsapp-files/i1.jpg",
            name: "Imange 1 de mi",
            agent_username: "agentmark015",
            create_at: "2021-06-23T22:38:27.207Z",
            type: "imagen",
        }, {
            id: 2,
            file: "http://localhost:3001/assets/whatsapp-files/i2.jpg",
            name: "Imange 1 de mi",
            agent_username: "agentmark015",
            create_at: "2021-06-23T22:38:27.207Z",
            type: "imagen",
        },
        {
            id: 3,
            file: "http://localhost:3001/assets/whatsapp-files/i3.png",
            name: "Imange 1 de mi",
            agent_username: "agentmark015",
            create_at: "2021-06-23T22:38:27.207Z",
            type: "imagen",
        },
        {
            id: 4,
            file: "http://localhost:3001/assets/whatsapp-files/i4.jpg",
            name: "Imange 1 de mi",
            agent_username: "agentmark015",
            create_at: "2021-06-23T22:38:27.207Z",
            type: "imagen",
        }
    ];


    // consultar Videos
    agent.arrVideos = [{
        id: 5,
        file: "http://localhost:3001/assets/whatsapp-files/v1.mp4",
        name: "Video 1 de mi",
        agent_username: "agentmark015",
        create_at: "2021-06-23T22:38:27.207Z",
        type: "video",
    }, {
        id: 6,
        file: "http://localhost:3001/assets/whatsapp-files/v2.mp4",
        name: "Video 2 de mi",
        agent_username: "agentmark015",
        create_at: "2021-06-23T22:38:27.207Z",
        type: "video",
    }, ];


    // consultar Archivos
    agent.arrDocument = [{
        id: 7,
        file: "http://localhost:3001/assets/whatsapp-files/a1.txt",
        name: "Dcoumento 1 de mi",
        agent_username: "agentmark015",
        create_at: "2021-06-23T22:38:27.207Z",
        type: "document",
    }, {
        id: 8,
        file: "http://localhost:3001/assets/whatsapp-files/a2.sql",
        name: "Dcoumento 3 de mi",
        agent_username: "agentmark015",
        create_at: "2021-06-23T22:38:27.207Z",
        type: "document",
    }, {
        id: 9,
        file: "http://localhost:3001/assets/whatsapp-files/a3.txt",
        name: "Dcoumento 2 de mi",
        agent_username: "agentmark015",
        create_at: "2021-06-23T22:38:27.207Z",
        type: "document",
    }, {
        id: 10,
        file: "http://localhost:3001/assets/whatsapp-files/a4.txt",
        name: "Dcoumento 4 de mi",
        agent_username: "agentmark015",
        create_at: "2021-06-23T22:38:27.207Z",
        type: "document",
    }];


    setTimeout(function() {

        // crear tags para IMAGENES
        var thumbImagesHtml = "";
        agent.arrImages.forEach(el => {
            thumbImagesHtml += agent.templateimage(el, room);
        });

        if (agent.arrImages.length > 0) {
            agent.tags.contentImages.html(thumbImagesHtml);
        } else {
            agent.tags.contentImages.html(`<div class="col-xs-12"><div class="text-center" style="height: 500px">No hay ninguna imagen</div></div>`);
        }

        // crear tags para VIDEOS
        var thumbVideosHtml = "";
        agent.arrVideos.forEach(el => {
            thumbVideosHtml += agent.templatevideo(el, room);
        });
        if (agent.arrVideos.length > 0) {
            agent.tags.contentVideos.html(thumbVideosHtml);
        } else {
            agent.tags.contentVideos.html(`<div class="col-xs-12"><div class="text-center" style="height: 500px">No hay ningun video</div></div>`);
        }

        // crear tags para Documentos
        var thumbDocumentHtml = "";
        agent.arrDocument.forEach(el => {
            thumbDocumentHtml += agent.templatedocument(el, room);
        });
        if (agent.arrDocument.length > 0) {
            agent.tags.contentDocument.html(thumbDocumentHtml);
        } else {
            agent.tags.contentDocument.html(`<div class="col-xs-12"><div class="text-center" style="height: 500px">No hay ningun video</div></div>`);
        }

    }, 2000);

}


agent.galerySelected = function(id, room, type) {
    console.log(id, room);
    if (type == "image") {
        agent.objectSelected = agent.arrImages.filter(el => el.id == id)[0];
        if (agent.typeChat == "whatsapp") {
            socketcus.sendGalery(room, agent.objectSelected);
            agent.tags.chatGalery.modal('hide');
        }
    }
    if (type == "video") {
        agent.objectSelected = agent.arrVideos.filter(el => el.id == id)[0];
        if (agent.typeChat == "whatsapp") {
            socketcus.sendGalery(room, agent.objectSelected);
            agent.tags.chatGalery.modal('hide');
        }
    }
    if (type == "document") {
        agent.objectSelected = agent.arrDocument.filter(el => el.id == id)[0];
        if (agent.typeChat == "whatsapp") {
            socketcus.sendGalery(room, agent.objectSelected);
            agent.tags.chatGalery.modal('hide');
        }
    }


}

/**
 * Abrir modal de upload file
 * @param {*} type 
 */
agent.modaluploadimage = function(type) {
    agent.tags.modalUploadGalery.modal(); // open modal
    if (type == "image") {
        $("#upload-galery #myModalLabel").html("Subir imagen"); // cambiar titulo del modal upload
        agent.tags.modalFormUploadGalery.html(agent.templateuploadgaleryImage());
    } else if (type == 'video') {

    } else {

    }
}

/**
 * 
 * Boton subir
 * @param {*} e 
 * @param {*} type 
 */
agent.uploadimagen = function(e, type) {
    agent.tags.modalFormUploadGalery.trigger('submit');
}


/**
 * 
 * Ejecutar validacion
 * 
 */
agent.tags.modalFormUploadGalery.validate({
    errorClass: 'error text-danger',
    submitHandler: (form) => {
        agent.postFileGalery(form);
    }
});


/**
 * 
 * Ajax post file galery
 * @param {*} form 
 * 
 */
agent.postFileGalery = function(form) {

    var fd = new FormData();
    fd.append('file', $(form).find(`[name='file']`)[0].files[0]);
    fd.append('filename', $(form).find(`[name='filename']`).val());
    fd.append('type', $(form).find(`[name='type']`).val());


    $.ajax({
        url: socketcus.domain + '/whatsapp/send-file',
        type: 'POST',
        data: fd,
        contentType: false,
        processData: false,
        success: function(response) {
            console.log(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
    }).always(function(response) {

    });

}


/** ----------- TEMPLATE -------------------------------------------------------------------------------------------------------------- */
agent.templateimage = function(img, room) {
    return `<div class="col-xs-12 col-sm-12 col-md-6">
                <div class="thumbnail-content">
                    <div class="thumbnail">
                        <div class="image-content" style="background-image: url(${img.file});"></div>
                        <div class="caption">
                            <h3>${img.name}</h3>
                            <p>
                                <button class="btn btn-success" role="button" onclick="agent.galerySelected('${img.id}', '${room}', 'image')">
                                    <i class="fa fa-check-circle" aria-hidden="true"></i> Seleccionar
                                </button>
                                <button class="btn btn-danger" role="button" onclick="agent.galeryImageDelete('${img.id}')">
                                    <i class="fa fa-trash" aria-hidden="true"></i> Eliminar
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>`;
}

agent.templatevideo = function(vid, room) {
    return `<div class="col-xs-12 col-sm-12 col-md-6">
                <div class="thumbnail-content">
                    <div class="thumbnail">
                        <div align="center" class="embed-responsive embed-responsive-16by9">
                            <video loop class="embed-responsive-item" controls>
                                <source src="${vid.file}" type="video/mp4">
                            </video>
                        </div>
                        <div class="caption">
                            <h3>${vid.name}</h3>
                            <p>
                                <button class="btn btn-success" role="button" onclick="agent.galerySelected('${vid.id}', '${room}', 'video')">
                                    <i class="fa fa-check-circle" aria-hidden="true"></i> Seleccionar
                                </button>
                                <button class="btn btn-danger" role="button" onclick="agent.galeryImageDelete('${vid.id}')">
                                    <i class="fa fa-trash" aria-hidden="true"></i> Eliminar
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            `;
}

agent.templatedocument = function(doc, room) {
    return `<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4" style="margin-top: 10px;">
                <div class="panel panel-default">
                    <div class="panel-body">
                        <div class="text-center">
                            <i class="fa fa-file-text-o" aria-hidden="true" style="font-size:90px; color: #3c8dbc;"></i> 
                        </div>
                        <div>
                            <h4>${doc.name}</h4>
                            <p>
                                <button class="btn btn-success" role="button" onclick="agent.galerySelected('${doc.id}', '${room}', 'document')">
                                    <i class="fa fa-check-circle" aria-hidden="true"></i> Seleccionar
                                </button>
                                <button class="btn btn-danger" role="button" onclick="agent.galeryImageDelete('${doc.id}')">
                                    <i class="fa fa-trash" aria-hidden="true"></i> Eliminar
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>`;
}


agent.templateloader = function() {
    return `<div>
                <div class="loader-custom">
                    <i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw "></i>
                </div>
            </div>`;
}


agent.templateuploadgaleryImage = function() {
    return `<div class="">
                <label for="upload-galery-image">Subir imagen</label>
                <input name="file" type="file" accept="image/png, image/jpeg, image/gif, image/jpg" id="upload-galery-image"  required/>
            </div>
            <div class="form-group">
                <label for="filename">Nombre</label>
                <input name="filename" type="text" class="form-control" id="filename" placeholder="Nombre del archivo" required>
                <input name="type" type="text" class="hidden" value="image" required>
            </div>
            <div>
                <button onlick="agent.uploadimagen(this, 'image');" type="text" class="btn btn-warning">Subir</button>
            </div>`;
}

agent.templateuploadgaleryVideo = function() {
    return `<input accept="video/mp4, video/avi, video/wmv" type="file" id="upload-galery-image" name="file" />`;
}

agent.templateuploadgaleryDocument = function() {
    return `<input accept="*/*" type="file" id="upload-galery-document" name="file" />`;
}