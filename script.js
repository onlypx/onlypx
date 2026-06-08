// Clock
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

// Discord Profile (Lanyard API)
const DISCORD_ID = '786773738652958740';
const LANYARD_API = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;

let cachedData = null;

async function fetchDiscordProfile() {
    const res = await fetch(LANYARD_API);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success || !json.data) throw new Error('Invalid Lanyard response');
    const data = json.data;
    cachedData = data;
    return data;
}

function getAvatarUrl(avatarHash) {
    return `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${avatarHash}.png?size=256`;
}

function applyProfile(data) {
    const user = data.discord_user;
    const avatarImg = document.getElementById('avatarImg');
    const nameEl = document.getElementById('discordName');

    const displayName = `@${user.global_name || user.username}`;
    if (nameEl) nameEl.textContent = displayName;

    if (user.avatar && avatarImg) {
        avatarImg.src = getAvatarUrl(user.avatar);
    } else if (avatarImg) {
        avatarImg.src = 'fotos/ChatGPT_Image_13_de_mai._de_2026__22_15_35-removebg-preview.png';
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

// Nav active state
const navPills = document.querySelectorAll('.nav-pill[href]');
navPills.forEach(pill => {
    pill.addEventListener('click', () => {
        navPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
    });
});

// Copy email
const emailPill = document.getElementById('emailPill');
if (emailPill) {
    emailPill.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await navigator.clipboard.writeText('pedrovoltarelli587@gmail.com');
            const original = emailPill.textContent;
            emailPill.textContent = 'Copiado!';
            setTimeout(() => {
                emailPill.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg> Email`;
            }, 1500);
        } catch (err) {
            console.warn('Failed to copy email:', err);
        }
    });
}
