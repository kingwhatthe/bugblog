import {getOrderFromTax, redirectToPostId} from "./functions.js";

const getPostsBySearch = (query, searchBy, sortBy) =>{
    return new Promise((resolve, reject)=>{
        $.ajax({
            url: './searchPosts.php',
            type: 'POST',
            data: {query:query, searchBy:searchBy, sortBy:sortBy},
            success: (data) => {
                console.log("Received for query", query, ":", data);
                resolve(data);
            },
            error: (xhr, status, error) => {
                reject(error);
            }
        });
    });
}




document.addEventListener("readystatechange", (event) => {
  if(event.target.readyState === "complete"){
    console.log("readystate complete");
    initSearchPage();
  }
});

//updates posts
const searchPosts = async () => {

    //Updates filter
    let currentSelection = "Order";
    const currentFilter = document.querySelector("#first-button");
    const secondButton = document.querySelector("#second-button");
    const thirdButton = document.querySelector("#third-button");

    secondButton.addEventListener("click",(event)=>{
        currentFilter.value = secondButton.value;
        secondButton.value = currentSelection;
        currentSelection = currentFilter.value;
    });
    thirdButton.addEventListener("click",(event)=>{
        currentFilter.value = thirdButton.value;
        thirdButton.value = currentSelection;
        currentSelection = currentFilter.value;
    });

    const posts = document.querySelector(".search-post-container");

    //Get values from the searchbar
    const searchBar = document.querySelector(".search-input");
    const searchButton = document.querySelector(".drop-down-button-container");
    const searchInput = searchButton.querySelector("input");

    searchBar.addEventListener("input", async (event)=>{
        console.log(currentSelection + " " + searchBar.value);
        posts.innerHTML = "";
        //get the post data
        const postData = await getPostsBySearch(searchBar.value,currentSelection.toLowerCase(),"date_posted");
        !postData[0] || postData[0].length === 0 ? console.log("nothing found") : console.log("something found");
        console.log(postData[0]);

        //update dom with post data
        for (let i = 0; i<postData.length; i++){
            posts.innerHTML += `<div id = "post_${postData[i].id}" class = "search-post">
                    <img src="${postData[i].picture_url}" alt="">
                    <div class ="search-post-desc">
                        <div class = "info">
                            <div class = "info-row">
                                <p class = "order">${getOrderFromTax(postData[i].taxonomical_info)}</p>
                                <p class = "location">${postData[i].location}</p>
                            </div>
                            <div class = "info-row">
                                <p class = "author">${postData[i].author}</p>
                                <p class = "description">${postData[i].description}</p>
                            </div>
                        </div>
                        <div class = "rank">${postData[i].rank}</div>
                    </div>
                </div>`;
            console.log(posts);
        }
        if (!postData[0] || postData[0].length === 0){
            posts.innerHTML = "No Posts Found!";
        }
        else{
            //check if search items are clicked
            for (let i = 0; i<postData.length; i++){
                const post = posts.querySelector(`#post_${postData[i].id}`);
                console.log(post);
                post.addEventListener("click", (event) => {
                    redirectToPostId(postData[i].id);
                })
            }
        }

        
        
    });

    


    // for ()
}
const initSearchPage = () => {
    searchPosts();
}
