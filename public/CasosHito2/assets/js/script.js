$("#form-login").on("submit", async function(ev) {
    ev.preventDefault();

    const email = $("#exampleInputEmail1").val();
    const password = $("#exampleInputPassword1").val();
    console.log(email);
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

});

async function init(token) {
    const data = await fetch("/api/total")
    const covid = await data.json();

    drawTable(covid.data);
    drawChart(covid);

    $("#form-login").addClass("d-none").removeClass("d-block");
    $(".table").addClass("d-block").removeClass("d-none");
    $("#idGrafico").addClass("d-block").removeClass("d-none");
    $("#navHito").addClass("d-block").removeClass("d-none");

}

(async function() {
    const token = localStorage.getItem("token");
    if (token) {
        init(token);
    }
})()

let filterArrayCovid;

function drawChart(covid) {

    filterArrayCovid = covid.data.filter(pais => pais.deaths > 100000);

    let covidConfirmados = new Array();
    let covidMuertos = new Array();

    for (pais of filterArrayCovid) {
        covidConfirmados.push({ label: pais.location, y: pais.confirmed });
        covidMuertos.push({ label: pais.location, y: pais.deaths });
    }

    let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title: {
            text: "Paises con Covid19"
        },
        axisY: {
            title: "Casos de covid Confirmados",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC"
        },
        axisY2: {
            title: "Muertos por Covid",
            titleFontColor: "#C0504E",
            lineColor: "#C0504E",
            labelFontColor: "#C0504E",
            tickColor: "#C0504E"
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: [{
                type: "column",
                name: "confirmados",
                legendText: "confirmados",
                showInLegend: true,
                dataPoints: covidConfirmados
            },
            {
                type: "column",
                name: "muertos",
                legendText: "muertos",
                axisYType: "secondary",
                showInLegend: true,
                dataPoints: covidMuertos
            }
        ]
    });

    chart.render();

    function toggleDataSeries(e) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }

}

const ArrayPaises = [];

function drawTable(datos) {
    let i = 0;
    for (const dato of datos) {
        if (dato.deaths >= 100000) {
            $('.table').append(`<tr>
                <th scope="row">${i}</th>
                <td>${dato.location}</td>
                <td>${dato.confirmed}</td>
                <td>${dato.deaths}</td>
                <td>${dato.recovered}</td>
                <td>${dato.active}</td>
                <td><button onclick="GraficoModal(${i})" class="btn btn-primary"> ver detalle </button></td>
                </tr>
        `)
            ArrayPaises.push(dato.location);
            i++
        }
    }
}

async function GraficoModal(ind) {
    const data = await fetch(`/api/countries/${ArrayPaises[ind]}`);
    const data2 = await data.json();

    console.log(data2.data);

    $("#exampleModal").modal("show");


    let chart = new CanvasJS.Chart("chartContainerModal", {
        animationEnabled: true,
        title: {
            text: `País con covid 19:${ArrayPaises[ind]}`
        },
        axisY: {
            title: "Casos de covid",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC"
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: [{
            type: "column",
            name: "confirmados",
            legendText: "Numeros de casos",
            showInLegend: true,
            dataPoints: [
                { label: "confirmados", y: data2.data.confirmed },
                { label: "Muertos", y: data2.data.deaths },
                { label: "recuperados", y: data2.data.recovered },
                { label: "activos", y: data2.data.active },
            ]
        }]
    });

    chart.render();

    function toggleDataSeries(e) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }

}

$('#cerrarSesion').on('click', async function(ev) {
    ev.preventDefault();
    $('#exampleInputEmail1').val("");
    $('#exampleInputPassword1').val("");

    $("#form-login").addClass("d-block").removeClass("d-none");
    $(".table").addClass("d-none").removeClass("d-block");
    $("#idGrafico").addClass("d-none").removeClass("d-block");
    $("#navHito").addClass("d-none").removeClass("d-block");
    localStorage.removeItem("token");

});

$('#home').on('click', async function(ev) {
    ev.preventDefault();

    $(".table").addClass("d-block").removeClass("d-none");
    $("#idGrafico").addClass("d-block").removeClass("d-none");

});


$('#situacionChile').on('click', async function(ev) {
    ev.preventDefault();

    $(".table").addClass("d-none").removeClass("d-block");
    $("#idGrafico").addClass("d-none").removeClass("d-block");

    alert("Estoy en situacion de chile");

    // const data = await fetch(`/api/confirmed`);
    // const data2 = await data.json();

    // console.log(data2);

});

const getChileInfo = () => {
    const token = localStorage.getItem("token");
    Promise.all([
            'http://localhost:3000/api/confirmed',
            'http://localhost:3000/api/deaths',
            'http://localhost:3000/api/recovered'
        ].map(url =>
            fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(resp => resp.json())
        )).then(response => {
            console.log(response);
        })
        .catch(err => {
            console.error(err)
            localStorage.clear()
            toggleLinks()
        })
}