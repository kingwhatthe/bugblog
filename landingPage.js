// fetch('./homePagePosts.php')
//   .then(res => res.json())
//   .then(data => console.log(data));
// console.log("Javascript is working?");

document.addEventListener("readystatechange", (event) => {
  if(event.target.readyState === "complete"){
    console.log("readystate complete");
    initHomePage();
  }
});
const initHomePage =() => {
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

    //regex to get order
    const pattern = /(?:.*, )?(\w+)$/;

    //loop through data and display posts
    //for ranked posts:
    for(let i = 0; i < ranked.length; i++){
      const authorLastName = ranked[i].author.substring(ranked[i].author.indexOf(" "),ranked[i].author.length);
      console.log(authorLastName);

      let order = ranked[i].taxonomical_info.match(pattern)[1];
      if ((order+authorLastName).length > 26 ){
        order = order.substring(0,26-authorLastName.length-3) + "...";
      } 
      rankedScrollContainer.innerHTML += 
        `<div class = "post">
            <img src="${ranked[i].picture_url}" alt="post">
            <div class = "overlay-text"><p>${authorLastName}</p><p>${order}</p></div>
        </div>`;
    }

    //for recent posts:
    for(let i = 0; i < recents.length; i++){
      const authorLastName = recents[i].author.substring(recents[i].author.indexOf(" "),recents[i].author.length);
      console.log(authorLastName);

      let order = recents[i].taxonomical_info.match(pattern)[1];
      if ((order+authorLastName).length > 26 ){
        order = order.substring(0,26-authorLastName.length-3) + "...";
      } 
      recentsScrollContainer.innerHTML += 
        `<div class = "post">
            <img src="${recents[i].picture_url}" alt="post">
            <div class = "overlay-text"><p>${authorLastName}</p><p>${order}</p></div>
        </div>`;
    }

  }
  loadPosts();
}