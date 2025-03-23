const wrapper = document.querySelector(".wrapper");
const generateBtn = document.querySelector(".form button");
const qrInput = document.querySelector(".form input");
const qrImg = document.querySelector(".qr-code img");
const downloadBtn = document.getElementById("download-btn");

generateBtn.addEventListener("click", () => {
  let qrValue = qrInput.value;
  if (!qrValue) return;

  generateBtn.innerHTML = '<i class="ri-loop-left-line"></i> Generating QR-Code...';

  let url = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${qrValue}`;

  qrImg.src = url;
  downloadBtn.addEventListener("click", () => download(url));

  qrImg.addEventListener("load", () => {
    wrapper.classList.add("active");
    generateBtn.innerText = "Generate QR-Code";
  });
});

async function download(url) {
  const a = document.createElement("a");
  a.href = await toDataURL(url);
  a.download = "qrcode.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function toDataURL(url) {
  const blob = await fetch(url).then(res => res.blob());
  return URL.createObjectURL(blob);
}