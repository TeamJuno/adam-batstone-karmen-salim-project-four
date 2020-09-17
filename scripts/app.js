// Pseudo Code
//   - User enters search term- DONE
//     - save user input into variable - DONE
//       - use the variable as the query value - DONE
//         - return all results that match the user input - DONE
//           - (displayItems()) use forEach loop on the results object to create an < li > for each and append to the < ul > on the DOM.Each < li > will be linked by the 'idDrink' from the results object.
// - Within each < li > a title and picture will display for the drink.The user can click on the title to access the recipe, which will result in another API call using the 'idDrink'.This will be displayed in a < div > next to the drink image.
// - Append / Prepend the recipe details to the ul
//   - If the user clicks on other recipes from the ul, clear the recipe details above and replace them with the new recipe details.


// // MVP Goals
// - Allow user to search recipes based on ingredient and display the matching recipes to the user

//   // Stretch Goals
//   - Once the recipe is displayed, the user can click an icon to save the recipe as a favorite.This will be added to an array that will be pushed to(localStorage).When the user refreshes the page, we will check localStorage for any saved data, parse it, and update the array with the saved drinks.
// - The saved recipes are then accessed by the nav link.



// App Object
const cocktailApp = {}



// API Call
cocktailApp.getRecipes = function(ingredient) {
  return $.ajax({
    url: `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`,
    method: 'GET',
    dataType: 'JSON',
  })
  .then((res)=>{
    // define empty arr to push a limited number of recipes to
    const recipesToDisplay = []

    // pick random 20 recipes to push back to recipesToDisplay
    for(let i = 0; i<= 20; i++) {

      // Get random recipes from the results object
      const randomRecipes = Math.floor(Math.random() * res.drinks.length)
      console.log('randomRecipes:', randomRecipes)

      recipesToDisplay.push(res.drinks[randomRecipes])
      console.log('recipesToDisplay',recipesToDisplay)
    }
  })
  .fail((err) => {
    console.log(err)
  })
}


/* Configure Submit Behaviour
  - get the user input
  - call the getRecipes()
*/
cocktailApp.onSubmit = function () {
  $('form').on('submit', (e) => {
    e.preventDefault()
    console.log('Form submit is working..')
    console.log('event target:', e.target)

    // Store user input in a variable
    const $userInput = $('input').val().trim()
    console.log('$userInput:', $userInput)

    // Call the API to return recipes to the user
    cocktailApp.getRecipes($userInput)

  })
}


// Code to kick off the app
cocktailApp.init = function () {
  cocktailApp.getRecipes()
  cocktailApp.onSubmit()
}


// Everything that needs to run on page load
$(function(){
  cocktailApp.init()
})