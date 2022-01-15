var agent = {}

agent.objectSelected = {}; // object seleccionado para enviarlo via chat
agent.typeChat = "";
agent.room = "";
agent.tags = {
    contentImages: $("#content-images"),
    contentVideos: $("#content-videos"),
    contentDocument: $("#content-documents"),
    chatGalery: $("#chat-galery"), // id del modal
    modalFormUploadGalery: $("#form-upload-galery"), // formulario de modal upload
    modalUploadGalery: $("#upload-galery"), // modal upload files
    modaldeleteGalery: $("#delete-galery") // modal eliminar
}

agent.loadVar = function(domain, agent_username) {
    agent.domain = domain;
    agent.agent_username = agent_username;
}



agent.modalGalery = async(room, typeChat = 'whatsapp') => {

    agent.objectSelected = {}; // object seleccionado para enviarlo via chat
    agent.room = room;

    // inicializando
    agent.arrImages = []; // todas las imagenes
    agent.arrVideos = []; // todos los videos
    agent.arrDocument = []; // todos los files
    agent.typeChat = typeChat;

    // activar modal
    agent.tags.chatGalery.modal();

    // activar loader
    agent.tags.contentImages.html(agent.templateloader());

    var result = await agent.getFileGalery();

    agent.arrImages = (result.filter(el => el.tipo == 'image')[0] != null ? result.filter(el => el.tipo == 'image')[0].data : []);
    agent.arrVideos = (result.filter(el => el.tipo == 'video')[0] != null ? result.filter(el => el.tipo == 'video')[0].data : []);
    agent.arrDocument = (result.filter(el => el.tipo == 'document')[0] != null ? result.filter(el => el.tipo == 'document')[0].data : []);

    // console.log(agent.arrImages);

    // crear tags para IMAGENES
    agent.crearTagDeFile(agent.room, 'arrImages', 'contentImages', 'images', agent.templateimage);

    // crear tags para VIDEOS
    agent.crearTagDeFile(agent.room, 'arrVideos', 'contentVideos', 'videos', agent.templatevideo);

    // crear tags para Documentos
    agent.crearTagDeFile(agent.room, 'arrDocument', 'contentDocument', 'documents', agent.templatedocument);

}

/**
 * 
 * Crear tags y vistas de imagenes, videos y documentos
 * 
 */
agent.crearTagDeFile = function(room, nameArray, contentFile, nametipo, funtiontemplate) {
    var thumbHtml = "";
    agent[nameArray].forEach(el => {
        thumbHtml += funtiontemplate(el, room);
    });

    if (agent[nameArray].length > 0) {
        agent.tags[contentFile].html(thumbHtml);
    } else {
        agent.tags[contentFile].html(`<div id="not-found-${nametipo}" class="col-xs-12"><div class="text-center" style="height: 500px">No hay ninguna ${nametipo}</div></div>`);
    }
}


/**
 * 
 * 
 * @param {*} id 
 * @param {*} room 
 * @param {*} type 
 */
agent.galerySelected = function(id, room, type) {
    if (type == "image") {
        agent.objectSelected = agent.arrImages.filter(el => el._id == id)[0];
        if (agent.typeChat == "whatsapp") {
            socketcus.sendGalery(room, agent.objectSelected); // enviar info a socket
            agent.tags.chatGalery.modal('hide');
        }
    }
    if (type == "video") {
        agent.objectSelected = agent.arrVideos.filter(el => el._id == id)[0];
        if (agent.typeChat == "whatsapp") {
            socketcus.sendGalery(room, agent.objectSelected); // enviar info a socket
            agent.tags.chatGalery.modal('hide');
        }
    }
    if (type == "document") {
        agent.objectSelected = agent.arrDocument.filter(el => el._id == id)[0];
        if (agent.typeChat == "whatsapp") {
            socketcus.sendGalery(room, agent.objectSelected); // enviar info a socket
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
        $("#upload-galery #myModalLabel").html("Subir video"); // cambiar titulo del modal upload
        agent.tags.modalFormUploadGalery.html(agent.templateuploadgaleryVideo());
    } else {
        $("#upload-galery #myModalLabel").html("Subir documento"); // cambiar titulo del modal upload
        agent.tags.modalFormUploadGalery.html(agent.templateuploadgaleryDocument());
    }
}


/**
 * 
 * Agregar nuevo data al arrImages, arrVideos o arrDocument y mostrar en pantalla 
 * @param {*} data 
 */
agent.pushArray = function(data) {
    if (data.tipo == 'image') {
        agent.arrImages.push(data);
        agent.tags.contentImages.prepend(agent.templateimage(data, agent.room));
        agent.tags.contentImages.children("#not-found-images").remove();
    }
    if (data.tipo == 'video') {
        agent.arrVideos.push(data);
        agent.tags.contentVideos.prepend(agent.templatevideo(data, agent.room));
        agent.tags.contentVideos.children("#not-found-videos").remove();
    }
    if (data.tipo == 'document') {
        agent.arrDocument.push(data);
        agent.tags.contentDocument.prepend(agent.templatedocument(data, agent.room));
        agent.tags.contentDocument.children("#not-found-documents").remove();
    }
}

/**
 * 
 * Agregar nuevo data al arrImages, arrVideos o arrDocument y mostrar en pantalla 
 * @param {*} data 
 */
agent.deleteArray = function(_id, tipo) {
    if (tipo == 'image') {
        agent.arrImages = agent.arrImages.filter(el => el._id != _id);
        console.log(agent.arrImages);
        $("#t-" + agent.delete_id).remove(); //eliminar de la vista
        if (agent.arrImages.length <= 0) {
            agent.tags.contentImages.html(`<div id="not-found-images" class="col-xs-12"><div class="text-center" style="height: 500px">No hay ninguna Imagen</div></div>`);
        }
    }
    if (tipo == 'video') {
        agent.arrVideos = agent.arrVideos.filter(el => el._id != _id);
        $("#t-" + agent.delete_id).remove(); //eliminar de la vista
        if (agent.arrVideos.length <= 0) {
            agent.tags.contentVideos.html(`<div id="not-found-videos" class="col-xs-12"><div class="text-center" style="height: 500px">No hay ninguna Imagen</div></div>`);
        }
    }
    if (tipo == 'document') {
        agent.arrDocument = agent.arrDocument.filter(el => el._id != _id);
        $("#t-" + agent.delete_id).remove(); //eliminar de la vista
        if (agent.arrDocument.length <= 0) {
            agent.tags.contentDocument.html(`<div id="not-found-documents" class="col-xs-12"><div class="text-center" style="height: 500px">No hay ninguna Imagen</div></div>`);
        }
    }
}

/**
 * 
 * Abrir modal delete
 * 
 */
agent.delete_id = "";
agent.delete_tipo = "";
agent.modalDelete = function(id, tipo) {
    agent.delete_id = id;
    agent.delete_tipo = tipo;
    agent.tags.modaldeleteGalery.modal();
}


/**
 * 
 * Ejecutar submit de Btn SUBIR
 * @param {*} evt 
 * @param {*} type 
 */
agent.uploadGalery = function(evt, type) {
    evt.preventDefault();
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

    var btn1 = $("#btn-upl-gal1");
    var btn2 = $("#btn-upl-gal2");
    btn1.addClass('hidden');
    btn2.removeClass('hidden');

    var fd = new FormData();
    fd.append('file', $(form).find(`[name='file']`)[0].files[0]);
    fd.append('name', $(form).find(`[name='filename']`).val());
    fd.append('tipo', $(form).find(`[name='tipo']`).val());
    fd.append('agent_username', agent.agent_username);

    $.ajax({
        url: agent.domain + '/galery/file',
        type: 'POST',
        data: fd,
        contentType: false,
        processData: false,
        success: function(response) {
            if (response.ok) {
                agent.pushArray(response.data);
                agent.tags.modalUploadGalery.modal('hide');
            }
            console.log(agent.arrImages);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
    }).always(function(response) {
        btn1.removeClass('hidden');
        btn2.addClass('hidden');
    });
}



agent.getFileGalery = async() => {
    let result;
    try {

        result = await $.ajax({
            url: socketcus.domain + '/galery/file',
            type: 'GET',
            data: {},
            datatype: 'json',
        });

        return result;
    } catch (error) {
        console.error(error);
        alert(error);
    }
}


agent.deleteGalery = () => {
    $.ajax({
        url: agent.domain + '/galery/file/' + agent.delete_id,
        type: 'DELETE',
        data: {},
        success: function(response) {
            if (response.ok) {
                agent.deleteArray(agent.delete_id, agent.delete_tipo); // borrar object de la lista de files segun el tipo
                agent.tags.modaldeleteGalery.modal('hide');
            }
            // agent.arrImages = result.filter(el => el.tipo == 'image')[0].data;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
    }).always(function(response) {

    });
}


/** ----------- TEMPLATE -------------------------------------------------------------------------------------------------------------- */
agent.templateimage = function(img, room) {
    return `<div id="t-${img._id}" class="col-xs-12 col-sm-12 col-md-6">
                <div class="thumbnail-content">
                    <div class="thumbnail">
                        <div class="image-content" style="background-image: url('${img.file}');"></div>
                        <div class="caption">
                            ${agent.btnbottomthumb(img, room, 'image')}
                        </div>
                    </div>
                </div>
            </div>`;
}

agent.templatevideo = function(vid, room) {
    return `<div id="t-${vid._id}" class="col-xs-12 col-sm-12 col-md-6">
                <div class="thumbnail-content">
                    <div class="thumbnail">
                        <div align="center" class="embed-responsive embed-responsive-16by9">
                            <video loop class="embed-responsive-item" controls>
                                <source src="${vid.file}" type="video/mp4">
                            </video>
                        </div>
                        <div class="caption">
                            ${agent.btnbottomthumb(vid, room, 'video')}
                        </div>
                    </div>
                </div>
            </div>
            `;
}

agent.templatedocument = function(doc, room) {
    return `<div id="t-${doc._id}" class="col-xs-12 col-sm-6 col-md-4 col-lg-4" style="margin-top: 10px;">
                <div class="panel panel-default">
                    <div class="panel-body">
                        <div class="text-center">
                            <i class="fa fa-file-text-o" aria-hidden="true" style="font-size:90px; color: #3c8dbc;"></i> 
                        </div>
                        <div>
                            ${agent.btnbottomthumb(doc, room, 'document')}
                        </div>
                    </div>
                </div>
            </div>`;
}


agent.btnbottomthumb = function(data, room, tipo) {
    return `<h4>${data.name}</h4>
            <p>
                <button class="btn btn-success" role="button" onclick="agent.galerySelected('${data._id}', '${room}', '${tipo}')">
                    <i class="fa fa-check-circle" aria-hidden="true"></i> Seleccionar
                </button>
                <button class="btn btn-danger" type="button" role="button" onclick="agent.modalDelete('${data._id}', '${tipo}')">
                    <i class="fa fa-trash" aria-hidden="true"></i> Eliminar
                </button>
            </p>`;
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
                <input name="tipo" type="text" class="hidden" value="image" required>
            </div>
            <div>
                <button id="btn-upl-gal1" onclick="agent.uploadGalery(event, 'image');" type="button" class="btn btn-warning">Subir</button>
                <button id="btn-upl-gal2" type="button" class="btn btn-warning hidden">
                    <i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw "></i>
                </button>
            </div>`;
}

agent.templateuploadgaleryVideo = function() {
    return `<div class="">
                <label for="upload-galery-video">Subir video</label>
                <input name="file" type="file" accept="video/mp4, video/avi, video/wmv" id="upload-galery-video"  required/>
            </div>
            <div class="form-group">
                <label for="filename">Nombre</label>
                <input name="filename" type="text" class="form-control" id="filename" placeholder="Nombre del archivo" required>
                <input name="tipo" type="text" class="hidden" value="video" required>
            </div>
            <div>
                <button id="btn-upl-gal1" onclick="agent.uploadGalery(event, 'video');" type="button" class="btn btn-warning">Subir</button>
                <button id="btn-upl-gal2" type="button" class="btn btn-warning hidden">
                    <i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw "></i>
                </button>
            </div>`;
}

agent.templateuploadgaleryDocument = function() {
    return `<div class="">
                <label for="upload-galery-document">Subir documento</label>
                <input name="file" type="file" id="upload-galery-document"  required/>
            </div>
            <div class="form-group">
                <label for="filename">Nombre</label>
                <input name="filename" type="text" class="form-control" id="filename" placeholder="Nombre del archivo" required>
                <input name="tipo" type="text" class="hidden" value="document" required>
            </div>
            <div>
                <button id="btn-upl-gal1" onclick="agent.uploadGalery(event, 'document');" type="button" class="btn btn-warning">Subir</button>
                <button id="btn-upl-gal2" type="button" class="btn btn-warning hidden">
                    <i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw "></i>
                </button>
            </div>`;
}