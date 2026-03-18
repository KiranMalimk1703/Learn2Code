document.addEventListener("DOMContentLoaded", () => {

  const mcqCards = document.querySelectorAll(".mcq-card");
  const userAnswers = {};   // store user answers
  let score = 0;

  mcqCards.forEach((card, index) => {
    const radios = card.querySelectorAll("input[type='radio']");
    const resultBox = card.querySelector(".result");
    const qNo = index + 1;

    radios.forEach(radio => {
      radio.addEventListener("change", function () {

        // Prevent re-answering
        if (userAnswers[qNo]) return;

        const labels = card.querySelectorAll("label");
        labels.forEach(l => l.classList.remove("correct-option", "wrong-option"));

        if (this.dataset.correct === "true") {
          resultBox.textContent = "✅ Correct Answer!";
          resultBox.style.color = "var(--text-main)";
          this.parentElement.classList.add("correct-option");

          score++;
          userAnswers[qNo] = {
            status: "Correct",
            correctAnswer: this.parentElement.textContent.trim()
          };
        } else {
          resultBox.textContent = "❌ Wrong Answer!";
          resultBox.style.color = "var(--text-main)";
          this.parentElement.classList.add("wrong-option");

          const correct = card.querySelector("input[data-correct='true']");
          correct.parentElement.classList.add("correct-option");

          userAnswers[qNo] = {
            status: "Wrong",
            correctAnswer: correct.parentElement.textContent.trim()
          };
        }

        // Disable all options after answer
        radios.forEach(r => r.disabled = true);
      });
    });
  });

  // Finish Quiz Button
  const finishBtn = document.getElementById("finishBtn");
  if (finishBtn) {
    finishBtn.addEventListener("click", () => {
      showFinalResult();
    });
  }

  function showFinalResult() {
    const finalBox = document.getElementById("finalResult");
    const scoreText = document.getElementById("scoreText");
    const summaryBox = document.getElementById("answerSummary");

    finalBox.style.display = "block";
    scoreText.innerHTML = `✅ Your Score: <strong>${score} / ${mcqCards.length}</strong>`;

    summaryBox.innerHTML = "";

    for (let q in userAnswers) {
      const div = document.createElement("div");
      div.classList.add("summary-item");

      div.innerHTML = `
        <p>
          <strong>Q${q}:</strong>
          ${userAnswers[q].status}
          <br>
          ✅ Correct Answer: ${userAnswers[q].correctAnswer}
        </p>
      `;

      summaryBox.appendChild(div);
    }

    finalBox.scrollIntoView({ behavior: "smooth" });
  }

});

function goBack() {
  window.history.back();
}
function goNext() {
  window.location.href = "blank1.html";
}
