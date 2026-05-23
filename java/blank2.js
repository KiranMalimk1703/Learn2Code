document.addEventListener("DOMContentLoaded", () => {
    const blanks = document.querySelectorAll(".blank");
    const finishBtn = document.getElementById("finishBtn");
    const userProgress = {};

    blanks.forEach((input, index) => {
        input.addEventListener("input", function () {
            const userValue = this.value.trim().toLowerCase();
            const correctValue = this.dataset.answer.toLowerCase();
            const resultMsg = this.closest(".question-container").querySelector(".result-message");

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

        // Allow submit on Enter key
        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                const nextInput = blanks[index + 1];
                if (nextInput) nextInput.focus();
            }
        });
    });

    if (finishBtn) {
        finishBtn.addEventListener("click", () => {
            const total = blanks.length;
            const solved = Object.values(userProgress).filter(v => v === true).length;

            const finalBox = document.getElementById("finalResult");
            const scoreText = document.getElementById("scoreText");

            // Grade message
            let emoji = "🎉";
            let message = "";
            const pct = (solved / total) * 100;

            if (pct === 100) {
                emoji = "🏆";
                message = "Perfect score! You're a Java pro!";
            } else if (pct >= 70) {
                emoji = "🎉";
                message = "Great work! Keep it up!";
            } else if (pct >= 40) {
                emoji = "📚";
                message = "Good effort! Review the notes and try again.";
            } else {
                emoji = "💪";
                message = "Keep practising — you've got this!";
            }

            if (finalBox) finalBox.style.display = "block";
            if (scoreText) scoreText.innerHTML =
                `${emoji} You completed <strong>${solved} out of ${total}</strong> blanks correctly! <br><span style="font-size:16px;color:#94a3b8;">${message}</span>`;

            if (finalBox) finalBox.scrollIntoView({ behavior: "smooth" });
        });
    }
});

function goBack() {
    window.location.href = "notes.html";
}
