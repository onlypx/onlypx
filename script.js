// ============================================
// Clock
// ============================================
function updateClock() {
    const el = document.getElementById('clock');
    if (!el) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
}
updateClock();
setInterval(updateClock, 1000);

// ============================================
// Discord Profile (Lanyard API)
// ============================================
const DISCORD_ID = '786773738652958740';
const LANYARD_API = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;

async function fetchDiscordProfile() {
    const res = await fetch(LANYARD_API);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success || !json.data) throw new Error('Invalid Lanyard response');
    return json.data;
}

function getAvatarUrl(avatarHash) {
    return `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${avatarHash}.png?size=256`;
}

function applyProfile(data) {
    const user = data.discord_user;
    const avatarImg = document.getElementById('avatarImg');
    const nameEl = document.getElementById('discordName');
    const statusEl = document.getElementById('discordStatus');

    const displayName = `@${user.global_name || user.username}`;
    if (nameEl) nameEl.textContent = displayName;

    if (user.avatar && avatarImg) {
        avatarImg.src = getAvatarUrl(user.avatar);
        avatarImg.onerror = () => {
            avatarImg.style.display = 'none';
        };
    }

    if (statusEl) {
        const status = data.discord_status;
        const label = status === 'online' ? 'Online'
            : status === 'idle' ? 'Idle'
            : status === 'dnd' ? 'Do Not Disturb'
            : 'Offline';
        statusEl.textContent = label;
        statusEl.classList.add('loaded');
        statusEl.className = 'discord-status loaded ' + status;
    }
}

async function updateProfile() {
    try {
        const data = await fetchDiscordProfile();
        applyProfile(data);
    } catch (err) {
        console.warn('Failed to update Discord profile:', err);
    }
}

updateProfile();
setInterval(updateProfile, 5 * 60 * 1000);

// ============================================
// Nav active state
// ============================================
const navPills = document.querySelectorAll('.nav-pill[href]');
navPills.forEach(pill => {
    pill.addEventListener('click', () => {
        navPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
    });
});

// ============================================
// Copy email
// ============================================
const emailPill = document.getElementById('emailPill');
if (emailPill) {
    emailPill.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await navigator.clipboard.writeText('pedrovoltarelli587@gmail.com');
            emailPill.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg> ✓ Copiado`;
            setTimeout(() => {
                const original = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg> Email`;
                emailPill.innerHTML = original;
            }, 2000);
        } catch (err) {
            console.warn('Failed to copy email:', err);
        }
    });
}

// ============================================
// Page Transition
// ============================================
(function() {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    document.body.prepend(overlay);

    requestAnimationFrame(() => {
        overlay.classList.remove('active');
    });

    document.querySelectorAll('.nav-pill[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || !href.endsWith('.html')) return;
        link.addEventListener('click', e => {
            e.preventDefault();
            overlay.classList.add('active');
            setTimeout(() => {
                window.location.href = href;
            }, 350);
        });
    });
})();

// ============================================
// Scroll Reveal - via Intersection Observer
// ============================================
(function() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
    });

    revealElements.forEach(el => {
        observer.observe(el);
    });
})();

// ============================================
// Tilt Effect on Cards (desktop only)
// ============================================
(function() {
    if (matchMedia('(hover: none)').matches) return;

    const cards = document.querySelectorAll('.card, .project-item');
    cards.forEach(card => {
        let ticking = false;

        card.addEventListener('mousemove', (e) => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -4;
                const rotateY = ((x - centerX) / centerX) * 4;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
                ticking = false;
            });
        });

        card.addEventListener('mouseleave', () => {
            ticking = false;
            card.style.transform = '';
        });
    });
})();
