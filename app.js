// ===================== 1. DATA =====================
var words = WORDS;        // danh sách từ vựng
var index = 0;            // vị trí từ hiện tại
var memoryData = JSON.parse(localStorage.getItem("memoryData")) || {};

// ===================== 2. ELEMENTS =====================
var korean = document.getElementById("korean");
var vietnamese = document.getElementById("vietnamese");
var statusText = document.getElementById("statusText");
var progressText = document.getElementById("progress");

var knownBtn = document.getElementById("knownBtn");
var unknownBtn = document.getElementById("unknownBtn");
var resetBtn = document.getElementById("resetBtn"); // nút reset

// ===================== 3. FUNCTIONS =====================

// 3.1 Lấy danh sách từ chưa nhớ
function getUnlearnedWords() {
    return words.filter(w => memoryData[w.id] !== "known");
}

// 3.2 Hiển thị từ và trạng thái
function showWord() {
    var remainingWords = getUnlearnedWords();
    if (remainingWords.length === 0) {
        korean.textContent = "🎉 Bạn đã học xong tất cả từ!";
        vietnamese.textContent = "";
        statusText.textContent = "";
        return;
    }

    // cập nhật từ hiện tại
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

// 3.3 Lưu trạng thái từ
function saveWordStatus(status) {
    var remainingWords = getUnlearnedWords();
    var word = remainingWords[index % remainingWords.length];
    memoryData[word.id] = status;
    localStorage.setItem("memoryData", JSON.stringify(memoryData));
}

// 3.4 Chuyển sang từ tiếp theo
function nextWord() {
    var remainingWords = getUnlearnedWords();
    if (remainingWords.length === 0) return; // hết từ chưa học
    index++;
    showWord();
}

// 3.5 Cập nhật tiến độ và phần trăm
function updateProgress() {
    var knownCount = Object.values(memoryData).filter(v => v === "known").length;
    var total = words.length;
    progressText.textContent = "Đã nhớ: " + knownCount + " / " + total +
        " (" + Math.round((knownCount / total) * 100) + "%)";
}

// 3.6 Reset toàn bộ dữ liệu
function resetData() {
    if (confirm("Bạn có chắc chắn muốn học lại từ đầu?")) {
        memoryData = {};
        localStorage.setItem("memoryData", JSON.stringify(memoryData));
        index = 0;
        showWord();
    }
}

// ===================== 4. EVENTS =====================
knownBtn.onclick = function() {
    saveWordStatus("known");
    nextWord();
};

unknownBtn.onclick = function() {
    saveWordStatus("unknown");
    nextWord();
};

resetBtn.onclick = resetData;

// ===================== 5. INIT =====================
showWord();
updateProgress();







