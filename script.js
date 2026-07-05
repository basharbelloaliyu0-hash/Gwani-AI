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
