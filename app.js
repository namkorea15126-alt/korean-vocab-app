document.addEventListener("DOMContentLoaded", function () {

  // ===== STATE =====
  let currentLessonKey = localStorage.getItem("currentLesson") || "lesson1";
  let words = WORDS_BY_LESSON[currentLessonKey].words;
  let memoryData = JSON.parse(localStorage.getItem("memoryData")) || {};

  // ===== ELEMENTS =====
  const korean = document.getElementById("korean");
  const vietnamese = document.getElementById("vietnamese");
  const statusText = document.getElementById("statusText");
  const progressText = document.getElementById("progress");
  const speakBtn = document.getElementById("speakBtn");

  const knownBtn = document.getElementById("knownBtn");
  const unknownBtn = document.getElementById("unknownBtn");
  const resetBtn = document.getElementById("resetBtn");

  const sidebar = document.getElementById("sidebar");
  const toggleMenuBtn = document.getElementById("toggleMenu");
  const lessonList = document.getElementById("lessonList");

  // ===== BUILD MENU =====
  function buildLessonMenu() {
    lessonList.innerHTML = "";

    Object.keys(WORDS_BY_LESSON).forEach(key => {
      const btn = document.createElement("button");
      btn.className = "lesson-btn";
      btn.dataset.lesson = key;
      btn.textContent = WORDS_BY_LESSON[key].title;

      btn.onclick = () => loadLesson(key);
      lessonList.appendChild(btn);
    });

    highlightLesson(currentLessonKey);
  }

  function highlightLesson(key) {
    document.querySelectorAll(".lesson-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lesson === key);
    });
  }

  // ===== WORD LOGIC =====
  function getUnlearnedWords() {
    return words.filter(w => memoryData[w.id] !== "known");
  }

  function showWord() {
    const remaining = getUnlearnedWords();

    if (remaining.length === 0) {
      korean.textContent = "🎉 Finished!";
      vietnamese.textContent = "";
      progressText.textContent = "";
      return;
    }

    const word = remaining[Math.floor(Math.random() * remaining.length)];
    korean.textContent = word.ko;
    vietnamese.textContent = word.vi;
    updateProgress();
  }

  function saveWordStatus(status) {
    const word = words.find(w => w.ko === korean.textContent);
    if (!word) return;

    memoryData[word.id] = status;
    localStorage.setItem("memoryData", JSON.stringify(memoryData));
    showWord();
  }

  function updateProgress() {
    const knownCount = words.filter(w => memoryData[w.id] === "known").length;
    progressText.textContent = `Remembered: ${knownCount} / ${words.length}`;
  }

  // ===== LESSON =====
  function loadLesson(key) {
    currentLessonKey = key;
    words = WORDS_BY_LESSON[key].words;
    localStorage.setItem("currentLesson", key);

    highlightLesson(key);
    showWord();
    sidebar.classList.remove("open");
  }

  // ===== TTS (KOREAN) =====
  function speakKorean(text) {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = 0.8;

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }

  speakBtn.onclick = () => speakKorean(korean.textContent);

  // ===== BUTTONS =====
  knownBtn.onclick = () => saveWordStatus("known");
  unknownBtn.onclick = () => saveWordStatus("unknown");
  resetBtn.onclick = () => {
    memoryData = {};
    localStorage.removeItem("memoryData");
    showWord();
  };

  // ===== MENU =====
  toggleMenuBtn.onclick = () => sidebar.classList.toggle("open");

  // ===== SWIPE (MOBILE) =====
  let startX = 0;
  document.addEventListener("touchstart", e => startX = e.touches[0].clientX);
  document.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;
    if (endX - startX > 80) sidebar.classList.add("open");
    if (startX - endX > 80) sidebar.classList.remove("open");
  });

  // ===== INIT =====
  buildLessonMenu();
  showWord();
});
