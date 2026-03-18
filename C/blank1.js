const blanks = document.querySelectorAll(".blank");
let userAnswers = {};

blanks.forEach((blank, index) => {
  const qNo = index + 1;
  
  blank.addEventListener("input", () => {
    const userValue = blank.value.trim();
    const correctValue = blank.dataset.answer;
    
    const container = blank.closest('.question-container');
    let result = container.querySelector(".result-message");

    blank.classList.remove("correct", "wrong");

    if (userValue === "") {
      if (result) result.textContent = "";
      delete userAnswers[qNo];
      return;
    }

    if (userValue.toLowerCase() === correctValue.toLowerCase()) {
      blank.classList.add("correct");
      if (result) {
        result.textContent = "✅ Correct!";
        result.style.color = "#34d399";
      }
      userAnswers[qNo] = { status: "Correct", user: userValue, correct: correctValue, isCorrect: true };
    } else {
      blank.classList.add("wrong");
      if (result) {
        result.textContent = "❌ Incorrect, try again";
        result.style.color = "#f87171";
      }
      userAnswers[qNo] = { status: "Wrong", user: userValue, correct: correctValue, isCorrect: false };
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
    const finishBtn = document.getElementById("finishBtn");
    if (finishBtn) {
        finishBtn.addEventListener("click", showFinalResult);
    }
});

function showFinalResult() {
  const finalBox = document.getElementById("finalResult");
  const scoreText = document.getElementById("scoreText");
  const summaryBox = document.getElementById("answerSummary");
  
  let score = 0;
  for (let q in userAnswers) {
    if (userAnswers[q].isCorrect) score++;
  }
  
  finalBox.style.display = "block";
  scoreText.innerHTML = `✅ Your Score: <strong>${score} / ${blanks.length}</strong>`;

  summaryBox.innerHTML = "";
  
  // Calculate specific summaries
  for (let i = 0; i < blanks.length; i++) {
    const qNo = i + 1;
    let data = userAnswers[qNo];
    if (!data) {
       data = { status: "Not Attempted", user: "(Empty)", correct: blanks[i].dataset.answer };
    }
    
    const div = document.createElement("div");
    div.classList.add("summary-item");

    div.innerHTML = `
      <p>
        <strong>Q${qNo}:</strong> ${data.status}
        <br>
        👤 Your Answer: <span style="font-family: monospace; color: ${data.status === 'Correct' ? '#34d399' : '#f87171'}">${data.user}</span>
        <br>
        ✅ Correct Answer: <span style="font-family: monospace; color: #60a5fa">${data.correct}</span>
      </p>
    `;
    summaryBox.appendChild(div);
  }

  // Disable interacting after finishing
  blanks.forEach(b => b.disabled = true);
  
  const finishBtn = document.getElementById("finishBtn");
  if(finishBtn) finishBtn.style.display = "none";

  finalBox.scrollIntoView({ behavior: "smooth" });
}

function goBack() {
  window.history.back();
}
