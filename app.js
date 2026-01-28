document.addEventListener("DOMContentLoaded", function() {
    var words = WORDS;

    // Lấy dữ liệu học đã lưu
    var memoryData = JSON.parse(localStorage.getItem("memoryData")) || {};

    // DOM elements
    var korean = document.getElementById("korean");
    var vietnamese = document.getElementById("vietnamese");
    var statusText = document.getElementById("statusText");
    var progressText = document.getElementById("progress");
    var knownBtn = document.getElementById("knownBtn");
    var unknownBtn = document.getElementById("unknownBtn");
    var resetBtn = document.getElementById("resetBtn");

    // Lấy các từ chưa đánh dấu "known"
    function getUnlearnedWords() {
        return words.filter(w => memoryData[w.id] !== "known");
    }

    // Hiển thị từ
    function showWord() {
        var remainingWords = getUnlearnedWords();

        if (remainingWords.length === 0) {
            korean.textContent = "🎉 You have finished learning all the words!";
            vietnamese.textContent = "";
            statusText.textContent = "";
            progressText.textContent = `Remembered: ${words.length} / ${words.length} (100%)`;
            return;
        }

        // Chọn từ ngẫu nhiên
        var word = remainingWords[Math.floor(Math.random() * remainingWords.length)];

        korean.textContent = word.ko;
        vietnamese.textContent = word.vi;

        if (memoryData[word.id] === "known") {
            statusText.textContent = "✅ Remembered";
        } else if (memoryData[word.id] === "unknown") {
            statusText.textContent = "❌ Not Remembered";
        } else {
            statusText.textContent = "🤔 Unmarked";
        }

        updateProgress();
    }

    // Lưu trạng thái từ
    function saveWordStatus(status) {
        var currentKo = korean.textContent;
        var word = words.find(w => w.ko === currentKo);
        if (!word) return;

        memoryData[word.id] = status;
        localStorage.setItem("memoryData", JSON.stringify(memoryData));

        showWord();
    }

    // Cập nhật tiến độ
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

    // Nút sự kiện
    knownBtn.addEventListener("click", function() {
        saveWordStatus("known");
    });

    unknownBtn.addEventListener("click", function() {
        saveWordStatus("unknown");
    });

    resetBtn.addEventListener("click", resetData);

    showWord();
});
