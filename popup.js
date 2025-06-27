const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chat");
const themeToggle = document.getElementById("themeToggle");

const BACKEND_URL = "https://chatbot-production-5d4f.up.railway.app/api/chat";

window.addEventListener("offline", () => {
  appendMessage("System", "⚠️ You are offline. Please reconnect to continue.", "loading");
  userInput.disabled = true;
  sendBtn.disabled = true;
});

window.addEventListener("online", () => {
  userInput.disabled = false;
  sendBtn.disabled = false;
});

themeToggle.addEventListener("change", () => {
  const isLight = themeToggle.checked;
  document.body.classList.toggle("light", isLight);
  chrome.storage.local.set({ theme: isLight ? "light" : "dark" });
});

document.addEventListener("DOMContentLoaded", () => {
  loadChatHistory();
  chrome.storage.local.get("theme", ({ theme }) => {
    const isLight = theme === "light";
    themeToggle.checked = isLight;
    document.body.classList.toggle("light", isLight);
  });
});

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});

sendBtn.addEventListener("click", async () => {
  const input = userInput.value.trim();
  if (!input) return;

  appendMessage("You", input, "user");
  userInput.value = "";

  const loadingMsg = appendMessage("NexBot", "NexBot is thinking...", "loading");

  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();
    const reply = data?.reply || "No response.";
    updateMessage(loadingMsg, reply, "gemini");
  } catch (err) {
    updateMessage(loadingMsg, "❌ Server not responding.", "gemini");
  }
});

function appendMessage(sender, text, type) {
  const msg = document.createElement("div");
  msg.classList.add("message");

  if (type === "user") {
    msg.classList.add("user");
    msg.textContent = text;
  } else if (type === "gemini") {
    msg.classList.add("gemini");

    const textWrapper = document.createElement("span");
    textWrapper.textContent = text;

    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "Copy";
    copyBtn.title = "Copy response";

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy"), 1000);
      });
    });

    msg.appendChild(textWrapper);
    msg.appendChild(copyBtn);
  } else if (type === "loading") {
    msg.classList.add("loading");
    msg.textContent = text;
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (type === "user" || type === "gemini") {
    saveMessageToStorage(sender, text);
  }

  return msg;
}

function updateMessage(msgElem, newText, newClass) {
  msgElem.classList.remove("loading");
  msgElem.classList.add(newClass);
  msgElem.innerHTML = "";

  if (newClass === "gemini") {
    const textWrapper = document.createElement("span");
    textWrapper.textContent = newText;

    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "Copy";
    copyBtn.title = "Copy response";

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(newText).then(() => {
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy"), 1000);
      });
    });

    msgElem.appendChild(textWrapper);
    msgElem.appendChild(copyBtn);
  } else {
    msgElem.textContent = newText;
  }

  saveMessageToStorage("NexBot", newText);
}

function saveMessageToStorage(sender, text) {
  chrome.storage.local.get({ chatHistory: [] }, (data) => {
    const updated = [...data.chatHistory, { sender, text }];
    chrome.storage.local.set({ chatHistory: updated });
  });
}

function loadChatHistory() {
  chrome.storage.local.get({ chatHistory: [] }, (data) => {
    data.chatHistory.forEach((msg) => {
      appendMessage(msg.sender, msg.text, msg.sender.toLowerCase());
    });
  });
}
