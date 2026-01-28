document.addEventListener("DOMContentLoaded", function () {

  // ====== STATE ======
  var savedLesson = localStorage.getItem("currentLesson") || "lesson1";
  var currentLessonKey = savedLesson;
  var words = WORDS_BY_LESSON[currentLessonKey].words;

  var memoryData = JSON.parse(localStorage.getItem("memoryData")) || {};

  // ====== ELEMENTS ======
  var korean = document.getElementById("korean");
  var vietnamese = document.getElementById("vietnamese");
  var statusText = document.getElementById("statusText");
  var progressText = document.getElementById("progress");

  var knownBtn = document.getElementById("knownBtn");
  var unknownBtn = document.getElementById("unknownBtn");
  var resetBtn = document.getElementById("resetBtn");

  var sidebar = document.getElementById("sidebar");
  var toggleMenuBtn = document.getElementById("toggleMenu");

  // ====== WORD LOGIC ======
  function getUnlearnedWords() {
    return words.filter(w => memoryData[w.id] !== "known");
  }

  function showWord() {
    var remainingWords = getUnlearnedWords();

    if (remainingWords.length === 0) {
      korean.textContent = "🎉 Finished this lesson!";
      vietnamese.textContent = "";
      statusText.textContent = "";
      updateProgress();
      return;
    }

    var word = remainingWords[Math.floor(Math.random() * remainingWords.length)];
    korean.textContent = word.ko;
    vietnamese.textContent = word.vi;
    statusText.textContent = "";
    updateProgress();
  }

  function saveWordStatus(status) {
    var word = words.find(w => w.ko === korean.textContent);
    if (!word) return;

    memoryData[word.id] = status;
    localStorage.setItem("memoryData", JSON.stringify(memoryData));
    showWord();
  }

  function updateProgress() {
    var knownCount = words.filter(w => memoryData[w.id] === "known").length;
    progressText.textContent =
      "Remembered: " + knownCount + " / " + words.length;
  }

  // ====== LESSON LOGIC ======
  function highlightLesson(lessonKey) {
    document.querySelectorAll(".lesson-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lesson === lessonKey);
    });
  }

  function loadLesson(lessonKey) {
    currentLessonKey = lessonKey;
    words = WORDS_BY_LESSON[lessonKey].words;
    localStorage.setItem("currentLesson", lessonKey);

    highlightLesson(lessonKey);
    showWord();

    // auto close menu on mobile
    sidebar.classList.remove("open");
  }

  document.querySelectorAll(".lesson-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      loadLesson(this.dataset.lesson);
    });
  });

  // ====== BUTTONS ======
  knownBtn.onclick = () => saveWordStatus("known");
  unknownBtn.onclick = () => saveWordStatus("unknown");
  resetBtn.onclick = () => {
    memoryData = {};
    localStorage.removeItem("memoryData");
    showWord();
  };

  // ====== MENU TOGGLE ======
  toggleMenuBtn.addEventListener("click", function () {
    sidebar.classList.toggle("open");
  });

  // ====== SWIPE MENU (MOBILE) ======
  let startX = 0;

  document.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  document.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;
    if (endX - startX > 80) sidebar.classList.add("open");     // swipe right
    if (startX - endX > 80) sidebar.classList.remove("open");  // swipe left
  });

  // ====== INIT ======
  highlightLesson(currentLessonKey);
  showWord();
});
