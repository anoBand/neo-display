(function() {
    window.initSite2 = function() {
        // ----- 스크롤 페이드인/아웃 애니메이션 -----
        const fadeInElements = document.querySelectorAll('.site2 .fade-in');
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
        const songTitles = document.querySelectorAll('.site2 .song-title');
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
    };
})();