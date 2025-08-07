import {imageData} from "./imageData.js";


const getQuestionByID = (id, callback) =>{
    $.ajax({
        url: './getQuizQuestions.php',
        type: 'POST',
        data: {id:id},
        success: (data) => {
            callback(data);
        }
    })
}

fetch('getQuizQuestions.php')
  .then(response => response.json())
  .then(data => {
    // console.log('PHP file returned:', data);
    // You can now use `data` in your JS
    console.log(data);
  });
  getQuestionByID(2,(data)=>{
    console.log(data);
  });


const getRandomImageId = (length) => {
    return Math.ceil(Math.random() * length);
}
// console.log(randomImageId(10));


document.addEventListener("readystatechange",(event)=>{
    if(event.target.readyState === "complete"){
        console.log("readyState: complete");
        initQuiz();
    }
})


const initQuiz=()=>{

    //Gets image data
    // try{
    //     if (!imageData){
    //         throw new Error("image file missing!");
    //     }
    //     console.log("images loaded!");
    // }
    // catch{
    //     console.error('Error Loading image file',error);
    // }
    // console.log(imageData[0].id);
    // console.log(imageData.filter(image=>{
    //     return image.id === getRandomImageId(imageData.length);
    // }));

    //Load order
    const questions = new Array(imageData.length);
    for(let i = 0; i < imageData.length; i++){
        //Picks photo ID
        const randomNumber = getRandomImageId(imageData.length);
        if ( i !== 0 && 
            questions.some(image => image && image.id === randomNumber)){
            i--;
            continue;
        }

        //Sets image to the one with the above id
        const myImage = imageData.find(image => image.id === randomNumber);
        myImage.correct = "none";
        questions[i] = myImage; 
    }

    //initiate progress bar
    const questionProgressContainer = document.getElementsByClassName("progress");
    questionProgressContainer[0].textContent = `Question 1/${questions.length}`;

    let questionNumber = 0;
    let checkCount = imageData.length;

    //Display the order in order
    //updates DOM
    const displayImage = document.getElementsByClassName("image-container");
    displayImage[0].innerHTML = `<img src="${questions[questionNumber].url}">`

    //Gets guess from DOM
    const orderGuess = document.getElementById("order-guess");
    const submitButton = orderGuess.getElementsByClassName("check-button");
    const input = orderGuess.getElementsByClassName("text-input");
    const correctMarker = document.getElementsByClassName("correct-marker")[0];



    //Processes Guess
    orderGuess.addEventListener("submit", (event)=>{
        event.preventDefault();
        if (input[0].value !== ""){
            //filter input
            const answer = input[0].value.toLowerCase();
            if(answer === questions[questionNumber].order){
                questions[questionNumber].correct = "true";
                correctMarker.textContent = "Correct!";
                correctMarker.style.backgroundColor = "rgba(0, 255, 26, 1)"
            }
            else{
                questions[questionNumber].correct = "false";
                correctMarker.textContent = "Incorrect!";
                correctMarker.style.backgroundColor = "rgba(255, 0, 0, 1)"
            }
            submitButton[0].disabled = true;
            console.log(questions[questionNumber].order);
        }
        
        
    });

    //allow the incrementor to move
    // index 0 is left index 1 is right
    const arrows = document.getElementsByTagName("button");
    //Process left click
    arrows[0].addEventListener("click", (event)=>{
        questionNumber === 0 ? questionNumber : questionNumber--;
        //updates DOM
        const displayImage = document.getElementsByClassName("image-container");
        displayImage[0].innerHTML = `<img src="${questions[questionNumber].url}">`
        questionProgressContainer[0].textContent = `Question ${questionNumber+1}/${questions.length}`;
        questions[questionNumber].correct !== "none" ?
        submitButton[0].disabled = true : submitButton[0].disabled = false;
        input[0].value = "";
        correctMarker.textContent = "";
        correctMarker.style.backgroundColor = "rgba(0, 0, 0, 0)"

    });
    //Process right click
    arrows[1].addEventListener("click", (event)=>{
        questionNumber === imageData.length-1 ? questionNumber : questionNumber++;
        //updates DOM
        const displayImage = document.getElementsByClassName("image-container");
        displayImage[0].innerHTML = `<img src="${questions[questionNumber].url}">`;
        questionProgressContainer[0].textContent = `Question ${questionNumber+1}/${questions.length}`;
        questions[questionNumber].correct !== "none" ?
        submitButton[0].disabled = true : submitButton[0].disabled = false;
        input[0].value = "";
        correctMarker.textContent = "";
        correctMarker.style.backgroundColor = "rgba(0, 0, 0, 0)"

    });



    // async function loadImageData(){
    //     try{
    //         const response = await fetch("./imageData.json");
    //         if (!response.ok){
    //             throw new Error("JSON image file missing!");
    //         }
    //         console.log("okauy!");
    //         const jsonData = await response.json();
    //         console.log(jsonData);
    //         console.log(imageData.filter((image)=>{
    //             image.id === randomImageId(2);
    //         }));
    //         return jsonData;
    //     }
    //     catch{
    //         console.error('Error Loading JSON',error);
    //     }
    // }


}



