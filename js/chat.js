// ==========================================================
// ระบบแชท
// ==========================================================

let currentUser = null;

// เปิดห้องแชท
async function startConversation(postId, otherUserId, otherUserName) {

    if (!requireLogin()) return;

    currentUser = otherUserId;

    switchTab("chat");

    document.getElementById("chatWithLabel").innerHTML =
        "กำลังแชทกับ : " + otherUserName;

    loadMessages();

}

// โหลดข้อความ
async function loadMessages() {

    if (!currentUser) return;

    try {

        const myId = getCurrentUserId();

        const { data } = await api.get(
            `/messages/${myId}/${currentUser}`
        );

        renderMessages(data);

    } catch (err) {

        console.log(err);

    }

}

// แสดงข้อความ
function renderMessages(messages) {

    const box = document.getElementById("chatMessages");

    const myId = Number(getCurrentUserId());

    box.innerHTML = "";

    messages.forEach(msg => {

        const div = document.createElement("div");

        div.className =
            Number(msg.sender_id) === myId
                ? "chat-bubble chat-bubble-mine"
                : "chat-bubble chat-bubble-theirs";

        div.innerText = msg.message;

        box.appendChild(div);

    });

    box.scrollTop = box.scrollHeight;

}

// ส่งข้อความ
async function sendChatMessage(e) {

    e.preventDefault();

    if (!currentUser) return;

    const input = document.getElementById("chatInput");

    const text = input.value.trim();

    if (text === "") return;

    try {

        await api.post("/messages", {

            sender_id: getCurrentUserId(),

            receiver_id: currentUser,

            message: text

        });

        input.value = "";

        loadMessages();

    } catch (err) {

        alert(err.message);

    }

}