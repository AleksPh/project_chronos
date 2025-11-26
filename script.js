        // Current topic data
        let currentTopic = null;
        let chatHistory = [];

        // Topics database
        const topics = {
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

        // Show specific page
        function showPage(pageId) {
            console.log('Showing page:', pageId);
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
        }

        // Check if logged in
        function checkAuth() {
            const user = localStorage.getItem('chronos_user');
            if (user) {
                showPage('topicsPage');
                displayUser(JSON.parse(user));
            } else {
                createDemoUser();
            }
        }

        // Create demo user
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

        // Display user info
        function displayUser(user) {
            const fullName = user.firstName + ' ' + user.lastName;
            const initials = user.firstName[0] + user.lastName[0];
            
            document.getElementById('userName').textContent = fullName;
            document.getElementById('userAvatar').textContent = initials.toUpperCase();
            document.getElementById('userPoints').textContent = user.points.toLocaleString();
            document.getElementById('userAchievements').textContent = user.achievements;
            
            // Update chat page user info
            document.getElementById('chatUserName').textContent = fullName;
            document.getElementById('chatUserAvatar').textContent = initials.toUpperCase();
        }

        // Open chat
        function openChat(topicId) {
            console.log('Opening chat:', topicId);
            currentTopic = topics[topicId];
            chatHistory = [];
            
            if (!currentTopic) {
                alert('Ця тема ще в розробці!');
                return;
            }
            
            // Update figure info
            document.getElementById('figureName').textContent = currentTopic.figure.name;
            document.getElementById('figureRole').textContent = currentTopic.figure.role;
            document.getElementById('figureAvatar').textContent = currentTopic.figure.avatar;
            
            // Clear messages
            document.getElementById('chatMessages').innerHTML = '';
            
            // Add intro message
            addMessage('narrator', 'Розпочинається розмова...', '📚');
            
            setTimeout(() => {
                addMessage('ai', currentTopic.intro, currentTopic.figure.name, currentTopic.figure.avatar);
                showSuggestedPrompts();
            }, 800);
            
            showPage('chatPage');
        }

        // Add message to chat
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

        // Show suggested prompts
        function showSuggestedPrompts() {
            if (!currentTopic.prompts) return;
            
            const messagesDiv = document.getElementById('chatMessages');
            const choicesDiv = document.createElement('div');
            choicesDiv.className = 'choices';
            
            currentTopic.prompts.forEach(prompt => {
                const btn = document.createElement('button');
                btn.className = 'choice-btn';
                btn.textContent = prompt;
                btn.onclick = () => {
                    document.getElementById('userInput').value = prompt;
                    sendMessage();
                };
                choicesDiv.appendChild(btn);
            });
            
            messagesDiv.appendChild(choicesDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        // Send message
        function sendMessage() {
            const input = document.getElementById('userInput');
            const message = input.value.trim();
            
            if (!message) return;
            
            // Add user message
            const user = JSON.parse(localStorage.getItem('chronos_user'));
            const userName = user.firstName + ' ' + user.lastName;
            addMessage('user', message, userName, '👤');
            
            input.value = '';
            
            // Show loading
            const messagesDiv = document.getElementById('chatMessages');
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message ai';
            loadingDiv.innerHTML = '<div class="message-content"><span class="loading">AI генерує відповідь</span></div>';
            messagesDiv.appendChild(loadingDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
            
            // Simulate AI response
            setTimeout(() => {
                loadingDiv.remove();
                const response = generateAIResponse(message);
                addMessage('ai', response, currentTopic.figure.name, currentTopic.figure.avatar);
            }, 1500 + Math.random() * 1000);
        }

        // Generate AI response
        function generateAIResponse(userMessage) {
            const msg = userMessage.toLowerCase();
            
            // Simple keyword-based responses
            if (msg.includes('причин') || msg.includes('чому')) {
                return `Це дуже важливе питання. ${currentTopic.title} мала багато причин. Основними були політичні суперечності, економічні інтереси та національні прагнення. Хочете дізнатися більше деталей?`;
            } else if (msg.includes('впли') || msg.includes('наслід')) {
                return `Вплив цих подій на Україну був величезним. Вони змінили хід нашої історії, вплинули на формування національної свідомості та визначили майбутній розвиток держави.`;
            } else if (msg.includes('розкаж') || msg.includes('що')) {
                return `З радістю розповім! ${currentTopic.title} - це надзвичайно цікавий період. У той час відбувалися події, які назавжди змінили долю України. Кожна деталь цього періоду має велике значення для розуміння нашої історії.`;
            } else if (msg.includes('дяку') || msg.includes('спасиб')) {
                return `Завжди радий допомогти! Якщо у вас є ще питання про ${currentTopic.title}, не соромтеся питати. Історія - це наше коріння, і важливо її знати.`;
            } else {
                return `Це цікаве питання про ${currentTopic.title}. Відповідаючи на нього, можу сказати, що цей період був надзвичайно важливим для України. Кожна подія мала своє значення і вплинула на подальший розвиток нашої держави. Чи хотіли б ви дізнатися більше конкретних деталей?`;
            }
        }

        // Enter key to send
        document.addEventListener('DOMContentLoaded', function() {
            const input = document.getElementById('userInput');
            if (input) {
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                    }
                });
            }
        });

        // Registration
        document.getElementById('regForm').addEventListener('submit', function(e) {
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
                
                showMessage('regMessage', 'success', '✅ Реєстрація успішна! Вітаємо, ' + firstName + ' ' + lastName + '!');
                
                setTimeout(() => {
                    showPage('topicsPage');
                    displayUser(newUser);
                }, 1500);
                
            } catch (error) {
                showMessage('regMessage', 'error', '❌ Помилка: ' + error.message);
            }
        });

        // Login
        document.getElementById('loginForm').addEventListener('submit', function(e) {
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

        // Logout
        function logout() {
            localStorage.removeItem('chronos_user');
            chatHistory = [];
            currentTopic = null;
            showPage('loginPage');
        }

        // Show message
        function showMessage(elementId, type, text) {
            const el = document.getElementById(elementId);
            el.className = type;
            el.textContent = text;
            el.style.display = 'block';
        }

        // Initialize
        checkAuth();