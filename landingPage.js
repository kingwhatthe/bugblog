import { getOrderFromTax, getPostByID, redirectToPostId } from "./functions.js";


document.addEventListener("readystatechange", (event) => {
  if(event.target.readyState === "complete"){
    console.log("readystate complete");
    initHomePage();
  }
});
const initHomePage =() => {
  //Loads the Post of the Week (decided by id)
  const loadPOW = async (id) =>{
    //get pow data
    const powData = await getPostByID(id);
    
    //update dom

    //get dom elements
    const powContainer = document.querySelector(".post-of-week");
    const powImage = powContainer.querySelector("img");
    const author = powContainer.querySelector('.author');
    const order = powContainer.querySelector('.order');
    const rank = powContainer.querySelector('.rank');
    const location = powContainer.querySelector('.location');

    //replace content
    powImage.setAttribute("src", powData.picture_url);
    author.textContent = powData.author;
    order.textContent = getOrderFromTax(powData.taxonomical_info);
    rank.textContent = "Rank: " + powData.rank;
    location.textContent = powData.location;

  }
  //Load ranked and recent posts for landingPage
  const loadPosts = async () =>{
    //get the data
    const response = await fetch('./homePagePosts.php');
    const data = await response.json();
    const ranked = data.ranked;
    const recents = data.recents;
    console.log(ranked);

    //get containers
    const rankedContainer = document.querySelector(".top-ranked");
    const rankedScrollContainer = rankedContainer.querySelector(".scroll");
    const recentsContainer = document.querySelector('.recents')
    const recentsScrollContainer = recentsContainer.querySelector(".scroll");


    //loop through data and display posts
    //for ranked posts:
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


    //for recent posts:
    for(let i = 0; i < recents.length; i++){
      const authorLastName = recents[i].author.substring(recents[i].author.indexOf(" "),recents[i].author.length);
      console.log(authorLastName);

      let order = getOrderFromTax(recents[i].taxonomical_info);
      if ((order+authorLastName).length > 26 ){
        order = order.substring(0,26-authorLastName.length-3) + "...";
      } 
      recentsScrollContainer.innerHTML += 
        `<div id = "post_2${recents[i].id}" class = "post">
            <img src="${recents[i].picture_url}" alt="post">
            <div class = "overlay-text"><p>${authorLastName}</p><p>${order}</p></div>
        </div>`;
    }
    document.querySelectorAll(".recents .post").forEach((post, index) => {
      post.addEventListener("click", () => {
          redirectToPostId(recents[index].id);
      });
    });


  }
  loadPosts();
  //Post of the week is #2
  loadPOW(2);
  const scrollContainers = document.querySelectorAll(".scroll");

  //Creates event listeners for both scroll containers
  for (let i = 0; i<scrollContainers.length; i++){
    scrollContainers[i].addEventListener("wheel", (evt) => {
      evt.preventDefault();
      
      if (evt.deltaY >= -15 && evt.deltaY <= 15) {
        scrollContainers[i].scrollLeft += (evt.deltaY * 40);
      } 
      else {
          scrollContainers[i].scrollLeft += (evt.deltaY * 5);
      }
    });
  }
}