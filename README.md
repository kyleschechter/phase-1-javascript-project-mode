# New York Knicks Custom Card Maker
The goal of this application is to allow a user to easily create a customized basketball card for any player on the New York Knicks, and then sell their card for a random value and see it posted to a feed of all sales.

## Endpoints
GET https://www.balldontlie.io/api/v1/players?search=
GET http://localhost:3000/auction
POST http://localhost:3000/auction

## Instructions
Fork and clone this repository in your terminal.

Open src/index.html in your browser to interact with the web page. Then add a JSON server using 'json-server --watch db.json' in your terminal.

When open, click the "Get Started" Button to view a dropdown of current New York Knicks players, as well as an input field for image URL's.

Choose the player that you would like to make a card for, enter an image URL for that player, and then click add player to begin customizing.

Use the dropdown menus to the right of the card to dictate the colors of each portion of the card.

When you're finished customizing, enter a User Name for your card, and then click "Sell" to check the value of your card.

Browse the auction feed to see all of the other cards sold, or refresh the page to see if your card's sale price made it onto the leaderboard!

## Deliverables

1. On refresh, web app has a button that reveals a form, allowing user's to pick a basketball player from a dropdown, and input an image URL for the background of the card face. The selected player's name is used to fetch their information from balldontlie API using a search URL, and then populates the card's text content for position, name, number, height and weight.

2. User is able to select styles from 5 dropdowns that have event listeners, instantly changing the respective card design property to their chosen color.

3. Sell button exists at the bottom of the edits section, that, when clicked; filters the User's name input, their selected player header inner HTML, and a random number value into a post, and then appends that post to an Auction Feed "ul". This feed should persist by using a database to store each new sale, and then fetching the full feed list whenever the pade is loaded. 

4. (Advanced) The user should also see that the card template has reverted back to a defualt style, prompting them to create a new card.

5. (Advanced) If the user's sale price ranks among the top 3 posts in the entire feed,they should be able to see their name and card value on the leaderboards when they refresh the page.