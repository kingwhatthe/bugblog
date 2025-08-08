
//Gets the question data for a given id (order, file location (url))
export const getQuestionByID = (id) =>{
    return new Promise((resolve, reject)=>{
        $.ajax({
            url: './getQuizQuestions.php',
            type: 'POST',
            data: {id:id},
            success: (data) => {
                console.log("Received for ID", id, ":", data);
                resolve(data);
            },
            error: (xhr, status, error) => {
                reject(error);
            }
        });
    });
    
}
//Gets the number of questions in the quiz_questions table
const getNumQuestions = async () => {
    const response = await fetch('getQuizQuestions.php');
    const num = await response.json();
    return num;
}
const getQuestionInfo = async (func, num) => {
    const info = await func(num);
    console.log(info);
}

// getQuestionInfo(getNumQuestions);
// getQuestionInfo(getQuestionByID,2);

//Gets a random number between 1 and length
const getRandomImageId = (length) => {
    return Math.ceil(Math.random() * length);
}
// console.log(randomImageId(10));

//Checks if dom is loaded
document.addEventListener("readystatechange",(event)=>{
    if(event.target.readyState === "complete"){
        console.log("readyState: complete");
        initQuiz();
    }
})


const initQuiz=()=>{

    const loadQuizInfo = async () => {

        //Load order
        const numQuestions = await getNumQuestions();
        const questions = new Array(numQuestions);
        const usedIds = new Set();
        for(let i = 0; i < numQuestions; i++){
            //Picks photo ID
            const randomNumber = getRandomImageId(numQuestions);
            if ( i !== 0 && usedIds.has(randomNumber)){
                i--;
                continue;
            }

            //Sets image to the one with the above id
            const myImage = await getQuestionByID(randomNumber);
            myImage.correct = "none";

            //adds id to used ids
            usedIds.add(randomNumber);

            //adds the image to the array
            questions[i] = myImage; 
        }

        //initiate progress bar
        const questionProgressContainer = document.querySelector(".progress");
        questionProgressContainer.textContent = `Question 1/${questions.length}`;

        let questionNumber = 0;

        //Display the first question
        //updates DOM
        const displayImage = document.querySelector(".image-container");
        displayImage.innerHTML = `<img src="${questions[questionNumber].url}">`

        //Gets guess from DOM
        const orderGuess = document.getElementById("order-guess");
        const submitButton = orderGuess.querySelector(".check-button");
        const input = orderGuess.querySelector(".text-input");
        const correctMarker = document.querySelector(".correct-marker");



        //Processes Guess
        orderGuess.addEventListener("submit", (event)=>{
            event.preventDefault();
            if (input.value !== ""){
                //filter input
                const answer = input.value.toLowerCase();
                if(answer === questions[questionNumber].order_name){
                    questions[questionNumber].correct = "true";
                    correctMarker.textContent = "Correct!";
                    correctMarker.style.backgroundColor = "rgba(0, 255, 26, 1)"
                }
                else{
                    questions[questionNumber].correct = "false";
                    correctMarker.textContent = "Incorrect!";
                    correctMarker.style.backgroundColor = "rgba(255, 0, 0, 1)"
                }
                submitButton.disabled = true;
                console.log(questions[questionNumber].order_name);
            }
            
            
        });

        const updateDom = () => {
            //updates DOM
            displayImage.innerHTML = `<img src="${questions[questionNumber].url}">`;
            questionProgressContainer.textContent = `Question ${questionNumber+1}/${questions.length}`;
            questions[questionNumber].correct !== "none" ?
            submitButton.disabled = true : submitButton.disabled = false;
            input.value = "";
            correctMarker.textContent = "";
            correctMarker.style.backgroundColor = "rgba(0, 0, 0, 0)"
        }

        //allow the incrementor to move
        // index 0 is left index 1 is right
        const arrows = document.getElementsByTagName("button");
        //Process left click
        arrows[0].addEventListener("click", (event)=>{
            questionNumber === 0 ? questionNumber : questionNumber--;
            updateDom();

        });
        //Process right click
        arrows[1].addEventListener("click", (event)=>{
            questionNumber === numQuestions-1 ? questionNumber : questionNumber++;
            updateDom();

        });
    }

    
    loadQuizInfo();

}



