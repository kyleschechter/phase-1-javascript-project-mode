document.addEventListener('DOMContentLoaded', () => {
  // Clicking on Get Started button drops down menu to select player

  const getStartedButton = document.getElementById('get-started')
  const buttonParagraph = document.getElementById('get-started-p')
  const playerSelect = document.querySelector('.player-container')
  const introHeader = document.querySelector('h2')
  let newPlayer = false
  // let newPlayer = true;

  getStartedButton.addEventListener('click', (e) => {
    e.preventDefault()
    console.log('Clicked')
    newPlayer = !newPlayer
    // Could we delete this?
    if (newPlayer) {
      // Maybe if (!newPlayer) here?
      playerSelect.style.display = 'block'
      introHeader.style.display = 'none'
      getStartedButton.style.display = 'none'
      buttonParagraph.style.margin = '0px'
    } else {
      playerSelect.style.display = 'none'
      introHeader.style.display = 'inline'
    }
  })

  // DELIVERABLE: When a player is selected in the dropdown menu, their name, position, number, and height/weight will be filered into the card

  const searchPlayerURL = 'https://www.balldontlie.io/api/v1/players?search='
  const position = document.querySelector('#player-position')
  const fullName = document.querySelector('#player-name')
  const number = document.querySelector('#player-num')
  const selectedPlayer = document.querySelector('#menu')
  const sellButton = document.querySelector('#sell-div')

  selectedPlayer.addEventListener('change', (e) => {
    e.preventDefault()
    fetch(`${searchPlayerURL}${selectedPlayer.value.slice(3)}`)
      .then(resp => resp.json())
      .then(playerData => {
        position.innerHTML = playerData.data[0].position
        fullName.innerHTML = playerData.data[0].first_name + ' ' + playerData.data[0].last_name
        sellButton.className = fullName.innerHTML // Have a look at the "HTML Element data attribute" <button id="sell" data-player-name="Labron" /

        // Some players in the database don't have height and weight available, so players without them only include their number in the number section of the card
        if (playerData.data[0].height_feet && playerData.data[0].height_inches && playerData.data[0].weight_pounds !== 'null') {
          number.innerHTML = `#${e.target.value.slice(0, 2)} - ${playerData.data[0].height_feet}'${playerData.data[0].height_inches}" - ${playerData.data[0].weight_pounds}lbs.`
        } else {
          number.innerHTML = `#${e.target.value.slice(0, 2)}`
        }
        e.target.value = ''
      })
  })

  // DELIVERABLE: When an image URL is submitted, the card background becomes that image

  const addPlayerButton = document.querySelector('#add-player-button')
  const imgUrl = document.querySelector('#player-image')
  const cardBackground = document.querySelector('.card-background')
  addPlayerButton.addEventListener('click', (e) => {
    e.preventDefault()
    cardBackground.style.background = `url("${imgUrl.value}")`
    cardBackground.style.backgroundSize = 'cover'
    cardBackground.style.backgroundPositionX = 'center'
    cardBackground.style.backgroundRepeat = 'no-repeat'
    imgUrl.value = ''
  })

  // DELIVERABLE: Add event listeners to each edit dropdown that change the respective color of that section of the card

  const namePlateColor = document.querySelector('#name-plate-color')
  namePlateColor.value = ''
  namePlateColor.addEventListener('change', (e) => {
    e.preventDefault()
    fullName.style.color = `${e.target.value}`
    e.target.value = ''
  })

  const namePlateBackground = document.querySelector('#name-plate-background-color')
  namePlateBackground.value = ''
  const frameFooter = document.querySelector('.frame-footer')
  namePlateBackground.addEventListener('change', (e) => {
    e.preventDefault()
    frameFooter.style.background = `${e.target.value}`
    e.target.value = ''
  })

  const numColor = document.querySelector('#number-color')
  numColor.value = ''
  numColor.addEventListener('change', (e) => {
    e.preventDefault()
    number.style.color = `${e.target.value}`
    e.target.value = ''
  })

  const numBackgroundColor = document.querySelector('#number-background-color')
  numBackgroundColor.value = ''
  numBackgroundColor.addEventListener('change', (e) => {
    e.preventDefault()
    number.style.background = `${e.target.value}`
    e.target.value = ''
  })

  const positionColor = document.querySelector('#position-color')
  positionColor.value = ''
  positionColor.addEventListener('change', (e) => {
    e.preventDefault()

    // If color is set to white, text color is set to black so that they don't overlap
    if (e.target.value === 'white') {
      position.style.background = `${e.target.value}`
      position.style.color = 'black'
    } else {
      position.style.background = `${e.target.value}`
      position.style.color = 'white'
    }
    e.target.value = ''
  })

  // DELIVERABLE: Fetch auction feed on refresh to persist all exisitng feed items

  const auctionFeed = document.querySelector('#auction-feed')
  const bestSellers = document.querySelector('#best-sellers-list')
  fetch('http://localhost:3000/auction')
    .then(resp => resp.json())
    .then(feedData => {
      // Post each sale to the feed
      feedData.forEach(sale => {
        const saleListItem = document.createElement('li')
        saleListItem.innerHTML = sale.feed
        auctionFeed.append(saleListItem)
      })

      // Organize and sort all of the sale values into an array in decending order
      const salePriceArray = feedData.map(sale => {
        return sale.value
      })
      const sortedPriceArray = salePriceArray.sort((a, b) => b - a)

      // Grab the top 3 sale values, then find the user they are attached to and filter the user's sale into the leaderboard
      sortedPriceArray.slice(0, 3).forEach(price => {
        const topUserListItem = document.createElement('li')
        const topUser = feedData.find(userObj => userObj.value === price)
        topUserListItem.innerHTML = `${topUser.user} . . . $${topUser.value}`
        bestSellers.append(topUserListItem)
      })
    })

  // DELIVERABLE: Add an event listener to sell button that will post the new sale to the feed

  sellButton.addEventListener('submit', (e) => {
    e.preventDefault()
    const userName = document.querySelector('#new-user-input')

    // Event listener only works if a User Name is provided
    if (userName.value === '') {
      window.alert('You forgot a User Name silly!')
      // alert(...)
      // global.alert(....)
    } else {
      const randomNumber = Math.floor(Math.random() * 999)
      const newUserSale = `${userName.value}'s ${fullName.innerHTML} card just sold for $${randomNumber}!`
      const configObj = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          user: userName.value,
          feed: newUserSale,
          value: randomNumber
        })
      }
      fetch('http://localhost:3000/auction', configObj)
        .then(resp => resp.json())
        .then(data => {
          const saleListItem = document.createElement('li')
          saleListItem.innerHTML = data.feed

          // Set a timer to wait 1.5 seconds after clicking Sell button before alerting the user that the card was sold and appending the sale post to the feed
          setTimeout(function () { // Timers like this are set on window, and _might_ need to be unset.
            window.alert(`SOLD! $${randomNumber}.00`)
            auctionFeed.append(saleListItem)

            // Reset all the card styles to prompt user to make another card
            cardBackground.style.background = 'rgb(215, 215, 215)'

            fullName.innerHTML = 'Try Again?'
            fullName.style.color = 'black'
            frameFooter.style.background = 'white'

            number.innerHTML = 'Pick a new player!'
            number.style.color = 'black'
            number.style.background = 'orange'

            position.innerHTML = '?'
            position.style.color = 'white'
            position.style.background = 'blue'
          }, 1500)
          userName.value = ''
        })
    }
  })
})

// Create a header like Toy tale that says My "NY Knicks" Trading card with image of the knicks
// "Customize your own New York Knicks trading card and then auction it off and we'll tell you how much your masterpiece is worth!"

// Add a button that says "get started" at the bottom of the header that bring up a drop down menu for all the players on the roster
// When a player is picked, their name, image, position, and the logo are filtered into the card body
// Also, reveals dropdown menus for picking the design of the card

// Add a button at the bottom that can flip the card to show stats on the back
// When user is done customizing, they can hit a button that says "Sell now"
// Sell Now button generates a price using a random number generator, multiplied by player's scoring avg for the season
// Adds a comment section at the bottom of the page to comment on the sale

/* Extra
-After sale, replace the sell now button with a "Start Over" and change its color
-Add a list of 3 premade comments
-Premade comments vary depending on sale price
*/
