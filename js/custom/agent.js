var agent = {}
console.log("estoy en agente");
agent.objectSelected = []; // object seleccionado para enviarlo via chat
agent.tags = {
    contentImages: $("#content-images")
}

agent.modalGalery = function(room, typeChat = 'whatsapp') {

    // inicializando
    agent.arrImages = []; // todas las imagenes
    agent.arrVideos = []; // todos los videos
    agent.arrFiles = []; // todos los files

    // activar modal
    $("#chat-galery").modal();

    // consultar
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
        thumbImagesHtml += agent.templateimage(el);
    });

    if (agent.arrImages.length > 0) {
        agent.tags.contentImages.html(thumbImagesHtml);
    } else {
        agent.tags.contentImages.html(`<div class="col-xs-12"><div class="text-center" >No hay ninguna imagen</div></div>`);
    }



}

agent.templateimage = function(img) {
    return `<div class="col-xs-12 col-sm-12 col-md-6">
                <div class="thumbnail-content">
                    <div class="thumbnail">
                        <div class="image-content" style="background-image: url(${img.image});">
                            <!-- <img src="${img.image}" alt="${img.name}"> -->
                        </div>
                        <div class="caption">
                            <h3>${img.name}</h3>
                            <p>
                                <button class="btn btn-success" role="button" onclick="agent.galeryImageSelected('${img.id}', 'image')">
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

agent.galeryImageSelected = function(id, type) {

    if (type == "image") {
        agent.arraySelected = agent.arrImages.filter(el => el.id == id);
        console.log(agent.arraySelected);
    }

}

agent.uploadimage = function() {

}