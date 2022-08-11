console.log('connected')

// Step 1: Grab HTML elements.
const getAllBtn = document.querySelector('#all')
const charBtns = document.querySelectorAll('.char-btns')
const ageForm = document.querySelector('#age-form')
const ageInput = document.querySelector('#age-input')
const createForm = document.querySelector('#create-form')
const newFirstInput = document.querySelector('#first')
const newLastInput = document.querySelector('#last')
const newGenderDropDown = document.querySelector('select')
const newAgeInput = document.querySelector('#age')
const newLikesText = document.querySelector('textarea')
const charContainer = document.querySelector('section')

// THIS IS TOTALY OPTIONAL.
// It's easier to type "baseURL" for our axios requests instead of typing in "http://localhost:4000" every time.
const baseURL = "http://localhost:4000";

// Step 2: Write your functions.

// This function was created at the start, and only serves to render out character information on our DOM.
function createCharacterCard(char) {
  let charCard = document.createElement('div')
  charCard.innerHTML = `<h3>${char.firstName} ${char.lastName}</h3>
  <p>gender: ${char.gender} | age: ${char.age}</p>
  <h4>Likes</h4>
  <ul>
    <li>${char.likes[0]}</li>
    <li>${char.likes[1]}</li>
    <li>${char.likes[2]}</li>
  </ul>`

  charContainer.appendChild(charCard)
}

// This function just clears out our HTML so we don't keep rendering the same data on top and duplicating it.
function clearCharacters() {
  charContainer.innerHTML = ``
}


// Our very first function we wrote!
// This function will send a request to the server.js file and ask for all the character objects stored over at that file.
// We will then render that character object information using the createCharacterCard() function.
function getAllChars() {
  clearCharacters();

  /*
    What's happening in this axios GET request?
    1) axios.get will take a URL as its argument, this will tell axios what piece of functionality to access on the server.
    2) The server is going to process our request (we haven't learned this yet) and will send us back some data.
    3) We will pass the data into the response parameter.
    4) The ACTUAL data is stored on response.data though, because there's a lot of extra info that comes back on that response and we don't want that.
    5) THEN let's do some stuff with the data! What we do isn't specific to axios, and actually, axios is done sending requests at this point.
  */
  // Let's send a GET request to our server to grab all the characters.
  axios.get(`${baseURL}/characters`) 
    .then((response) => {
      // Let's store our response.data onto a variable to keep track of it.
      const charactersArr = response.data;
      
      // Now let's write a for loop to go over our array, and create character cards.
      for(let i = 0; i < charactersArr.length; i++) {
        
        // Let's use that already-written-out function to render our HTML. Makes this function more readable.
        createCharacterCard(charactersArr[i]);
      }
    })
}



function getOneChar(event) {
  clearCharacters();
  
  // Let's send another GET request, but with a param this time. We will learn about how this differs from our previous GET request next week.
  // event.target.id contains the actual id (what we learned in HTML/CSS) selector attached to the character button we click.
  axios.get(`${baseURL}/character/${event.target.id}`)
    .then((response) => {
      const characterObj = response.data;

      // Because we aren't getting an array of objects back (the server will dictate what we get back), we don't need a for loop.
      createCharacterCard(characterObj);
    })
}

  /*
    What's happening in this axios POST request?
    1) axios.post will take a URL and an object as its arguments, this will tell axios what piece of functionality to access on the server.
    2) The server is going to process our request and handle our body object (we haven't learned this yet) and will send us back some response.
    3) We will pass the data into the response parameter.
    4) The ACTUAL data is stored on response.data though, because there's a lot of extra info that comes back on that response and we don't want that.
    5) THEN let's do some stuff with the data! What we do isn't specific to axios, and actually, axios is done sending requests at this point.
  */
function createNewChar(event) {
  // Prevent the side effect of auto-refreshing forms when we submit.
  event.preventDefault();

  clearCharacters();

  // Grab the input from the likes input box, copy the values, split at commas, put into new array.
  // The server is expecting an array without the commas, so we have to format it with a spread operator and using the split() method.
  let newLikes = [...newLikesText.value.split(",")];

  // Let's create this object that will be the body.
  let bodyObj = {
    firstName: newFirstInput.value, // Anything with a .value is grabbing the input in that element to pass to the server.
    lastName: newLastInput.value,
    gender: newGenderDropDown.value,
    age: newAgeInput.value,
    likes: newLikes // We don't use .value here because we are sending that newly formatted array from line 106.
  }

  // Let's send a POST request, but with an object this time. We will learn how the server accesses the bodyObj next week.
  axios.post(`${baseURL}/character`, bodyObj)
    .then((response) => {
      const newArr = response.data;

      // Same reasoning as getAllChar() function.
      for(let i = 0; i < newArr.length; i++) {
        createCharacterCard(newArr[i]);
      }
    })

    // This isn't necessary, but because we're preventing the page from refreshing, we are explicitly resetting the input values to empty strings.
    newFirstInput.value = ''
    newLastInput.value = ''
    newGenderDropDown.value = 'female'
    newAgeInput.value = ''
    newLikesText.value = ''
}

// Step 3: Assign event listeners
getAllBtn.addEventListener("click", getAllChars);

// Refer to yesterday (Interactivity/js-interactive-1-demo) for expalantion here.
for(let i = 0; i < charBtns.length; i++) {
  charBtns[i].addEventListener("click", getOneChar);
}

createForm.addEventListener("submit", createNewChar);

// Sometimes, you want functions to launch immediately. To do so, simply invoke them at the bottom without the event listener.
getAllChars();