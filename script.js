const wrapper = document.querySelector(".wrapper");
const generateBtn = document.querySelector(".form button");
const qrInput = document.querySelector(".form input");
const qrImg = document.querySelector(".qr-code img");
const downloadBtn = document.getElementById("download-btn");

generateBtn.addEventListener("click", () => {
  let qrValue = qrInput.value;
  if (!qrValue) return;

  generateBtn.innerText = "Generating QR-Code...";

  let url = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${qrValue}`;

  qrImg.src = url;
  downloadBtn.href = url;

  qrImg.addEventListener("load", () => {
    wrapper.classList.add("active");
    generateBtn.innerText = "Generate QR-Code";
  });
});
