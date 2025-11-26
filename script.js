console.log('App loaded');

let currentChat = null;     
let currentBlock = null;   
let currentNodeId = null;     
let currentFigure = null;     
let chatHistory = [];

const topicConfigs = {
    ww1: {
        title: 'Перша світова війна',
        figure: {
            name: 'Михайло Грушевський',
            role: 'Історик, політичний діяч',
            avatar: '👨‍🎓'
        },
        intro: 'Вітаю! Я Михайло Грушевський, український історик та політичний діяч. Перша світова війна була переломним моментом для України. Що б ви хотіли дізнатися про цей період?',
        prompts: [
            'Розкажіть про причини війни',
            'Як війна вплинула на Україну?',
            'Що таке Центральна Рада?',
            'Які були наслідки війни?'
        ]
    },
    revolution: {
        title: 'Українська революція',
        figure: {
            name: 'Симон Петлюра',
            role: 'Політичний діяч, військовий',
            avatar: '🎖️'
        },
        intro: 'Вітаю! Я Симон Петлюра. Українська революція 1917-1921 років була спробою українського народу здобути незалежність. Готовий відповісти на ваші запитання.',
        prompts: [
            'Що таке УНР?',
            'Розкажіть про боротьбу за незалежність',
            'Хто були ваші союзники?',
            'Чому революція не вдалася?'
        ]
    },
    cossacks: {
        title: 'Козацька доба',
        figure: {
            name: 'Богдан Хмельницький',
            role: 'Гетьман України',
            avatar: '⚔️'
        },
        intro: 'Слава Україні! Я Богдан Хмельницький, гетьман Війська Запорозького. Розповім вам про славну козацьку добу та боротьбу за волю.',
        prompts: [
            'Розкажіть про повстання 1648 року',
            'Чому укладено Переяславську угоду?',
            'Як жили козаки?',
            'Що таке Запорозька Січ?'
        ]
    },
    rus: {
        title: 'Київська Русь',
        figure: {
            name: 'Ярослав Мудрий',
            role: 'Великий князь Київський',
            avatar: '👑'
        },
        intro: 'Вітаю! Я Ярослав Мудрий, великий князь Київський. Розповім вам про славну Київську Русь - колиску східнослов\'янської цивілізації.',
        prompts: [
            'Розкажіть про заснування Києва',
            'Що таке "Руська Правда"?',
            'Як прийняли християнство?',
            'Чому Русь розпалася?'
        ]
    },
    ww2: {
        title: 'Друга світова війна',
        figure: {
            name: 'Роман Шухевич',
            role: 'Командир УПА',
            avatar: '🛡️'
        },
        intro: 'Доброго дня. Я Роман Шухевич. Друга світова війна принесла Україні величезні страждання, але й показала силу духу нашого народу.',
        prompts: [
            'Розкажіть про УПА',
            'Як почалася війна для України?',
            'Що відбувалося на окупованих територіях?',
            'Як закінчилася війна?'
        ]
    },
    independence: {
        title: 'Незалежність України',
        figure: {
            name: 'Леонід Кравчук',
            role: 'Перший Президент України',
            avatar: '🇺🇦'
        },
        intro: 'Вітаю! Я Леонід Кравчук, перший Президент незалежної України. 1991 рік став початком нової ери для нашої держави.',
        prompts: [
            'Як Україна здобула незалежність?',
            'Що таке Біловезька угода?',
            'Які були перші кроки молодої держави?',
            'Які виклики стояли перед Україною?'
        ]
    }
};

function createMockBlockFromTopic(topicId, config) {
    const introNodeId = `node-${topicId}-intro`;
    const answerNodeId = `node-${topicId}-answer`;

    const choiceOptions = config.prompts.map((prompt, index) => ({
        id: `opt-${topicId}-${index + 1}`,
        title: prompt,
        nextNodeId: answerNodeId
    }));

    return {
        id: `block-${topicId}`,
        title: config.title,
        content: `${config.title} - інтерактивна історія`,
        introductionContext: {
            description: config.intro,
            events: [] 
        },
        startNodeId: introNodeId,
        nodes: {
            [introNodeId]: {
                id: introNodeId,
                role: 'chatbot', 
                content: config.intro,
                speakerName: config.figure.name,
                speakerImage: null,
                interaction: {
                    type: 'choice',
                    options: choiceOptions
                }
            },
            [answerNodeId]: {
                id: answerNodeId,
                role: 'chatbot',
                content:
                    `Чудове запитання! Зараз сценарій для «${config.title}» працює у демо-режимі. ` +
                    `Надалі тут будуть розгалужені історії, події та деталі з повним графом діалогів.`,
                speakerName: config.figure.name,
                speakerImage: null,
                interaction: {
                    type: 'linear',
                    nextNodeId: null
                }
            }
        }
    };
}

const blocksByTopicId = {};
Object.keys(topicConfigs).forEach(topicId => {
    blocksByTopicId[topicId] = createMockBlockFromTopic(topicId, topicConfigs[topicId]);
});


function showPage(pageId) {
    console.log('Showing page:', pageId);
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}


function checkAuth() {
    const user = localStorage.getItem('chronos_user');
    if (user) {
        showPage('topicsPage');
        displayUser(JSON.parse(user));
    } else {
        createDemoUser();
        showPage('loginPage');
    }
}

function createDemoUser() {
    const users = JSON.parse(localStorage.getItem('chronos_users') || '[]');
    const demoExists = users.find(u => u.email === 'demo@chronos.com');

    if (!demoExists) {
        const demoUser = {
            id: 'demo-1',
            firstName: 'Валерія',
            lastName: 'Кучер',
            email: 'demo@chronos.com',
            password: 'demo123',
            points: 1250,
            achievements: 12
        };
        users.push(demoUser);
        localStorage.setItem('chronos_users', JSON.stringify(users));
        console.log('Demo user created: Валерія Кучер');
    }
}

function displayUser(user) {
    const fullName = user.firstName + ' ' + user.lastName;
    const initials = (user.firstName[0] + user.lastName[0]).toUpperCase();

    document.getElementById('userName').textContent = fullName;
    document.getElementById('userAvatar').textContent = initials;
    document.getElementById('userPoints').textContent = user.points.toLocaleString();
    document.getElementById('userAchievements').textContent = user.achievements;

    // Chat page
    document.getElementById('chatUserName').textContent = fullName;
    document.getElementById('chatUserAvatar').textContent = initials;
}

function logout() {
    localStorage.removeItem('chronos_user');
    chatHistory = [];
    currentBlock = null;
    currentNodeId = null;
    currentFigure = null;
    showPage('loginPage');
}


function addMessage(type, content, author = '', avatar = '') {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    let html = '';

    if (type === 'ai' || type === 'user') {
        html += '<div class="message-header">';
        if (avatar) html += `<span style="font-size: 24px;">${avatar}</span>`;
        if (author) html += `<span class="message-author">${author}</span>`;
        html += '</div>';
    }

    html += `<div class="message-content">${content}</div>`;

    messageDiv.innerHTML = html;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    chatHistory.push({ type, content, author });
}

function clearChoices() {
    const messagesDiv = document.getElementById('chatMessages');
    const choiceBlocks = messagesDiv.querySelectorAll('.choices');
    choiceBlocks.forEach(el => el.remove());
}

function showChoices(options) {
    const messagesDiv = document.getElementById('chatMessages');
    const choicesDiv = document.createElement('div');
    choicesDiv.className = 'choices';

    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = option.title;
        btn.onclick = () => {
            const user = JSON.parse(localStorage.getItem('chronos_user'));
            const userName = user.firstName + ' ' + user.lastName;
            addMessage('user', option.title, userName, '👤');

            clearChoices();
            playNode(option.nextNodeId);
        };
        choicesDiv.appendChild(btn);
    });

    messagesDiv.appendChild(choicesDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function playNode(nodeId) {
    if (!currentBlock || !currentBlock.nodes) return;
    const node = currentBlock.nodes[nodeId];
    if (!node) return;

    currentNodeId = nodeId;

    let messageType;
    if (node.role === 'user') messageType = 'user';
    else if (node.role === 'chatbot') messageType = 'ai';
    else if (node.role === 'narrator') messageType = 'narrator';

    let author = '';
    let avatar = '';

    if (node.role === 'chatbot') {
        author = node.speakerName || (currentFigure ? currentFigure.name : 'CHRONOS');
        avatar = currentFigure ? currentFigure.avatar : '🤖';
    } else if (node.role === 'user') {
        const user = JSON.parse(localStorage.getItem('chronos_user'));
        author = user ? (user.firstName + ' ' + user.lastName) : 'Ви';
        avatar = '👤';
    } else if (node.role === 'narrator') {
        author = '';
        avatar = '📚';
    }

    addMessage(messageType, node.content, author, avatar);

    clearChoices();

    if (node.interaction && node.interaction.type === 'linear') {
        const nextId = node.interaction.nextNodeId;
        if (nextId) {
            setTimeout(() => playNode(nextId), 800);
        }
    } else if (node.interaction && node.interaction.type === 'choice') {
        showChoices(node.interaction.options || []);
    }
}

function openChat(topicId) {
    console.log('Opening chat (block-based):', topicId);

    const block = blocksByTopicId[topicId];
    const config = topicConfigs[topicId];

    if (!block || !config) {
        alert('Ця тема ще в розробці!');
        return;
    }

    currentBlock = block;
    currentChat = null;
    currentNodeId = null;
    chatHistory = [];
    currentFigure = config.figure;

    document.getElementById('figureName').textContent = currentFigure.name;
    document.getElementById('figureRole').textContent = currentFigure.role;
    document.getElementById('figureAvatar').textContent = currentFigure.avatar;

    const messagesDiv = document.getElementById('chatMessages');
    messagesDiv.innerHTML = '';

    const inputArea = document.getElementById('inputArea');
    if (inputArea) {
        inputArea.style.display = 'none'; // або 'flex', якщо хочеш вільний чат
    }

    addMessage('narrator', `Розпочинається розмова про «${config.title}»...`, '📚');

    const startId = currentBlock.startNodeId;
    if (startId) {
        setTimeout(() => {
            playNode(startId);
        }, 500);
    }

    showPage('chatPage');
}

function sendMessage() {
    const input = document.getElementById('userInput');
    if (!input) return;

    const message = input.value.trim();
    if (!message) return;

    const user = JSON.parse(localStorage.getItem('chronos_user'));
    const userName = user ? (user.firstName + ' ' + user.lastName) : 'Ви';

    addMessage('user', message, userName, '👤');
    input.value = '';

    const figureName = currentFigure ? currentFigure.name : 'CHRONOS';
    addMessage(
        'ai',
        'Зараз діалог працює у сценарному режимі. Будь ласка, використовуйте кнопки-вибори під повідомленнями, щоб рухатися далі по історії.',
        figureName,
        currentFigure ? currentFigure.avatar : '🤖'
    );
}

function showMessage(elementId, type, text) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.className = type;
    el.textContent = text;
    el.style.display = 'block';
}

document.getElementById('regForm').addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('Registration submitted');

    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;

    try {
        let users = JSON.parse(localStorage.getItem('chronos_users') || '[]');

        if (users.find(u => u.email === email)) {
            showMessage('regMessage', 'error', '❌ Користувач з таким email вже існує!');
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            points: 0,
            achievements: 0
        };

        users.push(newUser);
        localStorage.setItem('chronos_users', JSON.stringify(users));
        localStorage.setItem('chronos_user', JSON.stringify(newUser));

        showMessage(
            'regMessage',
            'success',
            '✅ Реєстрація успішна! Вітаємо, ' + firstName + ' ' + lastName + '!'
        );

        setTimeout(() => {
            showPage('topicsPage');
            displayUser(newUser);
        }, 1500);

    } catch (error) {
        showMessage('regMessage', 'error', '❌ Помилка: ' + error.message);
    }
});

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
        const users = JSON.parse(localStorage.getItem('chronos_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('chronos_user', JSON.stringify(user));

            const fullName = user.firstName + ' ' + user.lastName;
            showMessage('loginMessage', 'success', '✅ Вхід успішний! Вітаємо, ' + fullName + '!');

            setTimeout(() => {
                showPage('topicsPage');
                displayUser(user);
            }, 1500);
        } else {
            showMessage('loginMessage', 'error', '❌ Невірний email або пароль!');
        }
    } catch (error) {
        showMessage('loginMessage', 'error', '❌ Помилка: ' + error.message);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('userInput');
    if (input) {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
});


checkAuth();
