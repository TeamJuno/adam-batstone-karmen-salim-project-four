// Pseudo Code
//   - User enters search term- DONE
//     - save user input into variable - DONE
//       - use the variable as the query value - DONE
//         - return all results that match the user input - DONE
//           - (displayItems()) use forEach loop on the results object to create an < li > for each and append to the < ul > on the DOM.Each < li > will be linked by the 'idDrink' from the results object. - DONE
// - Within each < li > a title and picture will display for the drink.The user can click on the title to access the recipe, which will result in another API call using the 'idDrink'.This will be displayed in a < div > next to the drink image. - DONE
// - Append / Prepend the recipe details to the ul - DONE
//   - If the user clicks on other recipes from the ul, clear the recipe details above and replace them with the new recipe details.


// // MVP Goals
// - Allow user to search recipes based on ingredient and display the matching recipes to the user

//   // Stretch Goals
//   - Once the recipe is displayed, the user can click an icon to save the recipe as a favorite.This will be added to an array that will be pushed to(localStorage).When the user refreshes the page, we will check localStorage for any saved data, parse it, and update the array with the saved drinks.
// - The saved recipes are then accessed by the nav link.

// TODO - FIX centering of modal window on resize
// TODO - make sure the drinksToDisplay arr only contains one of each drink type

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
      for (let i = 0; i <= 30; i++) {

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

// Function for displaying drinks on the DOM
cocktailApp.displayDrinks = (recipes) => {
  // Creating the UL element
  const $drinksList = $('<ul>')

  // Creating an li element for each recipe element in the array
  // TODO Possibly refactor !!!
  $.each(recipes, (index, recipe) => {
    // Appending each li to the ul
    $drinksList.append(`<li>
    <h3>${recipe.strDrink}</h3>
    <img src=${recipe.strDrinkThumb} class="drinkImg">
  </li>`)
  })

  $('.recipe-container').append($drinksList)

  cocktailApp.configureClickBehaviourOnRecipies(recipes)
}


cocktailApp.configureClickBehaviourOnRecipies = (recipes) => {

  // Getting the users click on recipie
  $('li').on('click', (e) => {

    // Variable for storing the click
    let $drinkTitile

    // Checking if the click is on the h3 or the img
    if ($(e.target).is('h3')) {
      $drinkTitle = $(e.target).text()
      $('.modal').dialog('open');
    } else if ($(e.target).is('img')) {
      $drinkTitle = $(e.target).prev().text()
      $('.modal').dialog('open');
    }

    // Finding the index number of selected drink
    const selection = recipes.findIndex((drink) => {
      return $drinkTitle === drink.strDrink
    })

    // Using the original recipe array to find the index of the selected drink
    const $drinkSelected = recipes[selection].strDrink
    cocktailApp.getRecipe($drinkSelected)
  })
}

cocktailApp.getRecipe = (drink) => {
  return $.ajax({
    url: `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`,
    method: 'GET',
    dataType: 'JSON',
  })
    .then((res) => {
      // Getting all necessary data from the recipe to use in displayRecipes function
      const cocktailRecipeArr = res.drinks
      const cocktailRecipeObj = cocktailRecipeArr[0]

      const recipeInfoObj = {
        recipeName: drink,
        ingredients: [],
        ingredientsUnits: [],
        recipeInstructions: cocktailRecipeObj.strInstructions,
        recipeImage: cocktailRecipeObj.strDrinkThumb,
      }

      // Getting the ingredients and  measurement units for the recipe and storing them in arrays
      for (const property in cocktailRecipeObj) {
        if (property.includes('strIngredient') && cocktailRecipeObj[property] !== null && cocktailRecipeObj[property] !== "") {
          recipeInfoObj.ingredients.push(cocktailRecipeObj[property])
        }
        if (property.includes('strMeasure') && cocktailRecipeObj[property] !== null && cocktailRecipeObj[property] !== "") {
          recipeInfoObj.ingredientsUnits.push(cocktailRecipeObj[property])
        }
      }

      cocktailApp.displayRecipes(recipeInfoObj)

    })
    .fail((err) => {
      console.log(err)
    })
}

// Function for displaying recipe on the DOM
cocktailApp.displayRecipes = (recipe) => {
  // Creating the UL element
  const $recipeContainer = $('<div class="modal-content">')

  const $ingredientsList = $('<ul class="ingredient-list">')

  recipe.ingredients.forEach((ingredient, index) => {
    $ingredientsList.append(`<li>${ingredient}: ${recipe.ingredientsUnits[index]}</li>`)
  })

  const $recipeContainerLeft = $(`
    <div class="recipe-container-left">
    <h3 class="recipe-name">${recipe.recipeName}</h3>
    <div class="recipe-img-container"><img src="${recipe.recipeImage}" class="recipe-img"></div>
    </div>`)

  const $recipeContainerRight = $(`
    <div class="recipe-container-right">
    <h3 class="recipe-ingredients-title">Recipe Ingredients</h3>
    <div class="recipe-ingredients-container">${$ingredientsList}</div>
    
    <div class="recipe-instructions-container"><p class="recipe-instructions">${recipe.recipeInstructions}</p></div>
    </div>`)

  $recipeContainer.append($recipeContainerLeft, $recipeContainerRight)

  $('.modal').append($recipeContainer)

}

// Function for displaying the modal
cocktailApp.displayModal = () => {

  // Selecting the modal from the DOM
  $('.modal').dialog({
    autoOpen: false,
    modal: true,
    width: '60%',
    maxWidth: 800,
    height: '60%',
    classes: {
      'ui-dialog': 'outer-modal',
      'ui-dialog-content': 'modal-content'
    },
    resizeable: false,
  })
}

// Code to kick off the app
cocktailApp.init = function () {
  cocktailApp.displayModal()
  cocktailApp.onSubmit()
}

// Everything that needs to run on page load
$(function () {
  cocktailApp.init()
})