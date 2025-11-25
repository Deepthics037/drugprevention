document.addEventListener('DOMContentLoaded', () => {

  // ==== YEAR ====
  document.getElementById('year').textContent = new Date().getFullYear();

  // ==== SMOOTH SCROLL ====
  document.querySelectorAll('.main-nav a').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // ==== CONTACT FORM ====
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(contactForm);
    try{
      const res = await fetch('contact.php', {method:'POST', body:fd});
      const json = await res.json();
      document.getElementById('contactResult').textContent = json.message || 'Sent';
      if(json.success) contactForm.reset();
    } catch(err){
      document.getElementById('contactResult').textContent = 'Network error';
    }
  });

  // ==== CHATBOT VOICE + TEXT ====
  const chatInput = document.getElementById("chatInput");
  const sendChat = document.getElementById("sendChat");
  const chatLog = document.getElementById("chatLog");
  const voiceBtn = document.getElementById("voiceBtn");

  function appendMsg(text, who='bot') {
    const d = document.createElement('div');
    d.className = 'msg ' + who;
    d.textContent = text;
    chatLog.appendChild(d);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  // Offline AI rules
  function offlineAI(msg) {
    msg = msg.toLowerCase().trim();
    if(msg.includes("hi") || msg.includes("hello")) return "Hello! How can I help you today?";
    if(msg.includes("how are you")) return "I'm doing great, thanks! How are you feeling?";
    if(msg.includes("help")) return "Sure! Tell me what's troubling you.";
    if(msg.includes("stress")) return "Take a deep breath. Remember, you are not alone.";
    if(msg.includes("sad")) return "I'm sorry to hear that. Would you like to share more?";
    if(msg.includes("drug") || msg.includes("addiction")) return "Stay strong! Avoid drugs and focus on healthy habits.";
    if(msg.includes("bye")) return "Goodbye! Take care of yourself.";
    return "I understand. Can you please tell me more?";
  }

  function speak(text) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-IN";
    utter.rate = 1;
    utter.pitch = 1;
    speechSynthesis.speak(utter);
  }

  function sendMessage() {
    const text = chatInput.value.trim();
    if(!text) return;

    appendMsg(text, 'user');
    chatInput.value = "";

    const reply = offlineAI(text);
    appendMsg(reply, 'bot');
    speak(reply);
  }

  sendChat.addEventListener("click", sendMessage);
  chatInput.addEventListener("keydown", e => { if(e.key === "Enter") sendMessage(); });

  // Speech-to-Text (mic input)
  let recognition;
  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceBtn.addEventListener("click", () => {
      recognition.start();
      voiceBtn.textContent = "🎙 Listening...";
    });

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      chatInput.value = text;
      voiceBtn.textContent = "🎤 Speak";
      sendMessage();
    };

    recognition.onerror = () => {
      voiceBtn.textContent = "🎤 Speak";
    };
  } else {
    voiceBtn.textContent = "Mic Not Supported";
  }

  // ==== MOOD TRACKER + CAMERA ====
  const slider = document.getElementById('moodSlider');
  const moodValue = document.getElementById('moodValue');
  const submitMood = document.getElementById('submitMood');
  const moodNote = document.getElementById('moodNote');
  const moodResult = document.getElementById('moodResult');
  const startCamera = document.getElementById('startCamera');
  const stopCamera = document.getElementById('stopCamera');
  const capture = document.getElementById('capture');
  const video = document.getElementById('video');
  const snapshot = document.getElementById('snapshot');

  slider.addEventListener('input', () => moodValue.textContent = slider.value);

  let stream = null;
  async function startCam(){
    try{
      stream = await navigator.mediaDevices.getUserMedia({video:true,audio:false});
      video.srcObject = stream;
      document.getElementById('cameraStatus').textContent = 'Camera active';
    }catch(err){
      document.getElementById('cameraStatus').textContent = 'Camera error: ' + err.message;
    }
  }
  async function stopCam(){
    if(stream){
      stream.getTracks().forEach(t=>t.stop());
      stream = null;
      video.srcObject = null;
    }
    document.getElementById('cameraStatus').textContent = 'Camera stopped';
  }
  startCamera.addEventListener('click', startCam);
  stopCamera && stopCamera.addEventListener('click', stopCam);

  capture.addEventListener('click', async () => {
    if(!stream){
      moodResult.textContent = 'Start the camera first or submit using slider.';
      return;
    }
    snapshot.width = video.videoWidth;
    snapshot.height= video.videoHeight;
    snapshot.getContext('2d').drawImage(video, 0,0);
    const dataUrl = snapshot.toDataURL('image/jpeg', 0.85);

    const fd = new FormData();
    fd.append('mood', slider.value);
    fd.append('note', moodNote.value || '');
    fd.append('image', dataURItoBlob(dataUrl), 'snap.jpg');

    try{
      const res = await fetch('mood.php', {method:'POST', body:fd});
      const json = await res.json();
      moodResult.textContent = json.message || 'Saved';
      if(json.success) moodNote.value = '';
    }catch(err){
      moodResult.textContent = 'Upload error';
    }
  });

  submitMood.addEventListener('click', async ()=>{
    const fd = new FormData();
    fd.append('mood', slider.value);
    fd.append('note', moodNote.value || '');
    try{
      const res = await fetch('mood.php', {method:'POST', body:fd});
      const json = await res.json();
      moodResult.textContent = json.message || 'Saved';
      if(json.success) moodNote.value = '';
    }catch(err){
      moodResult.textContent = 'Network error';
    }
  });

  function dataURItoBlob(dataURI){
    const parts = dataURI.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8 = new Uint8Array(n);
    while(n--) u8[n] = bstr.charCodeAt(n);
    return new Blob([u8], {type:mime});
  }

});
