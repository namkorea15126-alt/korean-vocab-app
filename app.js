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

// Lấy danh sách từ chưa nhớ
function getUnlearnedWords() {
    return words.filter(w => memoryData[w.id] !== "known");
}

// Hiển thị từ hiện tại
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

    if (memoryData[word.id] === "known") {
        statusText.textContent = "✅ Đã nhớ";
    } else if (memoryData[word.id] === "unknown") {
        statusText.textContent = "❌ Chưa nhớ";
    } else {
        statusText.textContent = "🤔 Chưa đánh dấu";
    }

    updateProgress();
}

// Lưu trạng thái từ
function saveWordStatus(status) {
    var remainingWords = getUnlearnedWords();
    if (remainingWords.length === 0) return;

    var word = remainingWords[index % remainingWords.length];
    memoryData[word.id] = status;
    localStorage.setItem("memoryData", JSON.stringify(memoryData));
    console.log("Word ID " + word.id + " marked as " + status);
}

// Chuyển sang từ tiếp theo
function nextWord() {
    var remainingWords = getUnlearnedWords();
    if (remainingWords.length === 0) return;

    index++;
    showWord();
    console.log("Next word, index:", index);
}

// Cập nhật tiến độ
function updateProgress() {
    var knownCount = Object.values(memoryData).filter(v => v === "known").length;
    var total = words.length;
    progressText.textContent = "Đã nhớ: " + knownCount + " / " + total +
        " (" + Math.round((knownCount / total) * 100) + "%)";
}

// Reset dữ liệu
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
window.onload = function() {
    console.log("App loaded");
    showWord();
    updateProgress();

    nextBtn.onclick = nextWord;
    knownBtn.onclick = function() {
        saveWordStatus("known");
        nextWord();
    };
    unknownBtn.onclick = function() {
        saveWordStatus("unknown");
        nextWord();
    };
    resetBtn.onclick = resetData;
};
