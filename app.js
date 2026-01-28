document.addEventListener("DOMContentLoaded", function () {
    var currentLessonKey = localStorage.getItem("currentLesson") || "lesson1";
    var words = WORDS_BY_LESSON[currentLessonKey].words;
    var memoryData = JSON.parse(localStorage.getItem("memoryData")) || {};

    var korean = document.getElementById("korean");
    var vietnamese = document.getElementById("vietnamese");
    var statusText = document.getElementById("statusText");
    var progressText = document.getElementById("progress");
    var speakBtn = document.getElementById("speakBtn");

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
        progressText.textContent = "Remembered: " + knownCount + " / " + words.length;
    }

    function loadLesson(lessonKey) {
        currentLessonKey = lessonKey;
        localStorage.setItem("currentLesson", lessonKey);
        words = WORDS_BY_LESSON[lessonKey].words;
        highlightLesson();
        showWord();
    }

    function highlightLesson() {
        document.querySelectorAll(".lesson-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.lesson === currentLessonKey);
        });
    }

    // Gắn sự kiện nút lesson
    document.querySelectorAll(".lesson-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            loadLesson(this.dataset.lesson);
            document.getElementById("sidebar").classList.remove("show"); // ẩn menu trên mobile
        });
    });

    // Toggle menu mobile
    document.getElementById("menuToggle").addEventListener("click", function() {
        document.getElementById("sidebar").classList.toggle("show");
    });

    // Nút TTS
    speakBtn.addEventListener("click", () => {
        if (korean.textContent) {
            const utter = new SpeechSynthesisUtterance(korean.textContent);
            utter.lang = 'ko-KR';
            speechSynthesis.speak(utter);
        }
    });

    knownBtn.onclick = () => saveWordStatus("known");
    unknownBtn.onclick = () => saveWordStatus("unknown");
    resetBtn.onclick = () => {
        memoryData = {};
        localStorage.removeItem("memoryData");
        showWord();
    };

    highlightLesson();
    showWord();
});
