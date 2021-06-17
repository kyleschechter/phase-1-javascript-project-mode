document.addEventListener('DOMContentLoaded', () => {
  const getStartedButton = document.getElementById('get-started')
  const buttonP = document.getElementById('get-started-p')
  const playerSelect = document.querySelector('.player-container')
  const h2 = document.querySelector('h2')
  let newPlayer = false

  // Clicking on Get Started button drops down menu to select player

  getStartedButton.addEventListener('click', (e) => {
    e.preventDefault()
    console.log('Clicked')
    newPlayer = !newPlayer
    if (newPlayer) {
      playerSelect.style.display = 'block'
      h2.style.display = 'none'
      getStartedButton.style.display = 'none'
      buttonP.style.margin = '0px'
    } else {
      playerSelect.style.display = 'none'
      h2.style.display = 'inline'
    }
  })

  // When a player is selected, their name and position will be filered into the card
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
        console.log(playerData)
        position.innerHTML = playerData.data[0].position
        fullName.innerHTML = playerData.data[0].first_name + ' ' + playerData.data[0].last_name
        sellButton.className = fullName.innerHTML
        if (playerData.data[0].height_feet && playerData.data[0].height_inches && playerData.data[0].weight_pounds !== 'null') {
          number.innerHTML = `#${e.target.value.slice(0, 2)} - ${playerData.data[0].height_feet}'${playerData.data[0].height_inches}" - ${playerData.data[0].weight_pounds}lbs.`
        } else {
          number.innerHTML = `#${e.target.value.slice(0, 2)}`
        }
        e.target.value = ''
      })
  })

  // When an image URL is submitted, the card background becomes that image
  const addPlayerButton = document.querySelector('#add-player-button')
  const imgUrl = document.querySelector('#player-image')
  const cardBackground = document.querySelector('.card-background')
  addPlayerButton.addEventListener('click', (e) => {
    e.preventDefault()
    cardBackground.style.background = `url("${imgUrl.value}")`
    cardBackground.style.backgroundSize = 'cover'
    cardBackground.style.backgroundRepeat = 'no-repeat'
    imgUrl.value = ''
  })

  // Add event listeners to each edit dropdown that change the respective color of the card
  const namePlateColor = document.querySelector('#name-plate-color')
  namePlateColor.addEventListener('change', (e) => {
    e.preventDefault()
    fullName.style.color = `${e.target.value}`
  })

  const namePlateBackground = document.querySelector('#name-plate-background-color')
  const frameFooter = document.querySelector('.frame-footer')
  namePlateBackground.addEventListener('change', (e) => {
    e.preventDefault()
    frameFooter.style.background = `${e.target.value}`
  })

  const numColor = document.querySelector('#number-color')
  numColor.addEventListener('change', (e) => {
    e.preventDefault()
    number.style.color = `${e.target.value}`
  })

  const numBackgroundColor = document.querySelector('#number-background-color')
  numBackgroundColor.addEventListener('change', (e) => {
    e.preventDefault()
    number.style.background = `${e.target.value}`
  })

  const positionColor = document.querySelector('#position-color')
  positionColor.addEventListener('change', (e) => {
    e.preventDefault()
    if (e.target.value === 'white') {
      position.style.background = `${e.target.value}`
      position.style.color = 'black'
    } else {
      position.style.background = `${e.target.value}`
      position.style.color = 'white'
    }
  })

  // Fetch auction feed on refresh to persist all exisitng feed items
  const auctionFeed = document.querySelector('#auction-feed')
  const bestSellers = document.querySelector('#best-sellers')
  fetch('http://localhost:3000/auction')
    .then(resp => resp.json())
    .then(feedData => {
      feedData.forEach(sale => {
        const newSale = document.createElement('li')
        newSale.innerHTML = sale.feed
        auctionFeed.append(newSale)
      })
      const salePriceArray = feedData.map(sale => {
        return sale.value
      })
      const sortedPriceArray = salePriceArray.sort((a, b) => b - a)

      sortedPriceArray.slice(0, 3).forEach(price => {
        const topUserListItem = document.createElement('li')
        const topUser = feedData.find(userObj => userObj.value === price)
        topUserListItem.innerHTML = `${topUser.user} . . . $${topUser.value}`
        bestSellers.append(topUserListItem)
      })
    })

  // Add an event listener to sell button that will post the sale to the feed
  sellButton.addEventListener('submit', (e) => {
    e.preventDefault()
    const userName = document.querySelector('#new-user-input')
    if (userName.value === '') {
      window.alert('You forgot a User Name silly!')
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
          console.log(data)
          const newSale = document.createElement('li')
          newSale.innerHTML = data.feed
          setTimeout(function () {
            window.alert(`SOLD! $${randomNumber}.00`)
            auctionFeed.append(newSale)
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
