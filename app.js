document.addEventListener("DOMContentLoaded", function() {
    // ===================== DATA =====================
    var words = WORDS;
    var index = 0;
    var memoryData = JSON.parse(localStorage.getItem("memoryData")) || {};

    // ===================== ELEMENTS =====================
    var korean = document.getElementById("korean");
    var vietnamese = document.getElementById("vietnamese");
    var statusText = document.getElementById("statusText");
    var progressText = document.getElementById("progress");

    var nextBtn = document.getElementById("nextBtn");
    var knownBtn = document.getElementById("knownBtn");
    var unknownBtn = document.getElementById("unknownBtn");
    var resetBtn = document.getElementById("resetBtn");

    // ===================== FUNCTIONS =====================
    function getUnlearnedWords() {
        return words.filter(w => memoryData[w.id] !== "known");
    }

    function showWord() {
        var remainingWords = getUnlearnedWords();
        if (remainingWords.length === 0) {
            korean.textContent = "🎉 Bạn đã học xong tất cả từ!";
            vietnamese.textContent = "";
            statusText.textContent = "";
            return;
        }
        var word = remainingWords[index % remainingWords.length];
        korean.textContent = word.ko;
        vietnamese.textContent = word.vi;

        if (memoryData[word.id] === "known") statusText.textContent = "✅ Đã nhớ";
        else if (memoryData[word.id] === "unknown") statusText.textContent = "❌ Chưa nhớ";
        else statusText.textContent = "🤔 Chưa đánh dấu";

        updateProgress();
    }

    function saveWordStatus(status) {
        var remainingWords = getUnlearnedWords();
        if (remainingWords.length === 0) return;
        var word = remainingWords[index % remainingWords.length];
        memoryData[word.id] = status;
        localStorage.setItem("memoryData", JSON.stringify(memoryData));
        console.log("Word ID " + word.id + " marked as " + status);
    }

    function nextWord() {
        var remainingWords = getUnlearnedWords();
        if (remainingWords.length === 0) return;
        index++;
        showWord();
        console.log("Next word, index:", index);
    }

    function updateProgress() {
        var knownCount = Object.values(memoryData).filter(v => v === "known").length;
        var total = words.length;
        progressText.textContent = "Đã nhớ: " + knownCount + " / " + total +
            " (" + Math.round((knownCount / total) * 100) + "%)";
    }

    function resetData() {
        if (confirm("Bạn có chắc chắn muốn học lại từ đầu?")) {
            memoryData = {};
            localStorage.setItem("memoryData", JSON.stringify(memoryData));
            index = 0;
            showWord();
            console.log("Memory reset");
        }
    }

    // ===================== EVENTS =====================
    nextBtn.addEventListener("click", nextWord);
    knownBtn.addEventListener("click", function() {
        saveWordStatus("known");
        nextWord();
    });
    unknownBtn.addEventListener("click", function() {
        saveWordStatus("unknown");
        nextWord();
    });
    resetBtn.addEventListener("click", resetData);

    // ===================== INIT =====================
    console.log("App loaded, DOM fully ready");
    showWord();
    updateProgress();
});
