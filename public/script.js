//Contains code for submitting each form to the server and retrieving the output to display in the HTML.

let smileString = document.getElementById("smileString");
let uploadForm = document.getElementById("uploadForm");
let uploadCSV = document.getElementById("uploadCSV");


//Verifiy that the smileStringCSV is not too large. 5MBs is our current limit. Subject to change.
smileStringCSV.onchange = function() {
    if(this.files[0].size > 5242880){
       alert("Your uploaded file is too big. Please choose a file under 5MBs");
       this.value = "";
    };
};

//Jquery request to submit smileString to backend. 
uploadForm.onsubmit = function(e) {
    e.preventDefault();
    //Clear what could have previously been displayed.
    document.getElementById("moleImage").style.display = "none";
    document.getElementById("csvDownload").style.display = "none";
    document.getElementById("testP").textContent = "";

    //Verify the smileString is not empty.
    let smile = smileString.value;
    if (smileString.value == ""){
        alert("Your smile string is empty. Please try again.");
        return;
    }
    //Show loader icon (see CSS)
    document.getElementById("loader").style.display = "inline";
    
    //Send jQuery POST with smileString as JSON.
    jQuery.ajax({
        method: 'POST',
        url: '/upload',
        data: {
            smileString: smile
        },
        success: function(data) {
            //If successful, display results
            //console.log("Success");
            document.getElementById("testP").innerHTML= data.output+"cm "+"<sup>-1</sup>";
            document.getElementById("loader").style.display = "none";
            //Show a generated image of the smileString
            document.getElementById("moleImage").src = "uploads/"+data.imageID+".png";
            document.getElementById("moleImage").style.display = "inline";
        },
        error: function(jqXHR, textStatus, error) {
            //If there is an error, alert the user and clear it.
            document.getElementById("loader").style.display = "none";
            //console.log("invalid SMILE string...");
            document.getElementById("testP").textContent = "";
            alert("Error! An invalid SMILE string was uploaded. Please try again.");
        }
    });
    return;
}

//Same jQuery request as function above, but now with a CSV file upload. 
uploadCSV.onsubmit = async function(e) {
    e.preventDefault();
    //Clear what could have previously been displayed.
    document.getElementById("moleImage").style.display = "none";
    document.getElementById("csvDownload").style.display = "none";
    document.getElementById("testP").textContent = "";

    //Verify that a CSV was uploaded.
    if (!smileStringCSV.files[0]){
        alert("You did not upload a CSV file. Please upload a file and submit it again.");
        return;
    }
    
    //Create and send form data to server
    let formData = new FormData();
    formData.append("smileStringCSV", smileStringCSV.files[0]);

    //Show loader icon (see CSS)
    document.getElementById("loader").style.display = "inline";

    //jQuery POST with CSV as formData.
    jQuery.ajax({
        method: 'POST',
        url: '/uploadCSV',
        data: formData,
        contentType: false,
        processData: false,
        success: function(data) {
            //If correct, display the new generated CSV file and download link.
            document.getElementById("loader").style.display = "none";
            document.getElementById("csvDownload").href = data.path;
            document.getElementById("csvDownload").style.display = "inline";
        },
        error: function(jqXHR, textStatus, error) {
            //If there is an error, alert the user and clear it.
            document.getElementById("loader").style.display = "none";
            //console.log("invalid CSV file...");
            alert("Error! Please try again with a better CSV file.");
        }
    });
    return;
}
