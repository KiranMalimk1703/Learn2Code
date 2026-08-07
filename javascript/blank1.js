document.addEventListener("DOMContentLoaded", () => {
  const blankCards = document.querySelectorAll(".blank-card");
  const userAnswers = {};
  let score = 0;

  blankCards.forEach((card, index) => {
    const input = card.querySelector(".blank-input");
    const checkBtn = card.querySelector(".check-btn");
    const resultBox = card.querySelector(".result");
    const qNo = index + 1;

    // Optional: allow checking by pressing 'Enter' inside the input
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        checkBtn.click();
      }
    });

    checkBtn.addEventListener("click", function () {
      if (userAnswers[qNo]) return;

      const userAnswer = input.value.trim();
      const correctAnswer = input.dataset.correct.trim();

      if (userAnswer === "") {
        resultBox.textContent = "⚠️ Please enter an answer.";
        resultBox.style.color = "#f59e0b";
        return;
      }

      if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        resultBox.textContent = "✅ Correct Answer!";
        resultBox.style.color = "#10b981";
        input.classList.add("correct");
        score++;
        
        userAnswers[qNo] = {
          status: "✅ Correct",
          user: userAnswer,
          correct: correctAnswer
        };
      } else {
        resultBox.textContent = `❌ Wrong Answer! The correct answer is: ${correctAnswer}`;
        resultBox.style.color = "#ef4444";
        input.classList.add("wrong");

        userAnswers[qNo] = {
          status: "❌ Wrong",
          user: userAnswer,
          correct: correctAnswer
        };
      }

      input.disabled = true;
      checkBtn.disabled = true;
    });
  });

  // Finish Quiz
  const finishBtn = document.getElementById("finishBtn");
  if (finishBtn) {
    finishBtn.addEventListener("click", () => showFinalResult());
  }

  function showFinalResult() {
    // Automatically check unanswered questions
    blankCards.forEach((card, index) => {
      const qNo = index + 1;
      if (!userAnswers[qNo]) {
        const input = card.querySelector(".blank-input");
        const checkBtn = card.querySelector(".check-btn");
        
        input.value = input.value || "(Blank)";
        input.dataset.correct = input.dataset.correct || "";
        const correctAnswer = input.dataset.correct.trim();
        
        input.classList.add("wrong");
        input.disabled = true;
        checkBtn.disabled = true;
        
        userAnswers[qNo] = {
          status: "❌ Missed",
          user: "(Blank)",
          correct: correctAnswer
        };
      }
    });

    const finalBox = document.getElementById("finalResult");
    const scoreText = document.getElementById("scoreText");
    const summaryBox = document.getElementById("answerSummary");
    const pct = Math.round((score / blankCards.length) * 100);

    let emoji = "🎉";
    let message = "";
    if (pct === 100) { emoji = "🏆"; message = "Perfect score! JavaScript master!"; }
    else if (pct >= 70) { emoji = "🎉"; message = "Great work! Keep it up!"; }
    else if (pct >= 40) { emoji = "📚"; message = "Good effort! Review the notes and try again."; }
    else { emoji = "💪"; message = "Keep practising — you've got this!"; }

    if (finalBox) finalBox.style.display = "block";
    if (scoreText) scoreText.innerHTML =
      `${emoji} Your Score: <strong>${score} / ${blankCards.length}</strong>
       <br><span style="font-size:16px;color:#94a3b8;">${message}</span>`;

    if (summaryBox) {
      summaryBox.innerHTML = "";
      for (let q in userAnswers) {
        const div = document.createElement("div");
        div.classList.add("summary-item");
        div.innerHTML = `
          <p>
            <strong>Q${q}:</strong> ${userAnswers[q].status}<br>
            Your Answer: <em style="color:#e2e8f0;">${userAnswers[q].user}</em> <br>
            ✅ Correct Answer: <strong style="color:#10b981;">${userAnswers[q].correct}</strong>
          </p>`;
        summaryBox.appendChild(div);
      }
    }

    if (finalBox) finalBox.scrollIntoView({ behavior: "smooth" });

    // Save score
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      let users = JSON.parse(localStorage.getItem("users")) || {};
      if (!users[currentUser]) users[currentUser] = { scores: {} };
      if (!users[currentUser].scores) users[currentUser].scores = {};
      const quizName = window.location.pathname.split('/').pop().replace('.html', '').replace('.js', '');
      const folderName = window.location.pathname.split('/').slice(-2)[0];
      const totalQuestions = typeof mcqCards !== 'undefined' ? mcqCards.length : (typeof blankCards !== 'undefined' ? blankCards.length : 0);
      users[currentUser].scores[`${folderName}_${quizName}`] = { score: score, total: totalQuestions };
      localStorage.setItem("users", JSON.stringify(users));
    }

  }

});

function goBack() {
  window.location.href = "notes.html";
}
