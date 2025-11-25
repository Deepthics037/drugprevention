// --- SPEECH TO TEXT (MIC INPUT) ---
const voiceBtn = document.getElementById("voiceBtn");
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
        document.getElementById("userInput").value = text;
        voiceBtn.textContent = "🎤 Speak";
        sendMessage();  // auto send
    };

    recognition.onerror = () => {
        voiceBtn.textContent = "🎤 Speak";
    };
} else {
    voiceBtn.textContent = "Mic Not Supported";
}

// --- TEXT CHAT (NO API – SIMPLE LOGIC) ---
document.getElementById("sendBtn").addEventListener("click", sendMessage);

function sendMessage() {
    let input = document.getElementById("userInput");
    let message = input.value.trim();

    if (message === "") return;

    addMessage("You", message);
    input.value = "";

    // Simple offline reply logic
    let botReply = generateReply(message);

    addMessage("Bot", botReply);
    speak(botReply); // Voice Output
}

// --- SIMPLE RULE-BASED BOT AI ---
function generateReply(msg) {
    msg = msg.toLowerCase();

    if (msg.includes("hi") || msg.includes("hello")) return "Hello! How can I help you?";
    if (msg.includes("stress")) return "Take a deep breath. Try to relax — I'm here to help.";
    if (msg.includes("sad")) return "I'm sorry you're feeling sad. Would you like to talk about it?";
    if (msg.includes("help")) return "Sure, tell me what support you need.";

    return "I understand. Please explain a little more.";
}

// --- TEXT-TO-SPEECH ---
function speak(text) {
    let speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    speech.pitch = 1;
    speech.rate = 1;
    speech.volume = 1;
    speechSynthesis.speak(speech);
}

// --- PRINT MESSAGES ---
function addMessage(sender, text) {
    let box = document.getElementById("chatBox");
    box.innerHTML += `<p><strong>${sender}:</strong> ${text}</p>`;
    box.scrollTop = box.scrollHeight;
}
