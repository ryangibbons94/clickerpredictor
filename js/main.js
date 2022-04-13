let score; // to store the current score
//NEED TO ADD AN EVENT LISTENER THAT CHANGES THE DURATION EVERYTIME THE INPUT IS CHANGED
let select = document.querySelector("select");
let lineData = [];
// var duration = Number(select.value);
let duration;
let startTime; // start time
let ended = true; // boolean indicating if game is ended
// we get DOM References for some HTML elements
let timerTxt = document.getElementById("timer");
let scoreTxt = document.getElementById("score");
let clicksTxt = document.getElementById("clicks");
let startBtn = document.getElementById("start");
let clickArea = document.getElementById("clickarea");
let prediction = document.getElementById("prediction");
let gameCount = 0;
// we define two functions for showing or hiding a HTML element
let show = function (elem) {
    elem.style.display = "inline";
};
let hide = function (elem) {
    elem.style.display = "none";
};
// Method called when the game starts
function startGame() {
    duration = Number(select.value);
    hide(startBtn);
    score = 0;
    ended = false;
    // we get start time
    startTime = new Date().getTime();
    // we create a timer with the setInterval method
    let timerId = setInterval(function () {
        let total = (new Date().getTime() - startTime) / 1000;
        // while total lower than duration, we update timer and the clicks by seconds
        if (total < duration) {
            timerTxt.textContent = total.toFixed(3);
            clicksTxt.textContent = (score / total).toFixed(2);
        } else {
            // otherwise, game is ended, we clear interval and we set game as ended
            ended = true;
            clearInterval(timerId);
            // we call the end game method
            endGame();
        }
    }, 1);
}
// end game method
function endGame() {
    // we write final stats
    let clicksBySeconds = (score / duration).toFixed(2);
    timerTxt.textContent = duration.toFixed(3);
    clicksTxt.textContent = clicksBySeconds;
    gameCount++;
    removeData(myChart);
    addData(myChart, "Clicks Per Second", { x: duration, y: score });
    lineData.push([duration, score]);
    // we show start button to play another game
    show(startBtn);
    // we display result to the user in delayed mode
    //to update DOM elements just before the alert
    setTimeout(function () {
        alert(
            "You made " +
                score +
                " clicks in " +
                duration +
                " seconds. It is " +
                clicksBySeconds +
                " clicks per second. Try again!"
        );
    }, 10);
}
// we set a click event listener on the start button
startBtn.addEventListener("click", function (e) {
    startGame();
});
// we add a click event listener on the click area div to update the score when the user will click
clickArea.addEventListener("click", function (e) {
    if (!ended) {
        score++;
        scoreTxt.textContent = score;
        addData(myChart, "Clicks Per Second", { x: duration, y: score });
    }
});

//add prediction after first game played

select.addEventListener("change", predict);

function predict() {
    let newPrediction;
    if (gameCount === 1) {
        console.log(regression.linear(lineData).predict(select.value)[1]);
        newPrediction = (score * select.value) / duration;
        prediction.textContent = `Based on your previous score, in ${select.value} seconds you should get ${newPrediction}`;
    } else if (gameCount > 1) {
        console.log(regression.linear(lineData).predict(select.value)[1]);
        newPrediction = regression.linear(lineData).predict(select.value)[1];
        prediction.textContent = `Based on all of your previous scores, in ${select.value} seconds you should get ${newPrediction}`;
    }
}
//chart stuff
var data1 = [];
const data = {
    datasets: [
        {
            label: "Clicks Per Second",
            data: data1,
            backgroundColor: "rgb(255, 99, 132)",
        },
    ],
};
const config = {
    type: "scatter",
    data: data,
    options: {
        animations: false,
        scales: {
            x: {
                type: "linear",
                position: "bottom",
                beginAtZero: true,
                suggestedMax: 9,
            },
            yAxis: {
                beginAtZero: true,
                suggestedMax: 90,
            },
        },
    },
};

const myChart = new Chart(document.getElementById("myChart"), config);
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}
//   function removeData(chart) {
//     chart.data.labels.pop();
//     chart.data.datasets.forEach((dataset) => {
//       if(gameCount > 20){
//         dataset.data.splice(gameCount,(score))}
//         else{
//           dataset.data.splice(gameCount-1,(score))
//           dataset.data.unshift();
//         };
//     });
//     chart.update();
// }

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.splice(gameCount - 1, score);
        dataset.data.unshift();
    });
    chart.update();
}

//regresstion stuff
let fakeData = [
    [2, 7],
    [1, 5],
];

//need to convert data in the form "x: 1, y: 2" to [1,2]
// function convertDataForRegression() {
//     let xyPair = [];
//     let newPair = [];
//     for (let i = 0; i < data1.length; i++) {
//         newpair = null;
//         newPair.push(data1[i].x);
//         newPair.push(data1[i].y);
//         xyPair.push(newPair);
//         return newPair;
//     }
//     return xyPair;
// }

// function regression() {
//     let thing = regression.linear(convertDataForRegression(data1));
//     return thing;
// }

let lineThing = regression.linear(fakeData);
