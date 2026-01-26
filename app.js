// ===================== 1. DATA =====================
var words = [
 { id: 1, ko: "안녕하세요", vi: "Xin chào" },
  { id: 2, ko: "감사합니다", vi: "Cảm ơn" },
  { id: 3, ko: "사랑", vi: "Tình yêu" },
  { id: 4, ko: "학교", vi: "Trường học" }
];

var index = 0;            // vị trí từ hiện tại
var memoryData = JSON.parse(localStorage.getItem("memoryData")) || {};
// memoryData = {1:"known", 2:"unknown"}
// lưu trạng thái từ vựng đã nhớ/chưa nhớ

// ===================== 2. ELEMENTS =====================
var korean = document.getElementById("korean");          // thẻ hiển thị tiếng Hàn
var vietnamese = document.getElementById("vietnamese");  // thẻ hiển thị nghĩa
var statusText = document.getElementById("statusText");  // thẻ hiển thị trạng thái
var progressText = document.getElementById("progress");  // thẻ hiển thị tiến độ

// ===================== 3. FUNCTIONS =====================

// 3.1 Hiển thị từ và trạng thái
function showWord() {
    korean.textContent = words[index].ko;
    vietnamese.textContent = words[index].vi;

    var wordId = words[index].id;
    if (memoryData[wordId] === "known") {
        statusText.textContent = "✅ Đã nhớ";
    } else if (memoryData[wordId] === "unknown") {
        statusText.textContent = "❌ Chưa nhớ";
    } else {
        statusText.textContent = "🤔 Chưa đánh dấu";
    }

    updateProgress(); // luôn cập nhật tiến độ sau khi hiển thị
}

// 3.2 Lưu trạng thái từ
function saveWordStatus(status) {
    var wordId = words[index].id;
    memoryData[wordId] = status;
    localStorage.setItem("memoryData", JSON.stringify(memoryData)); // lưu vĩnh viễn
}

// 3.3 Chuyển sang từ tiếp theo
function nextWord() {
    index++;
    if (index >= words.length) index = 0; // quay lại đầu nếu hết từ
    showWord(); // hiển thị từ mới
}

// 3.4 Cập nhật tiến độ
function updateProgress() {
    var knownCount = Object.values(memoryData).filter(v => v === "known").length;
    progressText.textContent = "Đã nhớ: " + knownCount + " / " + words.length;
}

// ===================== 4. EVENTS =====================

// Nút Đã nhớ
document.getElementById("knownBtn").onclick = function() {
    saveWordStatus("known");
    nextWord();
};

// Nút Chưa nhớ
document.getElementById("unknownBtn").onclick = function() {
    saveWordStatus("unknown");
    nextWord();
};

// ===================== 5. INIT =====================
showWord();       // load từ đầu tiên
updateProgress(); // load tiến độ ban đầu






