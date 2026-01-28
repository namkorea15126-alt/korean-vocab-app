document.addEventListener("DOMContentLoaded", function() {
    // Giả sử WORDS được định nghĩa trong words.js
    var words = WORDS;

    // Lấy dữ liệu học đã lưu từ localStorage, nếu chưa có thì tạo mới
    var memoryData = JSON.parse(localStorage.getItem("memoryData")) || {};

    // Lấy các phần tử DOM
    var korean = document.getElementById("korean");
    var vietnamese = document.getElementById("vietnamese");
    var statusText = document.getElementById("statusText");
    var progressText = document.getElementById("progress");
    var knownBtn = document.getElementById("knownBtn");
    var unknownBtn = document.getElementById("unknownBtn");
    var resetBtn = document.getElementById("resetBtn");

    // Hàm lấy các từ chưa được đánh dấu "known"
    function getUnlearnedWords() {
        return words.filter(w => memoryData[w.id] !== "known");
    }

    // Hàm hiển thị từ mới
    function showWord() {
        var remainingWords = getUnlearnedWords();

        if (remainingWords.length === 0) {
            korean.textContent = "🎉 You have finished learning all the words!";
            vietnamese.textContent = "";
            statusText.textContent = "";
            progressText.textContent = `Remembered: ${words.length} / ${words.length} (100%)`;
            return;
        }

        // Chọn ngẫu nhiên một từ chưa học
        var word = remainingWords[Math.floor(Math.random() * remainingWords.length)];

        korean.textContent = word.ko;
        vietnamese.textContent = word.vi;

        // Hiển thị trạng thái từ
        if (memoryData[word.id] === "known") {
            statusText.textContent = "✅ Remembered";
        } else if (memoryData[word.id] === "unknown") {
            statusText.textContent = "❌ Not Remembered";
        } else {
            statusText.textContent = "🤔 Unmarked";
        }

        updateProgress();
    }

    // Lưu trạng thái từ hiện tại và hiển thị từ mới
    function saveWordStatus(status) {
        var currentKo = korean.textContent;
        var word = words.find(w => w.ko === currentKo);
        if (!word) return;

        memoryData[word.id] = status;
        localStorage.setItem("memoryData", JSON.stringify(memoryData));

        showWord(); // Hiển thị từ mới ngay lập tức
    }

    // Cập nhật tiến độ học
    function updateProgress() {
        var knownCount = Object.values(memoryData).filter(v => v === "known").length;
        var total = words.length;
        var percent = total === 0 ? 0 : Math.round((knownCount / total) * 100);

        progressText.textContent = `Remembered: ${knownCount} / ${total} (${percent}%)`;
    }

    // Reset dữ liệu học
    function resetData() {
        if (confirm("Are you sure you want to start learning again?")) {
            memoryData = {};
            localStorage.setItem("memoryData", JSON.stringify(memoryData));
            showWord();
        }
    }

    // Thêm sự kiện cho các nút
    knownBtn.addEventListener("click", function() {
        saveWordStatus("known");
    });

    unknownBtn.addEventListener("click", function() {
        saveWordStatus("unknown");
    });

    resetBtn.addEventListener("click", resetData);

    // Hiển thị từ đầu tiên khi load trang
    showWord();
});
