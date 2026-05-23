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
        });
    }
});

function goBack() {
    window.location.href = "notes.html";
}
