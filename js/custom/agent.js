var agent = {}

agent.objectSelected = {}; // object seleccionado para enviarlo via chat
agent.typeChat = "";
agent.tags = {
    contentImages: $("#content-images"),
    chatGalery: $("#chat-galery") // id del modal
}

agent.modalGalery = function(room, typeChat = 'whatsapp') {

    // inicializando
    agent.arrImages = []; // todas las imagenes
    agent.arrVideos = []; // todos los videos
    agent.arrFiles = []; // todos los files
    agent.typeChat = typeChat;

    // activar modal
    agent.tags.chatGalery.modal();

    // activar loader
    agent.tags.contentImages.html(agent.templateloader());

    // consultar Imagenes
    agent.arrImages = [{
            id: 1,
            image: "http://localhost:3001/assets/whatsapp-files/i1.jpg",
            name: "Imange 1 de mi",
            agent_username: "agentmark015",
            create_at: "2021-06-23T22:38:27.207Z",
            type: "image",
        }, {
            id: 2,
            image: "http://localhost:3001/assets/whatsapp-files/i2.jpg",
            name: "Imange 1 de mi",
            agent_username: "agentmark015",
            create_at: "2021-06-23T22:38:27.207Z",
            type: "image",
        },
        {
            id: 3,
            image: "http://localhost:3001/assets/whatsapp-files/i3.png",
            name: "Imange 1 de mi",
            agent_username: "agentmark015",
            create_at: "2021-06-23T22:38:27.207Z",
            type: "image",
        },
        {
            id: 4,
            image: "http://localhost:3001/assets/whatsapp-files/i4.jpg",
            name: "Imange 1 de mi",
            agent_username: "agentmark015",
            create_at: "2021-06-23T22:38:27.207Z",
            type: "image",
        }
    ];

    // crear tags para IMAGENES
    var thumbImagesHtml = "";
    agent.arrImages.forEach(el => {
        thumbImagesHtml += agent.templateimage(el, room);
    });

    setTimeout(function() {

        if (agent.arrImages.length > 0) {
            agent.tags.contentImages.html(thumbImagesHtml);
        } else {
            agent.tags.contentImages.html(`<div class="col-xs-12"><div class="text-center" style="height: 500px">No hay ninguna imagen</div></div>`);
        }

    }, 2000);


}


agent.galeryImageSelected = function(id, room, type) {
    console.log(id, room, type);
    if (type == "image") {
        agent.objectSelected = agent.arrImages.filter(el => el.id == id)[0];
        if (agent.typeChat == "whatsapp") {
            socketcus.sendGalery(room, agent.objectSelected, type);
            agent.tags.chatGalery.modal('hidden');
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
                        <div class="image-content" style="background-image: url(${img.image});">
                            <!-- <img src="${img.image}" alt="${img.name}"> -->
                        </div>
                        <div class="caption">
                            <h3>${img.name}</h3>
                            <p>
                                <button class="btn btn-success" role="button" onclick="agent.galeryImageSelected('${img.id}', '${room}', 'image')">
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

agent.templateloader = function() {
    return `<div>
                <div class="loader-custom">
                    <i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw "></i>
                </div>
            </div>`;
}