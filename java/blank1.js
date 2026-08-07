document.addEventListener("DOMContentLoaded", () => {
    const blanks = document.querySelectorAll(".blank");
    const finishBtn = document.getElementById("finishBtn");
    const userProgress = {};

    blanks.forEach((input, index) => {
        input.addEventListener("input", function() {
            const userValue = this.value.trim().toLowerCase();
            const correctValue = this.dataset.answer.toLowerCase();
            const resultMsg = this.parentElement.nextElementSibling;

            this.classList.remove("correct", "wrong");
            
            if (userValue === "") {
                resultMsg.textContent = "";
                return;
            }

            if (userValue === correctValue) {
                this.classList.add("correct");
                resultMsg.textContent = "✅ Excellent!";
                resultMsg.style.color = "#10b981";
                userProgress[index] = true;
            } else {
                this.classList.add("wrong");
                resultMsg.textContent = "❌ Not quite, keep trying!";
                resultMsg.style.color = "#ef4444";
                userProgress[index] = false;
            }
        });
    });

    if (finishBtn) {
        finishBtn.addEventListener("click", () => {
            const total = blanks.length;
            const solved = Object.values(userProgress).filter(v => v === true).length;
            
            const finalBox = document.getElementById("finalResult");
            const scoreText = document.getElementById("scoreText");
            
            if (finalBox) finalBox.style.display = "block";
            if (scoreText) scoreText.innerHTML = `You completed <strong>${solved} out of ${total}</strong> blanks correctly!`;
            
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

        });
    }
});

function goBack() {
    window.location.href = "notes.html";
}
