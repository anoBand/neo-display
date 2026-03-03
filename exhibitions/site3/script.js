(function() {
    window.initSite3 = function() {
        const fadeInElements = document.querySelectorAll('.site3 .fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });
        fadeInElements.forEach(el => observer.observe(el));

        // 3D 카드 로직
        const cards = document.querySelectorAll('.site3 .card-container');
        cards.forEach(card => {
            const cardInner = card.querySelector('.card-inner');
            let isFlipped = false;
            card.addEventListener('mouseenter', () => {
                cardInner.style.transition = 'transform 0.1s ease-out';
            });
            card.addEventListener('mousemove', (e) => {
                if (isFlipped) return;
                const { width, height, left, top } = card.getBoundingClientRect();
                const x = e.clientX - left;
                const y = e.clientY - top;
                const centerX = width / 2;
                const centerY = height / 2;
                const rotateX = ((y - centerY) / centerY) * 15;
                const rotateY = ((x - centerX) / centerX) * -15;
                cardInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                cardInner.style.transition = 'transform 0.5s ease-in-out';
                if (!isFlipped) {
                    cardInner.style.transform = 'rotateX(0deg) rotateY(0deg)';
                }
            });
            card.addEventListener('click', () => {
                cardInner.style.transition = 'transform 0.5s ease-in-out';
                isFlipped = !isFlipped;
                if (isFlipped) {
                    cardInner.style.transform = 'rotateY(180deg)';
                } else {
                    cardInner.style.transform = 'rotateX(0deg) rotateY(0deg)';
                }
            });
        });

        const tabs = document.querySelectorAll(".site3 nav a");
        const sections = document.querySelectorAll(".site3 .tab-content > section");
        const tabContent = document.querySelector('.site3 .tab-content');
        const heightBuffer = 50;

        function updateTabContentHeight() {
            const activeSection = document.querySelector(".site3 .tab-content > section.active");
            if (activeSection) {
                tabContent.style.height = (activeSection.scrollHeight + heightBuffer) + "px";
            }
        }

        updateTabContentHeight();

        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                tabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                sections.forEach(sec => sec.classList.remove("active"));
                const target = document.getElementById(tab.dataset.target);
                if (target) {
                    target.classList.add("active");
                    setTimeout(updateTabContentHeight, 50);
                }
            });
        });

        // 채팅 기능 (Static JSON 및 스타일 복구)
        const chatWindow = document.querySelector('.site3 .chat-window');
        const chatForm = document.getElementById('chat-form');
        if (chatForm) chatForm.style.display = 'none';

        function displayMessage(messageText, type, color = null) {
            const bubble = document.createElement('div');
            bubble.classList.add('chat-message', type);
            const messageParagraph = document.createElement('p');
            messageParagraph.textContent = messageText;
            bubble.appendChild(messageParagraph);

            if (type === 'sent' && color) {
                bubble.classList.add('custom-color');
                bubble.style.backgroundColor = color;
            }

            chatWindow.appendChild(bubble);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }

        async function loadMessages() {
            try {
                const response = await fetch('exhibitions/site3/src/messages.json');
                if (!response.ok) return;
                const messages = await response.json();

                chatWindow.innerHTML = '';
                displayMessage("응원 메시지를 남겨주세요!", 'received');
                messages.forEach(msg => {
                    displayMessage(msg.text || msg.content, 'sent', msg.color);
                });
                updateTabContentHeight();
            } catch (err) {
                console.error("메시지 로딩 실패:", err);
            }
        }

        loadMessages();

        // RGB -> HSL 어둡게 변환 함수 (원본 가독성 스타일)
        function getDarkenedColor(r, g, b) {
            r /= 255; g /= 255; b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            if (max === min) { h = s = 0; } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return `hsl(${Math.round(h * 360)}, ${Math.round(s * 90)}%, 20%)`;
        }

        if (typeof ColorThief !== 'undefined') {
            const colorThief = new ColorThief();
            const cardsForColor = document.querySelectorAll('.site3 .card-container');
            cardsForColor.forEach((card) => {
                const front = card.querySelector('.card-front');
                const back = card.querySelector('.card-back');
                const style = window.getComputedStyle(front);
                let bgImage = style.backgroundImage;
                bgImage = bgImage.slice(4, -1).replace(/"/g, "");
                if (!bgImage || bgImage === 'none') return;

                const img = new Image();
                img.src = bgImage;
                img.crossOrigin = "Anonymous";
                img.onload = () => {
                    try {
                        const rgb = colorThief.getColor(img);
                        const darkColor = getDarkenedColor(rgb[0], rgb[1], rgb[2]);
                        back.style.backgroundColor = darkColor;
                    } catch (e) {}
                };
            });
        }
    };
})();