const currentUser = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users")) || {};

if (!currentUser || !users[currentUser]) {
  window.location.href = "Login.html";
} else {
  const profile = users[currentUser].profile;
  const scores = users[currentUser].scores || {};

  if (profile) {
    const firstName = profile.fullname.split(' ')[0] || currentUser;
    document.getElementById("userName").innerText = firstName;
    document.getElementById("fullName").innerText = profile.fullname;
    document.getElementById("level").innerText = profile.level || "Not Set";
    document.getElementById("language").innerText = profile.language || "Not Set";
  } else {
    document.getElementById("userName").innerText = currentUser;
    document.getElementById("fullName").innerText = currentUser;
  }

  // Calculate scores
  let mcqTotalPercent = 0;
  let mcqCount = 0;
  let quizTotalPercent = 0;
  let quizCount = 0;

  for (const key in scores) {
    const data = scores[key];
    const percent = Math.round((data.score / data.total) * 100);
    if (key.includes("MCQ")) {
      mcqTotalPercent += percent;
      mcqCount++;
    } else if (key.includes("blank")) {
      quizTotalPercent += percent;
      quizCount++;
    }
  }

  const mcqAvg = mcqCount > 0 ? Math.round(mcqTotalPercent / mcqCount) : 0;
  const quizAvg = quizCount > 0 ? Math.round(quizTotalPercent / quizCount) : 0;

  // Assuming total of 30 items for course completion
  const totalItemsFinished = Object.keys(scores).length;
  const progressValue = Math.min(100, Math.round((totalItemsFinished / 30) * 100));

  setTimeout(() => {
    const progressBar = document.getElementById("progress");
    const progressText = document.getElementById("progressValue");
    
    if(progressBar && progressText) {
      progressBar.style.width = progressValue + "%";
      progressText.innerText = progressValue + "%";
    }

    const scoreCircles = document.querySelectorAll(".score-number");
    if(scoreCircles.length >= 2) {
      scoreCircles[0].innerHTML = mcqAvg + "<small>%</small>";
      scoreCircles[1].innerHTML = quizAvg + "<small>%</small>";
    }
  }, 300);

  // Admin Check
  if (currentUser === "admin") {
    document.getElementById("adminPanel").style.display = "block";
    const tbody = document.getElementById("adminUserList");
    for (const user in users) {
      const uProfile = users[user].profile || {};
      const uScores = users[user].scores || {};
      const numScores = Object.keys(uScores).length;
      
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="padding: 8px 0;">${user}</td>
        <td>${uProfile.level || "N/A"}</td>
        <td>${uProfile.language || "N/A"}</td>
        <td>${numScores} items</td>
      `;
      tbody.appendChild(tr);
    }
  }
}

// Navigation Functions
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "Login.html";
}

function goHome() {
  window.location.href = "index.html";
}
