//Display images on website or uploaded by user 
let smileString = document.getElementById("smileString");
let uploadForm = document.getElementById("uploadForm");


let output;

uploadForm.onsubmit = async function(e) {
    e.preventDefault();
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
            console.log(data.output);
            document.getElementById("testP").textContent =data.output;
            document.getElementById("loader").style.display = "none";
        },
        error: function(jqXHR, textStatus, error) {
            document.getElementById("loader").style.display = "none";
            console.log(error);
            document.getElementById("testP").textContent =error;
            alert("Error! No smile string was uploaded. Please try again.");
        }
    });
    return;
}

async function predict(modelInput) {

    const model = await tf.loadGraphModel('colorblind_friendly_tester/public/savedModel/model.json');

    pred = model.predict(tfImg);
    //In dataset, 0 = Friendly, 1 = Unfriendly
    let result = "";

    pred.data().then((data) => {
        document.getElementsByClassName("output_screen")[0].style.display = "flex";

        if (data > 0.5) {
            
            result = "Unfriendly";
            document.getElementById("output_text").innerHTML = "<p>Our model predicts that this image is: </p><p>" + result + " with a " + (data * 100).toFixed(2) + "% probability</p>";

        }
        else {
            result = "Friendly";
            document.getElementById("output_text").innerHTML = "<p>Our model predicts that this image is: </p><p>" + result + " with a " + (100-data * 100).toFixed(2) + "% probability</p>";

        }
        
    });
}