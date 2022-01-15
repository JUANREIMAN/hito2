$("#form-login").on("submit", async function(ev) {
    ev.preventDefault();

    const email = $("#exampleInputEmail1").val();
    const password = $("#exampleInputPassword1").val();

    const data = await fetch("/api/login", {

        method: 'POST',
        body: JSON.stringify({
            email: email,
            password: password
        })

    });

    const jwt = await data.json()
    const token = jwt.token;
    localStorage.setItem("token", token);

    init(token);

    console.log(token);
});


async function init(token) {
    const data = await fetch("/api/total")
    const covid = await data.json();

    // drawTable(covid.data);
    // drawChart(covid);

    $("#form-login").addClass("d-none").removeClass("d-block");
    // $("#idGrafico").addClass("d-block").removeClass("d-none");
    // $("#salir").addClass("d-block").removeClass("d-none");

}

(async function() {
    const token = localStorage.getItem("token");
    if (token) {
        init(token);
    }
})()