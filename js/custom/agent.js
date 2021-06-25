var agent = {}

agent.objectSelected = {}; // object seleccionado para enviarlo via chat
agent.typeChat = "";
agent.tags = {
    contentImages: $("#content-images"),
    contentVideos: $("#content-videos"),
    chatGalery: $("#chat-galery") // id del modal
}

agent.modalGalery = function(room, typeChat = 'whatsapp') {

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
            id: 1,
            file: "http://localhost:3001/assets/whatsapp-files/v1.mp4",
            name: "Video 1 de mi",
            agent_username: "agentmark015",
            create_at: "2021-06-23T22:38:27.207Z",
            type: "video",
        }, {
            id: 2,
            file: "http://localhost:3001/assets/whatsapp-files/v2.mp4",
            name: "Video 2 de mi",
            agent_username: "agentmark015",
            create_at: "2021-06-23T22:38:27.207Z",
            type: "video",
        },

    ];

    // consultar archivos
    agent.arrDocument = [];



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
        agent.objectSelected = agent.arrVideos.filter(el => el.id == id)[0];
        if (agent.typeChat == "whatsapp") {
            socketcus.sendGalery(room, agent.objectSelected);
            agent.tags.chatGalery.modal('hide');
        }
    }


}

agent.uploadimage = function() {

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
                            <video autoplay loop class="embed-responsive-item">
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

agent.templateloader = function() {
    return `<div>
                <div class="loader-custom">
                    <i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw "></i>
                </div>
            </div>`;
}