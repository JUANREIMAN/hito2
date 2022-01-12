(async function() {
    const data = await fetch("/api/total")
    const covid = await data.json();
    drawChart(covid);
    drawTable(covid);



})()

$('#verdetalle').on('click', function() {

    alert("Llegué");

    $("#exampleModal .modal-body").html("<h1>Hola, soy un modal</h1>");
    $("#exampleModal").modal("show");

});

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

function drawTable(covid) {
    console.log("Llegué a dibujar la tabla")
}