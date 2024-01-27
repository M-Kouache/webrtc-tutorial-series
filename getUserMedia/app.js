const localStreamElement = document.querySelector("video#localStream");
const captureMediaBtn = document.querySelector("button#init-call-btn");
const noDataLabel = document.querySelector("div#no-data-label");
const closeMediaBtn = document.querySelector("button#close-call-btn");
const constraints = {
  audio: true,
  video: true,
};

closeMediaBtn.disabled = true;

async function initMediaCapture() {
  noDataLabel.style.display = "none";
  closeMediaBtn.disabled = false;
  captureMediaBtn.disabled = true;

  try {
    webCamStream = await navigator.mediaDevices.getUserMedia(constraints);
    localStreamElement.srcObject = webCamStream;
  } catch (e) {
    alert("permission denied!!", e);
  }
}

async function closeMediaCapture() {
  if (localStreamElement.srcObject) {
    localStreamElement.pause();
    localStreamElement.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
  }
  noDataLabel.style.display = "block";
  closeMediaBtn.disabled = true;
  captureMediaBtn.disabled = false;
}
