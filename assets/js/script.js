const textInput = document.getElementById("text-input");
const urlInput = document.getElementById("url-input");
const ssidInput = document.getElementById("ssid-input");
const passwordInput = document.getElementById("password-input");
const encryptionSelect = document.getElementById("encryption-select");
const sizeSlider = document.getElementById("size");
const sizeLabel = document.querySelector('label[for="size"]');
const fgColorPicker = document.getElementById("fg-color");
const bgColorPicker = document.getElementById("bg-color");
const qrImg = document.getElementById("qr-code");
const downloadBtn = document.getElementById("download-btn");
const copyBtn = document.getElementById("copy-btn");

let currentQRData = null;
let currentTab = "text";

function initializeDummyData() {
  textInput.value = "Hello, World!";
  urlInput.value = "https://example.com";
  ssidInput.value = "MyHomeWiFi";
  passwordInput.value = "password123";
  encryptionSelect.value = "WPA";
}

initializeDummyData();
updateSizeLabel();
generateQRCode();

textInput.addEventListener("input", generateQRCode);
urlInput.addEventListener("input", generateQRCode);
ssidInput.addEventListener("input", generateQRCode);
passwordInput.addEventListener("input", generateQRCode);
encryptionSelect.addEventListener("change", generateQRCode);
sizeSlider.addEventListener("input", () => {
  updateSizeLabel();
  generateQRCode();
});
fgColorPicker.addEventListener("input", generateQRCode);
bgColorPicker.addEventListener("input", generateQRCode);
downloadBtn.addEventListener("click", downloadQRCode);
copyBtn.addEventListener("click", copyQRCode);

document.addEventListener("tabChanged", (e) => {
  currentTab = e.detail.tab;
  generateQRCode();
});

function updateSizeLabel() {
  const size = sizeSlider.value;
  sizeLabel.textContent = `Size: ${size}px`;
}

function getQRData() {
  let data = "";

  switch (currentTab) {
    case "text":
      data = textInput.value.trim();
      break;
    case "url":
      data = urlInput.value.trim();
      break;
    case "wifi":
      const ssid = ssidInput.value.trim();
      const password = passwordInput.value.trim();
      const encryption = encryptionSelect.value;

      if (ssid) {
        // WiFi QR code format: WIFI:T:WPA;S:mynetwork;P:mypassword;;
        data = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
      }
      break;
  }

  return data;
}

function generateQRCode() {
  const qrValue = getQRData();

  if (!qrValue) {
    qrImg.style.opacity = "0.3";
    qrImg.alt = "No data";
    return;
  }

  const size = sizeSlider.value;
  const fgColor = fgColorPicker.value.substring(1);
  const bgColor = bgColorPicker.value.substring(1);

  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    qrValue
  )}&color=${fgColor}&bgcolor=${bgColor}`;

  qrImg.src = url;
  qrImg.style.opacity = "1";
  qrImg.alt = "Generated QR Code";

  currentQRData = {
    text: qrValue,
    url: url,
    size: size,
    fgColor: fgColorPicker.value,
    bgColor: bgColorPicker.value,
  };
}

async function downloadQRCode() {
  if (!currentQRData || !getQRData()) return;

  try {
    const response = await fetch(currentQRData.url);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    const fileName = `qrcode_${currentQRData.size}_${Date.now()}.png`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

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
  if (!currentQRData || !getQRData()) return;

  try {
    const response = await fetch(currentQRData.url);
    const blob = await response.blob();

    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);

    const originalContent = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="ri-check-line"></i> Copied';
    setTimeout(() => {
      copyBtn.innerHTML = originalContent;
    }, 2000);
  } catch (error) {
    try {
      await navigator.clipboard.writeText(currentQRData.text);
      const originalContent = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="ri-check-line"></i> Text Copied';
      setTimeout(() => {
        copyBtn.innerHTML = originalContent;
      }, 2000);
    } catch (textError) {
      alert("Failed to copy QR code. It might be due to browser restrictions.");
    }
  }
}
