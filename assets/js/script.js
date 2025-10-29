const container = document.querySelector(".container");
const generateBtn = document.getElementById("generate-btn");
const qrInput = document.querySelector(".input-box input");
const inputContainer = document.querySelector(".input-box");
const clearBtn = document.querySelector(".input-box i");
const sizeSelect = document.getElementById("size-select");
const qrImg = document.querySelector(".qr-code img");
const qrText = document.querySelector(".qr-text");
const loadingSpinner = document.querySelector(".loading-spinner");
const downloadBtn = document.getElementById("download-btn");
const copyBtn = document.getElementById("copy-btn");
const resetBtn = document.getElementById("reset-btn");
const recentHistory = document.querySelector(".recent-history");
const historyList = document.querySelector(".history-list");

let currentQRData = null;
let history = JSON.parse(localStorage.getItem("qrHistory") || "[]");

// Initialize
updateHistoryDisplay();
updateInputState();

// Event Listeners
generateBtn.addEventListener("click", generateQRCode);
qrInput.addEventListener("input", updateInputState);
qrInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") generateQRCode();
});
qrInput.addEventListener("paste", () => {
  setTimeout(() => {
    if (qrInput.value.trim()) {
      generateQRCode();
    }
  }, 100);
});

clearBtn.addEventListener("click", clearInput);
resetBtn.addEventListener("click", resetQRCode);
downloadBtn.addEventListener("click", downloadQRCode);
copyBtn.addEventListener("click", copyQRCode);

function updateInputState() {
  const hasContent = qrInput.value.trim().length > 0;
  inputContainer.classList.toggle("has-content", hasContent);
  generateBtn.disabled = !hasContent;
}

function clearInput() {
  qrInput.value = "";
  qrInput.focus();
  updateInputState();
}

function resetQRCode() {
  container.classList.remove("active");
  clearInput();
}

async function generateQRCode() {
  const qrValue = qrInput.value.trim();
  if (!qrValue) return;

  const size = sizeSelect.value;

  // Show loading state
  generateBtn.innerHTML = '<i class="ri-loader-4-line"></i> Generating...';
  generateBtn.disabled = true;
  loadingSpinner.style.display = "flex";
  qrImg.style.display = "none";

  try {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(
      qrValue
    )}`;

    // Test if the image loads successfully
    await new Promise((resolve, reject) => {
      const testImg = new Image();
      testImg.onload = resolve;
      testImg.onerror = reject;
      testImg.src = url;
    });

    qrImg.src = url;
    qrText.textContent = qrValue;
    currentQRData = { text: qrValue, url: url, size: size };

    // Add to history
    addToHistory(currentQRData);

    qrImg.onload = () => {
      loadingSpinner.style.display = "none";
      qrImg.style.display = "block";
      container.classList.add("active");
      generateBtn.innerHTML = "Generate QR Code";
      generateBtn.disabled = false;
    };
  } catch (error) {
    loadingSpinner.style.display = "none";
    generateBtn.innerHTML = "Generate QR Code";
    generateBtn.disabled = false;
    alert("Failed to generate QR code. Please check your input and try again.");
  }
}

async function downloadQRCode() {
  if (!currentQRData) return;

  try {
    const a = document.createElement("a");
    a.href = await toDataURL(currentQRData.url);
    const fileName = `qrcode_${currentQRData.size}_${Date.now()}.png`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Update button temporarily
    const originalContent = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="ri-check-line"></i> Downloaded';
    setTimeout(() => {
      downloadBtn.innerHTML = originalContent;
    }, 2000);
  } catch (error) {
    alert("Failed to download QR code.");
  }
}

async function copyQRCode() {
  if (!currentQRData) return;

  try {
    const response = await fetch(currentQRData.url);
    const blob = await response.blob();

    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);

    // Update button temporarily
    const originalContent = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="ri-check-line"></i> Copied';
    setTimeout(() => {
      copyBtn.innerHTML = originalContent;
    }, 2000);
  } catch (error) {
    // Fallback: copy the text instead
    try {
      await navigator.clipboard.writeText(currentQRData.text);
      const originalContent = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="ri-check-line"></i> Text Copied';
      setTimeout(() => {
        copyBtn.innerHTML = originalContent;
      }, 2000);
    } catch (textError) {
      alert("Failed to copy QR code.");
    }
  }
}

function addToHistory(qrData) {
  // Remove duplicate if exists
  history = history.filter((item) => item.text !== qrData.text);

  // Add to beginning
  history.unshift({
    text: qrData.text,
    url: qrData.url,
    size: qrData.size,
    timestamp: Date.now(),
  });

  // Keep only last 10 items
  history = history.slice(0, 10);

  // Save to localStorage
  localStorage.setItem("qrHistory", JSON.stringify(history));

  updateHistoryDisplay();
}

function updateHistoryDisplay() {
  if (history.length === 0) {
    recentHistory.style.display = "none";
    return;
  }

  recentHistory.style.display = "block";
  historyList.innerHTML = "";

  history.forEach((item, index) => {
    const historyItem = document.createElement("div");
    historyItem.className = "history-item";
    historyItem.innerHTML = `
      <img src="${item.url}" alt="QR Code">
      <div class="history-item-text">${item.text}</div>
    `;

    historyItem.addEventListener("click", () => {
      qrInput.value = item.text;
      sizeSelect.value = item.size;
      updateInputState();
      generateQRCode();
    });

    historyList.appendChild(historyItem);
  });
}

async function toDataURL(url) {
  try {
    const blob = await fetch(url).then((res) => res.blob());
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error converting to data URL:", error);
    throw error;
  }
}
