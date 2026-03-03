(function() {
    window.initSite1 = function() {
        // ----- 스크롤 페이드인/아웃 애니메이션 -----
        const fadeInElements = document.querySelectorAll('.site1 .fade-in');
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

        // ----- 아코디언 기능 -----
        const songTitles = document.querySelectorAll('.site1 .song-title');
        songTitles.forEach(title => {
            title.addEventListener('click', () => {
                title.classList.toggle('active');
                const performers = title.nextElementSibling;
                if (performers.style.maxHeight) {
                    performers.style.maxHeight = null;
                } else {
                    performers.style.maxHeight = performers.scrollHeight + "px";
                }
            });
        });

        // ----- 응원의 벽 기능 (Static JSON 전용) -----
        const bubbleContainer = document.getElementById('bubble-container');
        const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'];
        let existingBubbles = [];

        async function loadMessages() {
            try {
                const response = await fetch('exhibitions/site1/messages.json');
                if (!response.ok) return;
                const messages = await response.json();
                
                bubbleContainer.innerHTML = '';
                existingBubbles = [];
                messages.forEach(createBubbleElement);
            } catch (error) {
                console.error('메시지 로딩 실패:', error);
            }
        }

        function createBubbleElement(message) {
            const bubble = document.createElement('div');
            bubble.classList.add('message-bubble');
            const content = document.createElement('p');
            content.textContent = message.content;
            bubble.appendChild(content);
            bubble.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            placeBubble(bubble);
            bubbleContainer.appendChild(bubble);
        }

        function placeBubble(bubble) {
            const containerRect = bubbleContainer.getBoundingClientRect();
            const bubbleWidth = 140;
            const bubbleHeight = 70;
            if (containerRect.width === 0) return;

            let attempts = 0;
            let isOverlapping;
            do {
                isOverlapping = false;
                const randomTop = Math.random() * (containerRect.height - bubbleHeight);
                const randomLeft = Math.random() * (containerRect.width - bubbleWidth);
                const newBubbleRect = {
                    top: randomTop, left: randomLeft,
                    right: randomLeft + bubbleWidth, bottom: randomTop + bubbleHeight
                };
                for (const existing of existingBubbles) {
                    if (!(newBubbleRect.right < existing.left ||
                        newBubbleRect.left > existing.right ||
                        newBubbleRect.bottom < existing.top ||
                        newBubbleRect.top > existing.bottom)) {
                        isOverlapping = true;
                        break;
                    }
                }
                if (!isOverlapping) {
                    bubble.style.top = `${randomTop}px`;
                    bubble.style.left = `${randomLeft}px`;
                    existingBubbles.push(newBubbleRect);
                }
                attempts++;
            } while (isOverlapping && attempts < 100);
        }

        // 전시용이므로 입력 폼은 숨기거나 작동하지 않게 처리
        const form = document.getElementById('message-form');
        if (form) form.style.display = 'none';

        loadMessages();
    };
})();