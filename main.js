var openedFile = false;
let csvArray;
window.onload = () => {
    $("#fileOpen").on("drop", ev => {
        ev.preventDefault();
        files = ev.originalEvent.target.files || ev.originalEvent.dataTransfer.files;
        file = files[0];
        if (file.type == "text/csv" && !openedFile) {

            var reader = new FileReader();
            reader.onload = function (event) {
                let result = atob(event.target.result.slice(21));
                render(result);
                openedFile = true;
            };
            reader.readAsDataURL(files[0]);
        }
    });
    $("#fileOpen").on("dragover", ev => {
        ev.preventDefault();
    });
};

function render(csv) {
    csvArray = csv.split(/\n/);
    for (let i = 0; i < csvArray.length; i++) {
        csvArray[i] = csvArray[i].split(/\,/);
    }
    let totalArray = [];
    for (let i = 0; i < csvArray[0].length - 1; i++) {
        totalArray[i] = 0;
    }
    for (let i = 1; i < csvArray.length; i++) {
        if (csvArray[0].length != csvArray[i].length) {
            openedFile = false;
            alert("Make sure that you provide a valid csv file. With no blank lines. All lines should have the same number of entries.");
            window.location.reload();
        }
        for (let j = 1; j < csvArray[i].length; j++) {
            if (csvArray[i][j] == "") {
                csvArray[i][j] = csvArray[i][j - 1];
            } else {
                csvArray[i][j] = parseFloat(csvArray[i][j]);
            }
            totalArray[j - 1] = totalArray[j - 1] + csvArray[i][j];
        }
    }

    for (let i = 0; i < csvArray[0].length - 1; i++) {
        totalArray[i] = (totalArray[i] / ((csvArray.length - 1) * 100)) * 100;
    }

    console.log(csvArray);
    console.log(totalArray);


    // switch to dash view
    $("#fileOpen").hide();
    $("#dashGUI").show();


    // convert this to html code to display
    $("#barView").append(`<div class="bar" style="background: linear-gradient(90deg, var(--nord${pickColor(totalArray.at(-1))}) ${totalArray.at(-1)}%, var(--nord8) 0);" id="totalBar"><span>Total</span><span class="barPercent">${Math.round((totalArray.at(-1) + Number.EPSILON) * 100) / 100}%</span></div>`);

    let outString = "";
    for (let i = 1; i < csvArray.length; i++) {
        let percent = csvArray[i].at(-1);
        let name = csvArray[i][0];
        outString += `<div class="bar" onmouseover="normalChartGen(${i})" style="background: linear-gradient(90deg, var(--nord${pickColor(percent)}) ${percent}%, var(--nord8) 0);" id="normalBar"><span>${name}</span><span class="barPercent">${Math.round((percent + Number.EPSILON) * 100) / 100}%</span></div>`;
    }

    $("#barView").append(`<div id="normalBarWrapper">${outString}</div>`);

    //add graphs
    $("#dashGUI").append(`<div id="totalChartWrapper"><canvas id="totalLine"></canvas></div>`);


    new Chart(
        document.getElementById('totalLine'),
        {
            type: 'line',
            data: {
                labels: csvArray[0].slice(1,),
                datasets: [{
                    label: 'totalLine',
                    data: totalArray,
                    color: "#8FBCBB",
                    backgroundColor: "#88C0D0",
                    borderColor: "#88C0D0"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'Total Over Time',
                        color: "#81A1C1"
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        grid: {
                            color: "#81A1C1"
                        },
                        title: {
                            display: true,
                            text: "Percentage Correct",
                            color: "#81A1C1"
                        },
                        ticks: {
                            color: "#81A1C1"
                        }
                    },
                    x: {
                        grid: {
                            color: "#81A1C1"
                        },
                        ticks: {
                            color: "#81A1C1"
                        }
                    },

                }
            }
        }
    );
}

function normalChartGen(index) {
    $("#normalChartWrapper").remove();
    $("#dashGUI").append(`<div id="normalChartWrapper"><canvas id="normalLine"></canvas></div>`);
    new Chart(
        document.getElementById('normalLine'),
        {
            type: 'line',
            data: {
                labels: csvArray[0].slice(1,),
                datasets: [{
                    label: 'totalLine',
                    data: csvArray[index].slice(1,),
                    color: "#8FBCBB",
                    backgroundColor: "#88C0D0",
                    borderColor: "#88C0D0"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: `${csvArray[index][0]} Over Time`,
                        color: "#81A1C1"
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        grid: {
                            color: "#81A1C1"
                        },
                        title: {
                            display: true,
                            text: "Percentage Correct",
                            color: "#81A1C1"
                        },
                        ticks: {
                            color: "#81A1C1"
                        }
                    },
                    x: {
                        grid: {
                            color: "#81A1C1"
                        },
                        ticks: {
                            color: "#81A1C1"
                        }
                    },

                }
            },
        }
    );
}

function pickColor(percent) {
    if (percent < 25)
        return "11";
    else if (percent < 50)
        return "12";
    else if (percent < 75)
        return "13";
    else
        return "14";
}