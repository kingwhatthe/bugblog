
export const getPostByID = (id) => {
  return new Promise((resolve, reject)=>{
        $.ajax({
            url: './homePagePosts.php',
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
export const getNumQuestions = async () => {
    const response = await fetch('getQuizQuestions.php');
    const num = await response.json();
    return num;
}

//console log a question object
export const getQuestionInfo = async (func, num) => {
    const info = await func(num);
    console.log(info);
}

//Gets a random number between 1 and length
export const getRandomImageId = (length) => {
    return Math.ceil(Math.random() * length);
}


//returns the order from taxonomical string data
export const getOrderFromTax = (tax) =>{
    //regex to get order
    const pattern = /(?:.*, )?(\w+)$/;
    return tax.match(pattern)[1];
}