import { getNumQuestions, getQuestionByID, getRandomImageId, getOrderFromTax } from "./functions.js";


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

            //adds id to used ids
            usedIds.add(randomNumber);

            //Sets image to the one with the above id
            const myImage = await getQuestionByID(randomNumber);
            if (myImage.in_quiz == 0) {continue;}
            myImage.correct = "none";



            //adds the image to the array
            questions[i] = myImage; 
        }
        if (questions.length ==0){console.error("error: no questions found!")};

        //initiate progress bar
        const questionProgressContainer = document.querySelector(".progress");
        questionProgressContainer.textContent = `Question 1/${questions.length}`;

        let questionNumber = 0;

        //Display the first question
        //updates DOM
        const displayImage = document.querySelector(".image-container");
        displayImage.innerHTML = `<img src="${questions[questionNumber].picture_url}">`

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
                const order = getOrderFromTax(questions[questionNumber].taxonomical_info).toLowerCase();
                if(answer === order){
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
                console.log(order);
            }
            
            
        });

        const updateDom = () => {
            //updates DOM
            displayImage.innerHTML = `<img src="${questions[questionNumber].picture_url}">`;
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
    const loadPosts = async () =>{
        //get ranked posts
        const response = await fetch('./homePagePosts.php');
        const data = await response.json();
        const ranked = data.ranked;

        //display ranked posts
        //get containers
        const rankedContainer = document.querySelector(".top-ranked");
        const rankedScrollContainer = rankedContainer.querySelector(".scroll");
        for(let i = 0; i < ranked.length; i++){
              const authorLastName = ranked[i].author.substring(ranked[i].author.indexOf(" "),ranked[i].author.length);
              console.log(authorLastName);
        
              let order = getOrderFromTax(ranked[i].taxonomical_info);
              if ((order+authorLastName).length > 26 ){
                order = order.substring(0,26-authorLastName.length-3) + "...";
              } 
              rankedScrollContainer.innerHTML += 
                `<div id = "post_1${ranked[i].id}" class = "post">
                    <img src="${ranked[i].picture_url}" alt="post">
                    <div class = "overlay-text"><p>${authorLastName}</p><p>${order}</p></div>
                </div>`;
        
        }
        document.querySelectorAll(".top-ranked .post").forEach((post, index) => {
            post.addEventListener("click", () => {
                redirectToPostId(ranked[index].id);
            });
        });
    }
        

    loadPosts();
    loadQuizInfo();

}



