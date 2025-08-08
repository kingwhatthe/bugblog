fetch('./homePagePosts.php')
  .then(res => res.json())
  .then(data => console.log(data));
console.log("Javascript is working?");