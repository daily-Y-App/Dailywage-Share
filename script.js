// ===== State Management =====
let currentUser = null;
let userData = {
    points: 0,
    invites: 0,
    streak: 0,
    inviteCode: generateInviteCode(),
    transactions: [],
    leaderboard: []
};

// ===== Utility Functions =====
function generateInviteCode() {
    return 'CODE' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 0.5rem;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

// ===== Authentication =====
function login() {
    // Simulate login
    currentUser = {
        name: 'John Doe',
        email: 'john@example.com'
    };
    
    // Initialize user data
    userData = {
        points: 1250,
        invites: 7,
        streak: 5,
        inviteCode: generateInviteCode(),
        transactions: [
            { type: 'daily_login', points: 2, description: 'Daily login reward', date: new Date(Date.now() - 86400000) },
            { type: 'invite_reward', points: 5, description: 'Invited user John', date: new Date(Date.now() - 172800000) },
            { type: 'watch_ads', points: 4, description: 'Watched advertisement', date: new Date(Date.now() - 259200000) },
            { type: 'task_completion', points: 10, description: 'Completed task: Survey', date: new Date(Date.now() - 345600000) },
            { type: 'invite_reward', points: 5, description: 'Invited user Sarah', date: new Date(Date.now() - 432000000) }
        ],
        leaderboard: [
            { rank: 1, name: 'User #123', invites: 45, bonus: 700 },
            { rank: 2, name: 'User #456', invites: 28, bonus: 200 },
            { rank: 3, name: 'User #789', invites: 15, bonus: 50 },
            { rank: 4, name: 'User #101', invites: 12, bonus: 50 },
            { rank: 5, name: 'User #202', invites: 8, bonus: 0 }
        ]
    };
    
    updateDashboard();
    showPage('dashboardPage');
    document.getElementById('authBtn').textContent = 'Logout';
    showNotification('Logged in successfully!');
}

function logout() {
    currentUser = null;
    showPage('homePage');
    document.getElementById('authBtn').textContent = 'Sign In';
    showNotification('Logged out successfully!');
}

// ===== Dashboard Functions =====
function updateDashboard() {
    if (!currentUser) return;
    
    document.getElementById('welcomeText').textContent = `Welcome back, ${currentUser.name}!`;
    document.getElementById('pointsDisplay').textContent = userData.points.toLocaleString();
    document.getElementById('invitesDisplay').textContent = userData.invites;
    document.getElementById('streakDisplay').textContent = userData.streak;
    document.getElementById('inviteCodeInput').value = userData.inviteCode;
    document.getElementById('shareCodeInput').value = userData.inviteCode;
    
    updateTransactionHistory();
    updateLeaderboard();
    updateInviteProgress();
}

function updateTransactionHistory() {
    const list = document.getElementById('transactionList');
    
    if (userData.transactions.length === 0) {
        list.innerHTML = '<p class="empty-state">No transactions yet</p>';
        return;
    }
    
    list.innerHTML = userData.transactions.map(tx => `
        <div class="transaction-item">
            <div class="transaction-info">
                <h4>${formatTransactionType(tx.type)}</h4>
                <p>${tx.description}</p>
            </div>
            <span class="transaction-points ${tx.points > 0 ? 'points-positive' : 'points-negative'}">
                ${tx.points > 0 ? '+' : ''}${tx.points}
            </span>
        </div>
    `).join('');
}

function formatTransactionType(type) {
    const types = {
        'daily_login': '📅 Daily Login',
        'watch_ads': '📺 Watch Ads',
        'task_completion': '✓ Task Completed',
        'invite_reward': '👥 Invite Reward',
        'invite_bonus': '🎁 Milestone Bonus',
        'withdraw': '💸 Withdrawal'
    };
    return types[type] || type;
}

function updateLeaderboard() {
    const list = document.getElementById('leaderboardList');
    
    if (userData.leaderboard.length === 0) {
        list.innerHTML = '<p class="empty-state">No leaderboard data yet</p>';
        return;
    }
    
    list.innerHTML = userData.leaderboard.map(entry => `
        <div class="leaderboard-item">
            <div class="leaderboard-rank">#${entry.rank}</div>
            <div class="leaderboard-info">
                <div class="leaderboard-name">${entry.name}</div>
                <div class="leaderboard-invites">${entry.invites} invites</div>
            </div>
            ${entry.bonus > 0 ? `<div class="leaderboard-bonus">+${entry.bonus} pts</div>` : ''}
        </div>
    `).join('');
}

function updateInviteProgress() {
    const nextMilestone = userData.invites >= 50 ? 50 : (userData.invites >= 20 ? 20 : 10);
    const progressPercent = Math.min((userData.invites / nextMilestone) * 100, 100);
    
    document.getElementById('progressText').textContent = `${userData.invites}/${nextMilestone} friends invited`;
    document.getElementById('progressPercent').textContent = Math.round(progressPercent) + '%';
    document.getElementById('progressFill').style.width = progressPercent + '%';
    
    // Show "Almost there!" notification
    const almostThereNotif = document.getElementById('almostThereNotif');
    if (userData.invites >= nextMilestone - 3 && userData.invites < nextMilestone) {
        almostThereNotif.style.display = 'flex';
        const remaining = nextMilestone - userData.invites;
        document.getElementById('almostThereText').textContent = 
            `Just ${remaining} more ${remaining === 1 ? 'invite' : 'invites'} to reach the next milestone!`;
    } else {
        almostThereNotif.style.display = 'none';
    }
}

// ===== Action Functions =====
function watchAds() {
    if (!currentUser) {
        showNotification('Please sign in first', 'error');
        return;
    }
    
    const points = Math.floor(Math.random() * 3) + 3; // 3-5 points
    userData.points += points;
    userData.transactions.unshift({
        type: 'watch_ads',
        points: points,
        description: 'Watched advertisement',
        date: new Date()
    });
    
    updateDashboard();
    showNotification(`+${points} points earned from watching ads!`);
}

function completeTask() {
    if (!currentUser) {
        showNotification('Please sign in first', 'error');
        return;
    }
    
    const points = Math.floor(Math.random() * 6) + 5; // 5-10 points
    userData.points += points;
    userData.transactions.unshift({
        type: 'task_completion',
        points: points,
        description: 'Completed task: Survey',
        date: new Date()
    });
    
    updateDashboard();
    showNotification(`+${points} points earned from completing task!`);
}

function copyInviteCode() {
    const code = document.getElementById('inviteCodeInput').value;
    navigator.clipboard.writeText(code).then(() => {
        showNotification('Invite code copied to clipboard!');
    });
}

function copyShareCode() {
    const code = document.getElementById('shareCodeInput').value;
    navigator.clipboard.writeText(code).then(() => {
        showNotification('Invite code copied to clipboard!');
    });
}

function applyInviteCode() {
    if (!currentUser) {
        showNotification('Please sign in first', 'error');
        return;
    }
    
    const code = document.getElementById('friendCodeInput').value.trim().toUpperCase();
    
    if (!code) {
        showNotification('Please enter an invite code', 'error');
        return;
    }
    
    if (code === userData.inviteCode) {
        showNotification('You cannot use your own invite code', 'error');
        return;
    }
    
    // Simulate invite processing
    userData.points += 5;
    userData.transactions.unshift({
        type: 'invite_reward',
        points: 5,
        description: `Used invite code: ${code}`,
        date: new Date()
    });
    
    document.getElementById('friendCodeInput').value = '';
    updateDashboard();
    showNotification('Invite code applied! +5 points earned!');
    
    // Navigate to dashboard
    setTimeout(() => {
        goToDashboard();
    }, 1000);
}

function goToDashboard() {
    if (!currentUser) {
        showPage('homePage');
    } else {
        showPage('dashboardPage');
        switchTab('overview');
    }
}

// ===== Navigation =====
document.addEventListener('DOMContentLoaded', function() {
    // Auth button
    const authBtn = document.getElementById('authBtn');
    authBtn.addEventListener('click', function() {
        if (currentUser) {
            logout();
        } else {
            login();
        }
    });
    
    // Get Started button
    document.getElementById('getStartedBtn').addEventListener('click', function() {
        if (currentUser) {
            showPage('dashboardPage');
        } else {
            login();
        }
    });
    
    // Sign Up button
    document.getElementById('signupBtn').addEventListener('click', function() {
        login();
    });
    
    // Navigation to invite page
    document.addEventListener('click', function(e) {
        if (e.target.textContent.includes('Invite')) {
            if (currentUser) {
                showPage('invitePage');
            } else {
                showNotification('Please sign in first', 'error');
            }
        }
    });
    
    // Initialize first tab
    switchTab('overview');
});

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', function(e) {
    // Escape key to go back
    if (e.key === 'Escape' && currentUser) {
        showPage('dashboardPage');
    }
});

// ===== Animation Styles =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ===== Export for GitHub =====
// This file is ready to be uploaded to GitHub as a standalone HTML/CSS/JS project
// No build process required - just open index.html in a browser or host on GitHub Pages
