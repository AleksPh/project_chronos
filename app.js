/* ================= AUTHENTICATION ================= */

function register() {
    const name = document.getElementById("reg-name").value.trim();
    const birthdate = document.getElementById("reg-birthdate").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const pass = document.getElementById("reg-password").value.trim();

    if (!name || !birthdate || !email || !pass) {
        alert("Заповніть всі поля");
        return;
    }

    // Simple email validation
    if (!email.includes("@")) {
        alert("Введіть коректну електронну адресу");
        return;
    }

    // Save user data
    localStorage.setItem("chronos-user", JSON.stringify({
        name: name,
        birthdate: birthdate,
        email: email,
        pass: pass
    }));

    alert("Реєстрація успішна! Тепер ви можете увійти.");
    window.location.href = "index.html";
}

function login() {
    const email = document.getElementById("login-email").value.trim();
    const pass = document.getElementById("login-password").value.trim();

    if (!email || !pass) {
        alert("Заповніть всі поля");
        return;
    }

    const user = JSON.parse(localStorage.getItem("chronos-user"));
    
    if (!user) {
        alert("Користувача не знайдено. Спочатку зареєструйтеся.");
        return;
    }

    if (user.email === email && user.pass === pass) {
        localStorage.setItem("chronos-logged", "1");
        window.location.href = "chat.html";
    } else {
        alert("Невірний email або пароль");
    }
}

function logout() {
    localStorage.removeItem("chronos-logged");
    window.location.href = "index.html";
}

/* ================= CHAT PAGE FUNCTIONS ================= */

function updateUserBadge() {
    const user = JSON.parse(localStorage.getItem("chronos-user"));
    const badges = document.querySelectorAll(".user-badge");
    
    if (user && badges.length > 0) {
        badges.forEach(badge => {
            const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            badge.setAttribute('data-initials', initials);
            badge.textContent = user.name;
            badge.style.cursor = 'pointer';
            badge.onclick = logout;
        });
    }
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active-page');
    }
}

function openTopics() {
    showPage('topics-page');
}

function openModeModal() {
    document.getElementById('mode-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('mode-modal').style.display = 'none';
}

// Close modal on outside click
window.onclick = function(e) {
    const modal = document.getElementById('mode-modal');
    if (modal && e.target === modal) {
        modal.style.display = 'none';
    }
};

/* ================= LEARNING MODE ================= */

const story = {
    "blocks": [
        {
            "nodes": {
                "node_1": {
                    "role": "chatbot",
                    "speakerName": "Михайло Грушевський",
                    "speakerImage": "hrushevsky.jpg",
                    "content": "Вітаю, друже! Імперія впала, і перед нами відкривається великий шлях. Ми створили Центральну Раду, щоб об'єднати народ. Але нам треба визначити нашу головну мету зараз. Чого ми вимагаємо від Петрограда?",
                    "interaction": {
                        "choice": {
                            "options": [
                                {
                                    "title": "Автономії у складі федеративної Росії",
                                    "nextNodeId": "node_2_correct"
                                },
                                {
                                    "title": "Негайної повної незалежності",
                                    "nextNodeId": "node_2_wrong"
                                }
                            ]
                        }
                    }
                },
                "node_2_correct": {
                    "role": "chatbot",
                    "speakerName": "Михайло Грушевський",
                    "speakerImage": "hrushevsky.jpg",
                    "content": "Саме так! Зараз ми ще не маємо армії та адміністрації для повної незалежності. Наша мета — національно-територіальна автономія. Це перший крок.",
                    "interaction": {
                        "linear": {
                            "nextNodeId": "node_3"
                        }
                    }
                },
                "node_2_wrong": {
                    "role": "chatbot",
                    "speakerName": "Михайло Грушевський",
                    "speakerImage": "hrushevsky.jpg",
                    "content": "Це смілива думка, як у міхновців! Але більшість у Раді (і я теж) вважаємо, що зараз це передчасно. Світ нас не знає, армії немає. Тому історично ми обрали курс на Автономію.",
                    "interaction": {
                        "linear": {
                            "nextNodeId": "node_3"
                        }
                    }
                },
                "node_3": {
                    "role": "narrator",
                    "content": "(Минає час. Травень 1917 року. Делегація УЦР повертається з Петрограда ні з чим. Тимчасовий уряд відмовив у наданні автономії).",
                    "interaction": {
                        "linear": {
                            "nextNodeId": "node_4"
                        }
                    }
                },
                "node_4": {
                    "role": "chatbot",
                    "speakerName": "Володимир Винниченко",
                    "speakerImage": "vynnychenko.jpg",
                    "content": "Це обурливо! Вони кажуть чекати Установчих зборів. Але народ не хоче чекати! Михайле Сергійовичу, ми повинні діяти рішуче. Що зробимо?",
                    "interaction": {
                        "choice": {
                            "options": [
                                {
                                    "title": "Оголосити I Універсал (самопроголосити автономію)",
                                    "nextNodeId": "node_5_correct"
                                },
                                {
                                    "title": "Покірно чекати дозволу Петрограда",
                                    "nextNodeId": "node_5_wrong"
                                }
                            ]
                        }
                    }
                },
                "node_5_correct": {
                    "role": "chatbot",
                    "speakerName": "Михайло Грушевський",
                    "speakerImage": "hrushevsky.jpg",
                    "content": "Вірно! 'Хай буде Україна вільною. Не одділяючись від всієї Росії, не розриваючи з державою Російською, хай народ український сам порядкує своїм життям'. Це наш I Універсал!",
                    "interaction": {
                        "linear": {
                            "nextNodeId": "node_6"
                        }
                    }
                },
                "node_5_wrong": {
                    "role": "chatbot",
                    "speakerName": "Володимир Винниченко",
                    "speakerImage": "vynnychenko.jpg",
                    "content": "Ні, друже, народ нас розірве, якщо ми будемо мовчати. На з'їзді військових вимагають дій! Тому ми не чекали, а видали I Універсал.",
                    "interaction": {
                        "linear": {
                            "nextNodeId": "node_6"
                        }
                    }
                },
                "node_6": {
                    "role": "narrator",
                    "content": "(Липень 1917. Універсал налякав Петроград. До Києва прибули міністри Тимчасового уряду на чолі з Керенським для переговорів).",
                    "interaction": {
                        "linear": {
                            "nextNodeId": "node_7"
                        }
                    }
                },
                "node_7": {
                    "role": "chatbot",
                    "speakerName": "Михайло Грушевський",
                    "speakerImage": "hrushevsky.jpg",
                    "content": "Вони пропонують компроміс: вони визнають нас (Генеральний Секретаріат) як крайову владу, але ми маємо відкласти проголошення повної автономії до Всеросійських зборів. Підписуємо?",
                    "interaction": {
                        "choice": {
                            "options": [
                                {
                                    "title": "Так, підписати II Універсал (Компроміс)",
                                    "nextNodeId": "node_8_correct"
                                },
                                {
                                    "title": "Ні, оголосити війну Тимчасовому уряду",
                                    "nextNodeId": "node_8_wrong"
                                }
                            ]
                        }
                    }
                },
                "node_8_correct": {
                    "role": "chatbot",
                    "speakerName": "Михайло Грушевський",
                    "speakerImage": "hrushevsky.jpg",
                    "content": "Мудре рішення, хоч і важке. Ми отримали легітимність, хоч і довелося поступитися частиною вимог. II Універсал підписано.",
                    "interaction": {
                        "linear": {
                            "nextNodeId": "node_9"
                        }
                    }
                },
                "node_8_wrong": {
                    "role": "chatbot",
                    "speakerName": "Михайло Грушевський",
                    "speakerImage": "hrushevsky.jpg",
                    "content": "Це було б занадто ризиковано. У нас немає достатньо сил для війни. Історично ми пішли на компроміс і видали II Універсал.",
                    "interaction": {
                        "linear": {
                            "nextNodeId": "node_9"
                        }
                    }
                },
                "node_9": {
                    "role": "narrator",
                    "content": "На жаль, цей компроміс викликав обурення самостійників (виступ полуботківців), але це вже інша історія...",
                    "interaction": {
                        "linear": {
                            "nextNodeId": null
                        }
                    }
                }
            }
        }
    ]
};

function startLearning() {
    closeModal();
    showPage('learning-page');
    
    // Clear previous content
    const container = document.getElementById('learning-content');
    if (container) {
        container.innerHTML = '';
        loadLearningNode('node_1');
    }
}

function loadLearningNode(nodeId) {
    const nodes = story.blocks[0].nodes;
    const node = nodes[nodeId];
    
    if (!node) {
        console.error("Node not found:", nodeId);
        return;
    }
    
    const container = document.getElementById('learning-content');
    
    // Create dialog wrapper
    const wrap = document.createElement('div');
    wrap.className = 'dialog-wrapper';

    // Add avatar for chatbot
    if (node.role === 'chatbot' && node.speakerImage) {
        const img = document.createElement('img');
        img.src = node.speakerImage;
        img.className = 'avatar';
        img.onerror = function() {
            this.style.display = 'none';
        };
        wrap.appendChild(img);
    }

    // Create dialog block
    const block = document.createElement('div');
    block.className = node.role === 'narrator' ? 'dialog-block narrator' : 'dialog-block';
    
    if (node.speakerName) {
        block.innerHTML = `<b>${node.speakerName}</b>${node.content}`;
    } else {
        block.innerHTML = node.content;
    }
    
    wrap.appendChild(block);
    container.appendChild(wrap);

    // Scroll to bottom
    setTimeout(() => {
        wrap.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);

    // Add choice buttons
    if (node.interaction && node.interaction.choice) {
        const choices = document.createElement('div');
        choices.className = 'choice-btns';
        
        node.interaction.choice.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt.title;
            btn.onclick = () => {
                choices.remove();
                loadLearningNode(opt.nextNodeId);
            };
            choices.appendChild(btn);
        });
        
        container.appendChild(choices);
    }

    // Add linear next button
    if (node.interaction && node.interaction.linear && node.interaction.linear.nextNodeId) {
        const btn = document.createElement('button');
        btn.className = 'btn-yellow next-btn';
        btn.textContent = 'Далі →';
        btn.onclick = () => {
            btn.remove();
            loadLearningNode(node.interaction.linear.nextNodeId);
        };
        container.appendChild(btn);
    }

    // End of story
    if (node.interaction && node.interaction.linear && node.interaction.linear.nextNodeId === null) {
        const endBtn = document.createElement('button');
        endBtn.className = 'btn-yellow next-btn';
        endBtn.textContent = 'Завершити';
        endBtn.onclick = () => openTopics();
        container.appendChild(endBtn);
    }
}

function openSimulation() {
    closeModal();
    showPage('simulation-page');
}

/* ================= CHECK AUTH ON LOAD ================= */

if (window.location.pathname.includes('chat.html')) {
    window.addEventListener('DOMContentLoaded', function() {
        const logged = localStorage.getItem('chronos-logged');
        
        if (logged !== '1') {
            alert('Спочатку увійдіть у систему');
            window.location.href = 'index.html';
        } else {
            updateUserBadge();
        }
    });
}