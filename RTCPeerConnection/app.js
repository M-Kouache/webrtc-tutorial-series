const startBtn = document.querySelector("button#start-btn");
const callBtn = document.querySelector("button#call-btn");
const hangupBtn = document.querySelector("button#hangup-btn");
// Declare variables for local and remote peer connections
let localPeerConnection;
let remotePeerConnection;
let localStream;
const constraints = {
  audio: true,
  video: true,
};

hangupBtn.disabled = true;
callBtn.disabled = true;

startBtn.addEventListener("click", addLocalStream);
callBtn.addEventListener("click", startConnection);
hangupBtn.addEventListener("click", hangup);

function getOtherPeerConnection(peer) {
  return peer === localPeerConnection
    ? remotePeerConnection
    : localPeerConnection;
}

// Function to create a local peer connection
function createLocalPeerConnection() {
  localPeerConnection = new RTCPeerConnection();
  // Add event listeners and configure the connection
  localPeerConnection.onicecandidate = (e) =>
    handleICECandidateEvent(localPeerConnection, e);
}

// Function to create a remote peer connection
function createRemotePeerConnection() {
  remotePeerConnection = new RTCPeerConnection();
  // Add event listeners and configure the connection
  remotePeerConnection.onicecandidate = (e) =>
    handleICECandidateEvent(remotePeerConnection, e);
  remotePeerConnection.ontrack = handleTrackEvent;
}

// Function to add audio and video streams to the local peer connection
async function addLocalStream() {
  localStream = await navigator.mediaDevices.getUserMedia(constraints);
  document.getElementById("localStream").srcObject = localStream;
  callBtn.disabled = false;
}

function addStreamToPeerConnection() {
  localStream
    .getTracks()
    .forEach((track) => localPeerConnection.addTrack(track, localStream));
}

//
async function handleICECandidateEvent(peer, event) {
  try {
    console.log("other peer", getOtherPeerConnection(peer));
    await getOtherPeerConnection(peer).addIceCandidate(event.candidate);
  } catch (e) {
    console.log("error:", peer, e);
  }
}

// Function to create a data channel for peer-to-peer data exchange
function createDataChannel() {
  const dataChannel = localPeerConnection.createDataChannel("myDataChannel");
  // Add event listeners for data channel events
}

// Function to initiate the connection
async function startConnection() {
  createLocalPeerConnection();
  createRemotePeerConnection();
  addStreamToPeerConnection();

  hangupBtn.disabled = false;

  // Create an offer and set it as the local description
  const offer = await localPeerConnection.createOffer();
  try {
    localPeerConnection.setLocalDescription(offer);
  } catch (e) {
    console.log("error while creatting offer", e);
  }

  // Setting the offer to the remote peer
  try {
    remotePeerConnection.setRemoteDescription(offer);
  } catch (e) {
    console.log("error while creatting offer", e);
  }
  try {
    handleRemoteOffer(offer);
  } catch (e) {
    console.log("error while creatting answer", e);
  }
}

// Function to handle the remote offer and create an answer
async function handleRemoteOffer(offer) {
  remotePeerConnection.setRemoteDescription(offer);

  // Create an answer and set it as the local description
  const answer = await remotePeerConnection.createAnswer();
  remotePeerConnection.setLocalDescription(answer);

  // Setting the answer to the local peer (via signaling)
  localPeerConnection.setRemoteDescription(answer);
}

function handleTrackEvent(event) {
  document.getElementById("remoteStream").srcObject = event.streams[0];
}

function hangup() {
   const videoElement = document.getElementById('localStream')
  localPeerConnection.close();
  remotePeerConnection.close();
  localPeerConnection = null;
  remotePeerConnection = null;
  localStream = null;
    videoElement.pause();
    videoElement.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
    hangupBtn.disabled = true;
  callBtn.disabled = true;
  startBtn.desabled = false;
}
