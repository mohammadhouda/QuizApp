let count = document.querySelector(".count span");
let bulletsCont = document.querySelector(".bullets .spans");
let currentIndex = 0;
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers");
let submitBtn = document.querySelector(".submitBtn");
let rightAnswerCount = 0;
let bulletsEle = document.querySelector(".bullets");
let theResults = document.querySelector(".results");
let countDownInterval;
let countDownEle = document.querySelector(".count-Down");
let startBtn = document.querySelector(".startBtn");
let restartBtn = document.querySelector(".restartBtn");
let questions = [];
let questionsNum;
let options = document.querySelector(".category-select");

function getRequest() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      questions = JSON.parse(this.responseText);
      startBtn.disabled = true;
      questionsNum = questions.length - 25;
      currentIndex = 0;
      questions.sort(() => Math.random() - 0.5);
      addData(questions[currentIndex], questionsNum);
      createBullets(questionsNum);
      countDown(15, questionsNum);
    }
  };

  myRequest.open("GET", `${options.value}.json`, true);

  myRequest.send();
}

startBtn.addEventListener("click", () => {
  quizArea.innerHTML = "";
  answersArea.innerHTML = "";
  bulletsCont.innerHTML = "";
  getRequest();
  submitBtn.disabled = false;
  submitBtn.style.cursor = "pointer";
  startBtn.style.display = "none";
});

submitBtn.addEventListener("click", () => {
  clearInterval(countDownInterval);
  let right_Answer = questions[currentIndex].right_answer;
  currentIndex++;
  checkAnswer(right_Answer, questionsNum);

  quizArea.innerHTML = ``;
  answersArea.innerHTML = ``;

  addData(questions[currentIndex], questionsNum);

  handleBullets();

  showResults(questionsNum);
  countDown(15, questionsNum);
});

function createBullets(num) {
  count.innerHTML = num;

  for (let i = 0; i < 10; i++) {
    let bullet = document.createElement("span");

    if (i === 0) {
      bullet.classList.add("on");
    }

    bulletsCont.appendChild(bullet);
  }
}
function addData(questions, count) {
  if (currentIndex < count) {
    let title = document.createElement("h2");
    let text = document.createTextNode(questions.title);
    title.appendChild(text);
    quizArea.appendChild(title);

    let answers = [];

    for (let i = 1; i <= 4; i++) {
      answers.push(questions[`answer_${i}`]);
    }

    answers.sort(() => Math.random() - 0.5);

    for (let i = 0; i < answers.length; i++) {
      let mainAnswer = document.createElement("div");
      mainAnswer.className = "answer";

      let radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = "question";
      radioInput.id = `answer${i + 1}`;
      radioInput.dataset.answer = answers[i];

      if (i === 0) {
        radioInput.checked = true;
      }

      let label = document.createElement("label");
      label.htmlFor = `answer${i + 1}`;

      let labelText = document.createTextNode(answers[i]);

      label.appendChild(labelText);
      mainAnswer.appendChild(radioInput);
      mainAnswer.appendChild(label);

      answersArea.appendChild(mainAnswer);
    }
  }
}

function checkAnswer(rightAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rightAnswer === theChosenAnswer) {
    rightAnswerCount++;
  }
}

function handleBullets() {
  let bullets = document.querySelectorAll(".bullets .spans span");
  let arrayofSpans = Array.from(bullets);

  arrayofSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let results;
  if (currentIndex === count) {
    restartBtn.style.display = "block";
    bulletsCont.innerHTML = ``;
    countDownEle.innerHTML = ``;

    if (rightAnswerCount > count / 2 && rightAnswerCount < 10) {
      results = `<span class="good"> you have good info</span>, ${rightAnswerCount} from ${count}`;
    } else if (rightAnswerCount === count) {
      results = `<span class="perfect"> Perfect !</span>, ${rightAnswerCount} from ${count}`;
    } else {
      results = `<span class="bad"> you have bad info</span>, ${rightAnswerCount} from ${count}`;
    }
    theResults.innerHTML = results;
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

      countDownEle.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}

restartBtn.addEventListener("click", () => {
  quizArea.innerHTML = ``;
  answersArea.innerHTML = ``;
  bulletsCont.innerHTML = ``;

  currentIndex = 0;
  theResults.innerHTML = ``;
  rightAnswerCount = 0;
  clearInterval(countDownInterval);
  restartBtn.style.display = "none";
  startBtn.style.display = "block";
  submitBtn.disabled = true;
});
