var openedFile = false;
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
    let csvArray = csv.split(/\n/);
    for (let i = 0; i < csvArray.length; i++) {
        csvArray[i] = csvArray[i].split(/\,/);
    }
    let totalArray = [];
    for (let i = 0; i < csvArray.length-2; i++) {
        totalArray[i]=0;
    }
    for (let i = 1; i < csvArray.length; i++) {
        for (let j = 1; j < csvArray.length - 1; j++) {
            if (csvArray[i][j] == "") {
                csvArray[i][j] = csvArray[i][j-1];
            } else {
                csvArray[i][j] = parseFloat(csvArray[i][j]);
            }
            totalArray[j-1]=totalArray[j-1]+csvArray[i][j];
        }
    }

    for (let i = 0; i < csvArray.length-2; i++) {
        totalArray[i]=(totalArray[i]/((csvArray.length-1)*100))*100;
    }

    console.log(csvArray);
    console.log(totalArray);

    //TODO convert this to html code to display
    //TODO add graphs
    //TODO switch to dash view
}