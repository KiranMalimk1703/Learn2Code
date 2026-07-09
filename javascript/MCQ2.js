document.addEventListener("DOMContentLoaded", () => {

  const mcqCards  = document.querySelectorAll(".mcq-card");
  const userAnswers = {};
  let score = 0;

  mcqCards.forEach((card, index) => {
    const radios    = card.querySelectorAll("input[type='radio']");
    const resultBox = card.querySelector(".result");
    const qNo       = index + 1;

    radios.forEach(radio => {
      radio.addEventListener("change", function () {

        // Prevent re-answering
        if (userAnswers[qNo]) return;

        const labels = card.querySelectorAll("label");
        labels.forEach(l => l.classList.remove("correct-option", "wrong-option"));

        if (this.dataset.correct === "true") {
          resultBox.textContent = "✅ Correct Answer!";
          resultBox.style.color = "#10b981";
          this.parentElement.classList.add("correct-option");

          score++;
          userAnswers[qNo] = {
            status: "✅ Correct",
            correctAnswer: this.parentElement.textContent.trim()
          };
        } else {
          resultBox.textContent = "❌ Wrong Answer!";
          resultBox.style.color = "#ef4444";
          this.parentElement.classList.add("wrong-option");

          const correct = card.querySelector("input[data-correct='true']");
          correct.parentElement.classList.add("correct-option");

          userAnswers[qNo] = {
            status: "❌ Wrong",
            correctAnswer: correct.parentElement.textContent.trim()
          };
        }

        // Disable all options after answer
        radios.forEach(r => r.disabled = true);
      });
    });
  });

  // Finish Quiz
  const finishBtn = document.getElementById("finishBtn");
  if (finishBtn) {
    finishBtn.addEventListener("click", () => showFinalResult());
  }

  function showFinalResult() {
    const finalBox   = document.getElementById("finalResult");
    const scoreText  = document.getElementById("scoreText");
    const summaryBox = document.getElementById("answerSummary");
    const pct        = Math.round((score / mcqCards.length) * 100);

    let emoji   = "🎉";
    let message = "";
    if (pct === 100)     { emoji = "🏆"; message = "Perfect score! JavaScript master!"; }
    else if (pct >= 70)  { emoji = "🎉"; message = "Great work! Keep it up!"; }
    else if (pct >= 40)  { emoji = "📚"; message = "Good effort! Review the notes and try again."; }
    else                 { emoji = "💪"; message = "Keep practising — you've got this!"; }

    if (finalBox)  finalBox.style.display = "block";
    if (scoreText) scoreText.innerHTML =
      `${emoji} Your Score: <strong>${score} / ${mcqCards.length}</strong>
       <br><span style="font-size:16px;color:#94a3b8;">${message}</span>`;

    if (summaryBox) {
      summaryBox.innerHTML = "";
      for (let q in userAnswers) {
        const div = document.createElement("div");
        div.classList.add("summary-item");
        div.innerHTML = `
          <p>
            <strong>Q${q}:</strong> ${userAnswers[q].status}<br>
            ✅ Correct Answer: ${userAnswers[q].correctAnswer}
          </p>`;
        summaryBox.appendChild(div);
      }
    }

    if (finalBox) finalBox.scrollIntoView({ behavior: "smooth" });
  }

});

function goBack() {
  window.location.href = "notes.html";
}
