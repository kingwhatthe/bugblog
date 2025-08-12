import { getPostByID, getOrderFromTax, redirectToPostId } from "./functions.js";

document.addEventListener("readystatechange", (event) => {
  if(event.target.readyState === "complete"){
    console.log("readystate complete");
    initPostPage();
  }
});
const initPostPage = async () => {

    //get ranked posts
    const response = await fetch('./homePagePosts.php');
    const data = await response.json();
    const ranked = data.ranked;

    //get post
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id");
    if(id){
        const post = await getPostByID(id);
        console.log("Post recieved: " + post);

        //get dom elements
        const info = document.querySelector(".post-info");
        const img = info.querySelector("img");
        const author = info.querySelector(".author");
        const order = info.querySelector(".order");
        const rank = info.querySelector(".rank");
        const location = info.querySelector(".location");
        const description = info.querySelector(".post-description");

        //update dom elements
        img.setAttribute("src",post.picture_url);
        author.textContent = "By: " + post.author;
        order.textContent = "Taxonomy: " + post.taxonomical_info;
        rank.textContent = post.rank;
        location.textContent = post.location;
        description.innerHTML = post.description;
        
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
    else{
        console.error("error: post id not found")
    }
    
}