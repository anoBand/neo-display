// hub.js - Main Switcher Logic
const container = document.getElementById('exhibition-container');
const navLinks = document.querySelectorAll('.nav-links a');

let currentSiteId = null;
let activeAssets = []; // 로드된 link, script 태그를 추적

/**
 * 전시물을 로드하는 메인 함수
 */
async function loadExhibition(siteId) {
    if (currentSiteId === siteId) return;

    console.log(`Loading exhibition: ${siteId}`);
    
    // 1. UI 상태 업데이트
    container.classList.add('loading');
    updateNav(siteId);

    try {
        // 2. HTML 컨텐츠 가져오기
        const response = await fetch(`exhibitions/${siteId}/content.html`);
        if (!response.ok) throw new Error(`Failed to load ${siteId} content`);
        const html = await response.text();

        // 3. 이전 사이트 자산 정리
        cleanup();

        // 4. 새 컨텐츠 삽입
        container.innerHTML = html;
        currentSiteId = siteId;

        // 5. 사이트 전용 CSS 주입
        await injectCSS(siteId);

        // 6. 사이트 전용 JS 주입 및 초기화
        await injectJS(siteId);

    } catch (err) {
        console.error('Error loading exhibition:', err);
        container.innerHTML = `<div class="error">전시물을 로드하는 중 오류가 발생했습니다: ${err.message}</div>`;
    } finally {
        container.classList.remove('loading');
    }
}

/**
 * CSS 파일을 동적으로 주입
 */
function injectCSS(siteId) {
    return new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `exhibitions/${siteId}/style.css`;
        link.className = 'site-asset';
        link.onload = resolve;
        document.head.appendChild(link);
        activeAssets.push(link);
    });
}

/**
 * JS 파일을 동적으로 주입하고 초기화 함수 호출
 */
function injectJS(siteId) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = `exhibitions/${siteId}/script.js`;
        script.className = 'site-asset';
        script.onload = () => {
            // 사이트별 초기화 함수 호출 (window.initSite1, window.initSite2 등)
            const initFnName = `initSite${siteId.replace('site', '')}`;
            if (typeof window[initFnName] === 'function') {
                window[initFnName]();
            }
            resolve();
        };
        document.head.appendChild(script);
        activeAssets.push(script);
    });
}

/**
 * 이전 사이트의 자산(CSS, JS) 및 상태 정리
 */
function cleanup() {
    // 1. DOM 컨텐츠 비우기
    container.innerHTML = '';

    // 2. 주입된 link, script 태그 제거
    activeAssets.forEach(asset => {
        if (asset.parentNode) {
            asset.parentNode.removeChild(asset);
        }
    });
    activeAssets = [];

    // 3. (옵션) 추가적인 상태 정리 로직 (이벤트 리스너 등은 DOM 제거 시 대부분 정리됨)
    console.log('Cleanup complete');
}

/**
 * 네비게이션 활성화 표시 업데이트
 */
function updateNav(siteId) {
    navLinks.forEach(link => {
        if (link.dataset.site === siteId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Hash 변경 감지 및 초기 로드 처리
 */
function handleRouting() {
    const hash = window.location.hash.substring(1); // #site1 -> site1
    if (['site1', 'site2', 'site3'].includes(hash)) {
        loadExhibition(hash);
    } else {
        // 기본 화면 (Welcome)
        cleanup();
        currentSiteId = null;
        container.innerHTML = `
            <div class="welcome-screen">
                <h1>Welcome to NEOSTREAM Exhibition</h1>
                <p>상단 메뉴를 선택하여 전시물을 관람하세요.</p>
            </div>
        `;
        updateNav(null);
    }
}

window.addEventListener('hashchange', handleRouting);
window.addEventListener('load', handleRouting);
