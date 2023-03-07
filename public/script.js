//Display images on website or uploaded by user 
let smileString = document.getElementById("smileString");
let uploadForm = document.getElementById("uploadForm");
let uploadCSV = document.getElementById("uploadCSV");



smileStringCSV.onchange = function() {
    if(this.files[0].size > 5242880){
       alert("Your uploaded file is too big. Please choose a file under 5MBs");
       this.value = "";
    };
};


let output;

uploadForm.onsubmit = function(e) {
    e.preventDefault();
    document.getElementById("moleImage").style.display = "none";
    let smile = smileString.value;
    if (smileString.value == ""){
        console.log("Your smile string is empty.");
    }
    document.getElementById("loader").style.display = "inline";
    jQuery.ajax({
        method: 'POST',
        url: '/upload',
        data: {
            smileString: smile
        },
        success: function(data) {
            console.log("Success");
            document.getElementById("testP").textContent =data.output+" cm-1";
            document.getElementById("loader").style.display = "none";
            document.getElementById("moleImage").src = "uploads/"+data.imageID+".png";
            document.getElementById("moleImage").style.display = "inline";
        },
        error: function(jqXHR, textStatus, error) {
            document.getElementById("loader").style.display = "none";
            console.log("invalid SMILE string...");
            document.getElementById("testP").textContent = "";
            alert("Error! An invalid SMILE string was uploaded. Please try again.");
        }
    });
    return;
}


uploadCSV.onsubmit = async function(e) {
    e.preventDefault();
    document.getElementById("moleImage").style.display = "none";
    if (!smileStringCSV.files[0]){
        alert("You did not upload a CSV file. Please upload a file and submit it again.");
        return;
    }
    let formData = new FormData();
    formData.append("smileStringCSV", smileStringCSV.files[0]);
    for (var data of formData) {
        console.log(data);
    }
    document.getElementById("loader").style.display = "inline";

    jQuery.ajax({
        method: 'POST',
        url: '/uploadCSV',
        data: formData,
        contentType: false,
        processData: false,
        success: function(data) {
            document.getElementById("testP").textContent =data.output+"cm-1";
            document.getElementById("loader").style.display = "none";
        },
        error: function(jqXHR, textStatus, error) {
            document.getElementById("loader").style.display = "none";
            console.log(error);
            document.getElementById("testP").textContent =error;
            alert("Error! Please try again with a better CSV file.");
        }
    });
    return;
}
