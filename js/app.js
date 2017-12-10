/*
 * Create a list that holds all of your cards
 */
let cards = document.querySelectorAll('.card');
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
let deck = document.querySelector('.deck');
cards.forEach(function (element) {
  deck.removeChild(element);
});
// Convert cards object to array since cards is not an array but an array like object
let arr =[];
for( let i in cards ) {
    if (cards.hasOwnProperty(i)){
       arr.push(cards[i]);
    }
}
// Shuffle the cards to initialize the grid
cards = shuffle(arr);
cards.forEach(function (element) {
  element.className = 'card';
  deck.appendChild(element);
});

// Initialize all the variables and the number of moves made by the player
let moveCount = 0, foundAllMatchesCounter = 0, openCards = [], reduceStars = 0;
let moves = document.querySelector('.moves');
moves.innerHTML = moveCount/2;

let starsArray = document.querySelectorAll('.fa-star');
let modalBodyText = document.querySelector('.modal-body');
// Variables for Timer Implementation
let now, myTimer;

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 */
deck.addEventListener('click', function (event) {
  let clickedCard = event.target;
  if (!clickedCard.className.includes('show') && !clickedCard.className.includes('open')) {
    clickedCard.className += ' show open';
    moveCount += 1;
    storeOpenCards(clickedCard.innerHTML);
  }
  // Start the Game Timer when the first tile is clicked
  if (moveCount === 1)
  {
    now = Date.now();
    myTimer = setInterval(function() {
      let minutes = Math.floor(((Date.now() - now) % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor(((Date.now() - now) % (1000 * 60)) / 1000);
      document.getElementById("time-spent").innerHTML ="Timer: " + minutes + "min " + seconds + "seconds ";
    }, 1000);
  }
});

// storeOpenCards is the main function where matching of the opened card happens along with updating number of moves, stars and finally launching the modal
function storeOpenCards(cardValue) {
  let unmatchedCards = 0;
  // openCards stores the first opened card and matches it with the next open card
  // openCards will always stores the odd number move card
  if (moveCount % 2 !== 0) {
    openCards.push(cardValue);
  }
  else { // Match the second opened card with the first one
    openCards.forEach(function(element) {
      // If not a match increment the count for umatched cards
      if (element !== cardValue) {
        unmatchedCards += 1;
      }
      else {
        cards.forEach(function(el) {
          if (el.innerHTML === cardValue) {
            el.className += ' match';
          }
        });
        foundAllMatchesCounter += 1;
        remove(openCards, element);
      }
    });
    if (unmatchedCards !== 0) {
      cards.forEach(function(element) {
        if (nomatchCards(element) && moveCount % 2 === 0) {
          setTimeout(function() {
            element.className = 'card nomatch';
          }, 1);
          setTimeout(function() {
            element.className = 'card';
          }, 1200);
        }
      });
      // remove the card from the list of open cards
      openCards.pop();
    }
  }

  // Update Total number of moves and Stars based on the number of moves
  // Star Rating ->
  // 3 stars for 8 moves
  // 2 stars for > 8 and <= 16 moves
  // 1 star for > 16
  if (moveCount % 2 === 0) {
    moves.innerHTML = moveCount/2;
    if (moveCount/2 > 8 && moveCount/2 <= 16) {
      starsArray.forEach(function (element) {
        if (reduceStars === 0)
        {
          element.setAttribute('style', 'color:white');
          reduceStars += 1;
        }
      });
    }
    else if (moveCount/2 > 16) {
      starsArray.forEach(function (element) {
        if (reduceStars === 1 && element.getAttribute('style') !== 'color:white')
        {
          element.setAttribute('style', 'color:white');
          reduceStars += 1;
        }
      });
    }
  }

  // Compose Message for the Modal based on number of moves and the stars
  if (foundAllMatchesCounter === cards.length/2) {
    setTimeout(function() {
      let firstPTag = document.createElement('p');
      if ((3-reduceStars) > 1)
      {
        firstPTag.innerHTML = "With " + moveCount/2 + " moves and " + (3 - reduceStars) + " Stars!";
      }
      else if ((3-reduceStars) === 1)
      {
        firstPTag.innerHTML = "With " + moveCount/2 + " moves and " + (3 - reduceStars) + " Star!";
      }
      else if ((3 - reduceStars) === 0)
      {
        firstPTag.innerHTML = "With " + moveCount/2 + " moves.";
      }
      let secondPTag = document.createElement('p');
      secondPTag.innerHTML = "Woooooo!";
      let timeTaken = document.querySelector('#time-spent').innerHTML
      let thirdPTag = document.createElement('p');
      thirdPTag.innerHTML = "You took " + timeTaken.replace('Timer', '');

      modalBodyText.appendChild(firstPTag);
      modalBodyText.appendChild(secondPTag);
      modalBodyText.appendChild(thirdPTag);

      clearInterval(myTimer);
      // Using jQuery to implement the Bootstrap Modal
      $('#myModal').modal('show');
    }, 1000);
    foundAllMatchesCounter = 0;
  }
}

// Attaching event listener to Restart Button and initializing the deck by shuffling
let restart = document.querySelector('.restart');
restart.addEventListener('click', function(event) {
  onRestartOrPlayAgain();
});

// Attaching event listener to Play Again Button and initializing the deck by shuffling
let playAgain = document.querySelector('.btn-primary');
playAgain.addEventListener('click', function(event) {
  onRestartOrPlayAgain();
});

// Function to shuffle the deck and reset all the variables and the modal text
function onRestartOrPlayAgain(event) {
  cards = shuffle(cards);
  cards.forEach(function (element) {
    element.className = 'card';
    deck.appendChild(element);
  });
  moveCount = 0;
  moves.innerHTML = moveCount/2;
  reduceStars = 0;
  starsArray.forEach(function (element) {
    element.removeAttribute('style');
  });
  while (modalBodyText.firstChild) {
    modalBodyText.removeChild(modalBodyText.firstChild);
  };
  // Stop the Timer and reset the HTML
  document.getElementById("time-spent").innerHTML = 'Timer: 0 min 0 seconds';
  clearInterval(myTimer);
}

// Utility Functions
// Function to remove element from an array
function remove(array, element) {
  const index = array.indexOf(element);
  array.splice(index, 1);
}

// Function to find out cards that have open and show classes
function nomatchCards(element) {
  return element.className.includes('show') && element.className.includes('open') && !element.className.includes('match');
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }

  return array;
}
