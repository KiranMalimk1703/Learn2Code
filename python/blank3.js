const blanks = document.querySelectorAll(".blank");

blanks.forEach((blank) => {
  blank.addEventListener("input", () => {
    const userValue = blank.value.trim();
    const correctValue = blank.dataset.answer;
    
    // Look for the result message specifically inside the same container
    const container = blank.closest('.question-container');
    const result = container.querySelector(".result-message");

    blank.classList.remove("correct", "wrong");

    if (userValue === "") {
      if (result) result.textContent = "";
      return;
    }

    if (userValue.toLowerCase() === correctValue.toLowerCase()) {
      blank.classList.add("correct");
      if (result) {
        result.textContent = "✅ Correct!";
        result.style.color = "lime";
      }
      blank.disabled = true;
    } else {
      blank.classList.add("wrong");
      if (result) {
        result.textContent = "❌ Incorrect, try again";
        result.style.color = "red";
      }
    }
  });
});