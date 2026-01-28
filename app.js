document.addEventListener("DOMContentLoaded", function () {

  var currentLessonKey = "lesson1";
  var words = WORDS_BY_LESSON[currentLessonKey].words;

  var memoryData = JSON.parse(localStorage.getItem("memoryData")) || {};

  var korean = document.getElementById("korean");
  var vietnamese = document.getElementById("vietnamese");
  var statusText = document.getElementById("statusText");
  var progressText = document.getElementById("progress");

  var knownBtn = document.getElementById("knownBtn");
  var unknownBtn = document.getElementById("unknownBtn");
  var resetBtn = document.getElementById("resetBtn");

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

  function loadLesson(lessonKey) {
    currentLessonKey = lessonKey;
    words = WORDS_BY_LESSON[lessonKey].words;
    showWord();
  }

  // Gắn menu bài học
  document.querySelectorAll(".lesson-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      loadLesson(this.dataset.lesson);
    });
  });

  knownBtn.onclick = () => saveWordStatus("known");
  unknownBtn.onclick = () => saveWordStatus("unknown");
  resetBtn.onclick = () => {
    memoryData = {};
    localStorage.removeItem("memoryData");
    showWord();
  };

  showWord();
});
