document.addEventListener("DOMContentLoaded", function() {
    var words = WORDS;
    var index = 0;
    var memoryData = JSON.parse(localStorage.getItem("memoryData")) || {};

    var korean = document.getElementById("korean");
    var vietnamese = document.getElementById("vietnamese");
    var statusText = document.getElementById("statusText");
    var progressText = document.getElementById("progress");

    var nextBtn = document.getElementById("nextBtn");
    var knownBtn = document.getElementById("knownBtn");
    var unknownBtn = document.getElementById("unknownBtn");
    var resetBtn = document.getElementById("resetBtn");

    function getUnlearnedWords() {
        return words.filter(w => memoryData[w.id] !== "known");
    }

    function showWord() {
        var remainingWords = getUnlearnedWords();
        if (remainingWords.length === 0) {
            korean.textContent = "🎉 You have finished learning all the words!";
            vietnamese.textContent = "";
            statusText.textContent = "";
            return;
        }
        var word = remainingWords[index % remainingWords.length];
        korean.textContent = word.ko;
        vietnamese.textContent = word.vi;

        if (memoryData[word.id] === "known") statusText.textContent = "✅ Remembered";
        else if (memoryData[word.id] === "unknown") statusText.textContent = "❌ Not Remembered";
        else statusText.textContent = "🤔 Unmarked";

        updateProgress();
    }

    function saveWordStatus(status) {
        var remainingWords = getUnlearnedWords();
        if (remainingWords.length === 0) return;
        var word = remainingWords[index % remainingWords.length];
        memoryData[word.id] = status;
        localStorage.setItem("memoryData", JSON.stringify(memoryData));
    }

    function nextWord() {
        index++;
        showWord();
    }

    function updateProgress() {
        var knownCount = Object.values(memoryData).filter(v => v === "known").length;
        var total = words.length;
        progressText.textContent = "Remembered: " + knownCount + " / " + total +
            " (" + Math.round((knownCount / total) * 100) + "%)";
    }

    function resetData() {
        if (confirm("Are you sure start learning again?")) {
            memoryData = {};
            localStorage.setItem("memoryData", JSON.stringify(memoryData));
            index = 0;
            showWord();
        }
    }

    nextBtn.addEventListener("click", nextWord);
    knownBtn.addEventListener("click", function() { saveWordStatus("known"); nextWord(); });
    unknownBtn.addEventListener("click", function() { saveWordStatus("unknown"); nextWord(); });
    resetBtn.addEventListener("click", resetData);

    showWord();
});


