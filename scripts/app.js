// Pseudo Code
//   - User enters search term- DONE
//     - save user input into variable - DONE
//       - use the variable as the query value - DONE
//         - return all results that match the user input - DONE
//           - (displayItems()) use forEach loop on the results object to create an < li > for each and append to the < ul > on the DOM.Each < li > will be linked by the 'idDrink' from the results object. - DONE
// - Within each < li > a title and picture will display for the drink.The user can click on the title to access the recipe, which will result in another API call using the 'idDrink'.This will be displayed in a < div > next to the drink image. - DONE
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
cocktailApp.getRecipes = function (ingredient) {
  return $.ajax({
    url: `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`,
    method: 'GET',
    dataType: 'JSON',
  })
    .then((res) => {

      // define empty arr to push a limited number of recipes to
      const drinksToDisplay = []

      // pick random 20 recipes to push back to recipesToDisplay
      for (let i = 0; i <= 20; i++) {

        // Get random recipes from the results object
        const randomRecipes = Math.floor(Math.random() * res.drinks.length)

        drinksToDisplay.push(res.drinks[randomRecipes])

      }

      // TODO figure out how to refactor this. Possibly call the function outside. Need access to recipesToDisplay
      cocktailApp.displayDrinks(drinksToDisplay)
    })
    .fail(() => {

      $('.recipe-container').html('<p class="error-text">No Results found</p>')
      $('input').trigger('focus').addClass('invalid-input')
    })
}


/* Configure Submit Behaviour
  - get the user input
  - call the getRecipes()
*/
cocktailApp.onSubmit = function () {
  $('form').on('submit', (e) => {
    e.preventDefault()

    // Clearing the recipe-container div
    $('.recipe-container').html('')
    // Setting the placeholder on the search form
    $('input')
      .attr('placeholder', "Enter an ingredient")

    // .toggleClass('invalid-input')
    // $('input').toggleClass('invalid-input')

    // Store user input in a variable
    const $userInput = $('input').val().trim()


    if ($userInput !== '') {
      $('input').removeClass('invalid-input')
      // Call the API to return recipes to the user
      cocktailApp.getRecipes($userInput)
    } else {
      $('input')
        .attr('placeholder', "Please enter a valid input")
        .addClass('invalid-input')
    }

    // Clear user input
    $('input').val('')

  })
}

// Function for displaying recipes on the DOM
cocktailApp.displayDrinks = (recipes) => {
  // Creating the UL element
  const $recipeList = $('<ul>')

  // Creating an li element for each recipe element in the array
  // TODO Possibly refactor !!!
  $.each(recipes, (index, recipe) => {
    // Appending each li to the ul
    $recipeList.append(`<li>
    <h3>${recipe.strDrink}</h3>
    <img src=${recipe.strDrinkThumb} class="drinkImg">
  </li>`)
  });

  $('.recipe-container').append($recipeList)
}

// Code to kick off the app
cocktailApp.init = function () {
  cocktailApp.onSubmit()

}


// Everything that needs to run on page load
$(function () {
  cocktailApp.init()
})