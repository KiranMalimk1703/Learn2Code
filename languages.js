// for selecting language //

// for python //
function selectLanguage(language) {
  localStorage.setItem("selectedLanguage", language);
  alert(language + " selected!");
  window.location.href = "python/notes.html";
}


// for c //
function selectLanguage(language) {
  localStorage.setItem("selectedLanguage", language);
  alert(language + " selected!");
  window.location.href = "C/notes.html";
}


// for c++ //
function selectedLanguage(language) {
  localStorage.setItem("selectedLanguage", language);
  alert(language + " selected!");
  windows.location.href = "c++/notes.html";
}

// for js //
function selectedLanguage(language) {
  localStorage.setItem("selectedLanguage", language);
  alert(language + " selected!");
  windows.location.href = "javascript/notes.html";
}


// for java //
function selectedLanguage(language) {
  localStorage.setItem("selectedLanguage", language);
  alert(language + " selected!");
  windows.location.href = "java/notes.html";
}



//for navigation button //
function goHome() {
  window.location.href = "index.html";
}
