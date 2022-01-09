$("#js-form").on("submit", async function(ev) {
    ev.preventDefault();

    const email = $("#js-input-email").val();
    const password = $("#js-input-password").val();

    const data = await fetch("/api/login", {

        method: 'POST',
        body: {
            email: email,
            password: password
        }

    });

    const jwt = await data.json()
    console.log(jwt)

});