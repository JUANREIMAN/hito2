let token;

$("#js-form").on("submit", async function(ev) {
    ev.preventDefault();

    const email = $("#js-input-email").val();
    const password = $("#js-input-password").val();

    const data = await fetch("/api/login", {

        method: 'POST',
        body: JSON.stringify({
            email: email,
            password: password
        })

    });

    const jwt = await data.json()
    token = jwt.token;
    localStorage.setItem("token", token);

    getPhotos(token);

});

function dibujar(photos) {
    // Ahora vamos a ir agregando una a una todas las fotos
    for (let photo of photos) {

        $("#images > .row").append(`
            <div class="col-4 offset-4">
                <div class="card">
                    <img class="card-img-top" src="${photo.download_url}" alt="Imagen en una Card">
                    <div class="card-body">
                        <p class="card-text">Autor: ${photo.author} </p>
                    </div>
                </div>
            </div>
        `)
    }
}

$("#salir").on("click", async function(ev) {
    ev.preventDefault();

    $("#js-form").removeClass("d-none").addClass("d-block");
    $("#images").removeClass("d-block").addClass("d-none");
    localStorage.removeItem("token");
});

(function() {

    if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token")
        getPhotos(token)
    }
})() //IIFE



async function getPhotos(token) {
    const data2 = await fetch('/api/photos?limit=10', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    photos = await data2.json();

    $("#js-form").addClass("d-none").removeClass("d-block");
    $("#images").removeClass("d-none").addClass("d-block");

    dibujar(photos.data)
}