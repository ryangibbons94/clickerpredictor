//initializing score variable so it can be used in multiple future functions
let score;
let select = document.querySelector("select");
let lineData = [];
let duration;
let startTime;
let ended = true;

let timerTxt = document.getElementById("timer");
let scoreTxt = document.getElementById("score");
let clicksTxt = document.getElementById("clicks");
let startBtn = document.getElementById("start");
let clickArea = document.getElementById("clickarea");
let prediction = document.getElementById("prediction");
let gameCount = 0;

let show = function (elem) {
    elem.style.display = "inline";
};
let hide = function (elem) {
    elem.style.display = "none";
};
//this is the function that starts each round
function startGame() {
    //set the time to the value that the user selects
    duration = Number(select.value);
    hide(startBtn);
    //resets the score to 0
    score = 0;
    ended = false;
    //grabs the current time
    startTime = new Date().getTime();
    //this is the function that is running during the game
    let timerId = setInterval(function () {
        let total = (new Date().getTime() - startTime) / 1000;
        //if the game is still going, update the time and the score in the DOM
        if (total < duration) {
            timerTxt.textContent = total.toFixed(3);
            clicksTxt.textContent = (score / total).toFixed(2);
            //if the game has ended call the end game function
        } else {
            ended = true;
            clearInterval(timerId);

            endGame();
        }
    }, 1);
}

function endGame() {
    data2.splice(0, 1);
    //grabs the clickers per second and puts it in a variable
    let clicksBySeconds = (score / duration).toFixed(2);
    timerTxt.textContent = duration.toFixed(3);
    clicksTxt.textContent = clicksBySeconds;
    //increments the gameCount variable(this is used to decide whether to use the unit rate or linear regression to make a prediction)
    gameCount++;
    //this removes all of the points that were placed on the chart during the round
    removeData(myChart);
    //this places one point on the chart
    addData(myChart, "Clicks Per Second", { x: duration, y: score });
    //this adds the data to the dataset that the regression line uses
    lineData.push([duration, score]);
    //this shows the start button again so the user can start another round
    show(startBtn);
    //this alerts the user their score, it uses set timeout so that the DOM has a chance to refresh with the score before the alert pops up
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
    //this runs the predict function which updates the DOM with a prediction based on the users previous scores
    predict();
    //this updates the dataset to plot the line of regression on the chart
    updateDataTwo();
    //this updates the chart to show all of the changes made to the data sets, both for the individual points and the line of regression
    myChart.update();
    //this shows the start button again so the user can start another round
    show(startBtn);
}

startBtn.addEventListener("click", function (e) {
    startGame();
});

clickArea.addEventListener("click", function (e) {
    if (!ended) {
        score++;
        scoreTxt.textContent = score;
        addData(myChart, "Clicks Per Second", { x: duration, y: score });
        updateDataTwo();
        myChart.update();
    }
});

select.addEventListener("change", predict);

function predict() {
    let newPrediction;
    if (gameCount === 1) {
        newPrediction = (score * select.value) / duration;
        prediction.textContent = `Based on your previous score, in ${select.value} seconds you should get ${newPrediction}`;
    } else if (gameCount > 1) {
        newPrediction = regression.linear(lineData).predict(select.value)[1];
        prediction.textContent = `Based on all of your previous scores, in ${select.value} seconds you should get ${newPrediction}`;
    }
}

var data1 = [];
var data2 = [];
function updateDataTwo() {
    data2.splice(0, 11);
    let yval;
    for (let i = 0; i <= 9; i++) {
        let m = regression.linear(lineData).equation[0];
        let b = regression.linear(lineData).equation[1];
        yval = m * i + b;
        data2.push({ x: i, y: yval });
    }
}
const data = {
    datasets: [
        {
            type: "scatter",
            label: "Clicks Per Second",
            data: data1,
            backgroundColor: "#c03537",
            borderColor: "#c03537",
            hoverBorderColor: "black",
            fontColor: "black",
        },
        {
            type: "line",
            label: "Prediction Line",
            data: data2,
            borderColor: "#E1A60C",
            backgroundColor: "#E1A60C",
            hoverBorderColor: "white",
            fontColor: "white",
        },
    ],
};
Chart.defaults.plugins.legend.labels.color = "white";

const config = {
    data: data,
    options: {
        legend: {
            labels: {
                fontColor: "white",
                color: "white",
            },
        },
        animations: false,

        scales: {
            x: {
                ticks: {
                    color: "white",
                },
                grid: {
                    color: "#8c99a6",
                },
                type: "linear",
                position: "bottom",
                beginAtZero: true,
                suggestedMax: 9,
            },
            yAxis: {
                ticks: {
                    color: "white",
                },
                grid: {
                    color: "#8c99a6",
                },
                beginAtZero: true,
                suggestedMax: 90,
                suggestedMin: 0,
            },
        },
    },
};

//initialize the chart
const myChart = new Chart(document.getElementById("myChart"), config);

//add data to the chart
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

//remove data function from the chart to remove just the values that were added in the previoius round
function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.splice(gameCount - 1, score);
        dataset.data.unshift();
    });
    chart.update();
}
