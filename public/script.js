const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

// eslint-disable-next-line no-undef
const socket = io();

// Espera que o iframe seja carregado
window.addEventListener('load', () => {
    // Obtém a referência para o iframe
    var login = document.getElementById('login');

    // Obtém o documento dentro do iframe
    var loginDocument = login.contentDocument || login.contentWindow.document;

    const formLogin = loginDocument.getElementById("login-form");
    const usernameLogin = loginDocument.getElementById("usernameLogin");
    const roomCode = loginDocument.getElementById("roomCode");

    formLogin.addEventListener('submit', (event) => {
        event.preventDefault();

        let value = roomCode.value;

        // Remove caracteres não numéricos
        value = value.replace(/\D/g, '');

        // Limita o número máximo de caracteres em 6
        if (value.length > 6) {
            value = value.substr(0, 6);
        }

        if (usernameLogin.value && value.length === 6) {
            socket.emit('join room', { username: usernameLogin.value, roomCode: value });
        } else {
            alert(value);
        }
    })
});

socket.on('join room', (room) => {
    const login = document.getElementById('login');
    const loading = document.getElementById('loading-text');
    const chat = document.getElementById('chat');

    if (room.users.length === 1) {
        login.style.display = 'none';
        loading.style.display = 'flex';
    } else if (room.users.length >= 2) {
        login.style.display = 'none';
        loading.style.display = 'none';
        chat.style.display = 'flex';
    }
});

const BOT_MSGS = [
    "Hi, how are you?",
    "Ohh... I can't understand what you trying to say. Sorry!",
    "I like to play games... But I don't know how to play!",
    "Sorry if my answers are not relevant. :))",
    "I feel sleepy! :("
];

// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "https://image.flaticon.com/icons/svg/327/327779.svg";
const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const BOT_NAME = "BOT";
const PERSON_NAME = "Sajad";

msgerForm.addEventListener("submit", event => {
    event.preventDefault();

    const msgText = msgerInput.value;
    if (!msgText) return;

    appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
    msgerInput.value = "";

    botResponse();
});

function appendMessage(name, img, side, text) {
    //   Simple solution for small apps
    const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
}

function botResponse() {
    const r = random(0, BOT_MSGS.length - 1);
    const msgText = BOT_MSGS[r];
    const delay = msgText.split(" ").length * 100;

    setTimeout(() => {
        appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
    }, delay);
}

// Utils
function get(selector, root = document) {
    return root.querySelector(selector);
}

function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();

    return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}