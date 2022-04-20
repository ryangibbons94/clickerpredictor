# Clicker Predictor
A web app that allows the user to test their click speed and updates a graph in the DOM with a prediction using linear regression from their previous rounds.

**Link to project:** https://clicker-predictor.netlify.app/

![screenshot of website](https://i.imgur.com/Qlrh7p1.jpg)

## How It's Made:

**Tech used:** HTML, CSS, JavaScript, Chart.js, Regression.js


## Challenges Faced/Lessons Learned:

1. Allowing the user to see the point going up on the graph as they are clicking:

So I wanted the user to be able to see their point going up on the graph with every click but I also wanted only the last point to stay on the graph after each round. I accomplished this with two separate functions and two different even listeners. One function(addData) would add the data to the chart and another function (removeData) would remove all of the data added during that round. During each round, I set an event listener on the click area and assigned the addData function to it. I had another function called endGame that would run after the game ended. I called removeData to remove all of the previous round's points and then I re-called addData to just add the previous round's final point to the chart.  

2. Regression.js and Chart.js wanted the data in two different forms:

So chart.js wanted the data in an array of objects with the first key being the x value and the second key being the y value. Regression.js, however, wanted the data in an array of arrays with the inner arrays representing the coordinates in the form (x,y) -> [x,y]. At first, I thought it would be complicated and I'd have to convert it from the chart.js way to the regression.js way but I ended up just creating a second set of data and pushing in the correctly formated data after each round for regression.js. 
