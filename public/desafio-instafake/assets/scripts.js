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

    const data2 = await fetch('/api/photos?limit=10', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    photos = await data2.json();

    // console.log(photos)
    dibujar(photos.data)
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

$("#borrar").on("click", async function(ev) {
    ev.preventDefault();

    $("#form-principal").removeClass("d-block").addClass("d-none");
    $("#images").removeClass("d-none").addClass("d-block");
});