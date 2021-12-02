const recipeSearchs = document.querySelector(".search")

const sInput = document.querySelector("input")

let menuData = []
let activateStars = function(){
  document.getElementById("Menu").addEventListener('click', function (event){
    let star = event.target
    if (star.classList.contains("fa-star")){
      star.classList.toggle("green-star")
      let attributes = star.dataset
      let label = attributes.label
      let image = attributes.image
      let url = attributes.url
      let calories = attributes.calories
      let meal = attributes.mealType
      let cuisine = attributes.cuisineType
      let dish = attributes.dishType
      let order = +attributes.order
      let nutrients = menuData[order]
      let inputData = {
        label,
        image,
        calories,
        ingredients,
        meal,
        cuisine,
        url,
        dish,
        nutrients
      }
      console.log(inputData)
      fetch("addRecipe",{
        "method": "POST",
        "headers" : {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         },
        "body": JSON.stringify(inputData)
      }).then(data =>{
        console.log(data)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  })

}

function addToMenu (recipe,index){
let currentRecipe = recipe.recipe
let menu = document.getElementById("Menu")
let iterateStep=3
if(window.innerWidth<639){
  iterateStep=1
} else if(639<=window.innerWidth && window.innerWidth<=1023){
  iterateStep=2
}
if(Math.floor(index/iterateStep) % 2){
menu.innerHTML += `
<div class="special">
    <div class="special-img img-0${index+1}">
        <a href=${currentRecipe.url} target="_blank"><img src= "${currentRecipe.image}"></a>
    </div>
    <div class="special-items spec-0${index+1}">
        <h2 class="scroll-reveal" data-origin="top" data-distance="20%">${currentRecipe.label}
        <br>
        <i class = "fa fa-star"
         data-label="${validString(currentRecipe.label)}"
         data-image=${currentRecipe.image}
         data-url=${currentRecipe.url}
         data-calories=${Number.parseInt(currentRecipe.calories)}
         data-cuisine-type=${currentRecipe.cuisineType}
         data-dish-type=${currentRecipe.dishType}
         data-meal-type=${currentRecipe.mealType}
         data-ingredients="${validString(currentRecipe.ingredientLines.join(". "))}"
         data-order=${index} >
         </i>
         </h2>
        <span class="line scroll-reveal" data-origin="top" data-distance="20%"></span>
        <p class="scroll-reveal" data-origin="bottom" data-distance="30%">${currentRecipe.cuisineType} ${currentRecipe.dishType}, ${currentRecipe.mealType}</p>
        <span class="scroll-reveal" data-origin="bottom" data-distance="60%">${Number.parseInt(currentRecipe.calories)} calories </span>
    </div>
</div>
`
}else{
  menu.innerHTML += `
  <div class="special">
      <div class="special-items spec-0${index+1}">
          <h2 class="scroll-reveal" data-origin="top" data-distance="20%">${currentRecipe.label}
          <br>
          <i class = "fa fa-star"
           data-label="${validString(currentRecipe.label)}"
           data-image=${currentRecipe.image}
           data-url=${currentRecipe.url}
           data-calories=${Number.parseInt(currentRecipe.calories)}
           data-cuisine-type=${currentRecipe.cuisineType}
           data-dish-type=${currentRecipe.dishType}
           data-meal-type=${currentRecipe.mealType}
           data-ingredients="${validString(currentRecipe.ingredientLines.join(". "))}"
           data-order=${index} >
           </i>
           </h2>
          <span class="line scroll-reveal" data-origin="top" data-distance="20%"></span>
          <p class="scroll-reveal" data-origin="bottom" data-distance="30%">${currentRecipe.cuisineType} ${currentRecipe.dishType}, ${currentRecipe.mealType}</p>
          <span class="scroll-reveal" data-origin="bottom" data-distance="60%">${Number.parseInt(currentRecipe.calories)} calories </span>
      </div>
      <div class="special-img img-0${index+1}">
          <a href=${currentRecipe.url} target="_blank"><img src= "${currentRecipe.image}"></a>
      </div>
  </div>
  `
}
}

function clearTemplate(){
  document.getElementById("Menu").innerHTML = ""
}



function validString(string){
  return string.replace(/"/gi,"'")
}

recipeSearchs.addEventListener("click",function(){
    var search = sInput.value
    sInput.value=""
    const url = `https://api.edamam.com/search?q=${search}&ingr=12&time=30&app_id=1e77532d&app_key=f85d1a2472b0f4835ada53850740ab5f`
    clearTemplate()
    activateStars()

  fetch(url).then(res => res.json()).then(data => {
    console.log("fetching data")
    console.log(data);
    menuData = data.hits.map(menu=>{
      return {
        "totalNutrients":  menu.recipe.totalNutrients,
        "totalDaily": menu.recipe.totalDaily,
      }

      })
      console.log(menuData)

    data.hits.forEach((recipe,index) => addToMenu(recipe,index));
  })

})
