const WORKER_URL = "https://bashar-ai.bashirbelloaliyu0.workers.dev/";

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = type === "user" ? "user-message" : "ai-message";
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    localStorage.setItem("chat", chatBox.innerHTML);
    const oldChat = localStorage.getItem("chat");
if(oldChat){
    chatBox.innerHTML = oldChat;
}
}

async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, "user");
    input.value = "";

    const loading = document.createElement("div");
    loading.className = "ai-message";
    loading.id = "loading";
    loading.textContent = "⏳ Bashir AI yana tunani...";
    chatBox.appendChild(loading);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch(WORKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        document.getElementById("loading").remove();

        const reply =
            data.choices?.[0]?.message?.content ||
            data.message ||
            "Ba a samu amsa ba.";

        addMessage(reply, "ai");

    } catch (error) {
        document.getElementById("loading").remove();
        addMessage("❌ An samu matsala wajen haɗawa da AI.", "ai");
        console.error(error);
    }
}
const themeBtn = document.getElementById("themeBtn");

document.body.classList.add("dark");

themeBtn.onclick = () => {
    if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
        document.body.classList.add("light");
        themeBtn.textContent = "☀️";
        localStorage.setItem("theme","light");
    } else {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
        themeBtn.textContent = "🌙";
        localStorage.setItem("theme","dark");
    }
};

const savedTheme = localStorage.getItem("theme");
if(savedTheme){
    document.body.className = savedTheme;
    themeBtn.textContent = savedTheme==="dark" ? "🌙":"☀️";
}
const voiceBtn = document.getElementById("voiceBtn");

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;

    voiceBtn.onclick = () => {
    alert("An danna microphone");
    recognition.start();
};

    recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    userInput.value = text;

    // Aika saƙon kai tsaye
    sendMessage();
};
    recognition.onerror = () => {
        voiceBtn.textContent = "🎤";
        alert("Ba a iya amfani da murya a wannan browser.");
    };

    recognition.onend = () => {
        voiceBtn.textContent = "🎤";
    };
} else {
    voiceBtn.style.display = "none";
}
recognition.onstart = () => {
    voiceBtn.textContent = "🎙️ Ana sauraro...";
};

recognition.onend = () => {
    voiceBtn.textContent = "🎤";
};
const imageBtn = document.getElementById("imageBtn");
const imageInput = document.getElementById("imageInput");

imageBtn.onclick = () => imageInput.click();

imageInput.onchange = async () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {

        addMessage("📷 An tura hoto", "user");

        const response = await fetch(WORKER_URL,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                image:reader.result,
                message:"Ka bayyana wannan hoto cikin Hausa."
            })
        });

        const data = await response.json();

        addMessage(
            data.choices?.[0]?.message?.content ||
            "Ba a samu amsa ba",
            "ai"
        );

    };

    reader.readAsDataURL(file);
};
const imageBtn = document.getElementById("imageBtn");
const imageInput = document.getElementById("imageInput");

imageBtn.addEventListener("click", () => {
    imageInput.click();
});imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (!file) return;

    alert("An zaɓi hoto: " + file.name);
});
