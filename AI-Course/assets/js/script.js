document.addEventListener('DOMContentLoaded', () => {
    const progressFill = document.getElementById('progress-fill');
    let progress = 0;

    const updateProgress = () => {
        progress += 10;
        if (progress > 100) progress = 100;
        progressFill.style.width = `${progress}%`;
        progressFill.textContent = `${progress}%`;
    };

    setInterval(updateProgress, 1000);
});

// Profile Management
function loadProfile() {
    const profile = JSON.parse(localStorage.getItem('profile')) || {};
    const goalElement = document.getElementById('earnings-goal');
    const progressElement = document.getElementById('progress-fill');
    if (profile.income) {
        goalElement.textContent = `Your Goal: Earn $${profile.income}/month`;
        const progress = profile.progress || 0;
        progressElement.style.width = `${progress}%`;
        progressElement.textContent = `${progress}%`;
    }
}

document.getElementById('profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const profile = {
        age: formData.get('age'),
        aspirations: formData.get('aspirations'),
        reason: formData.get('reason'),
        income: formData.get('income'),
        progress: 0
    };
    localStorage.setItem('profile', JSON.stringify(profile));
    document.getElementById('profile-form').classList.add('hidden');
    const display = document.getElementById('profile-display');
    display.classList.remove('hidden');
    document.getElementById('profile-age').textContent = profile.age;
    document.getElementById('profile-aspirations').textContent = profile.aspirations;
    document.getElementById('profile-reason').textContent = profile.reason;
    document.getElementById('profile-income').textContent = profile.income;
    loadProfile();
});

// Quiz Handling
document.querySelectorAll('.quiz-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const quizId = btn.dataset.module;
        const quiz = document.getElementById(`quiz-${quizId}`);
        quiz.classList.toggle('hidden');
    });
});

document.querySelectorAll('.quiz-form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let score = 0;
        const answers = new FormData(form);
        for (let [key, value] of answers) {
            if (value === 'correct') score++;
        }
        const result = form.nextElementSibling;
        result.textContent = `You scored ${score}/2! Great job!`;
        result.classList.remove('hidden');
        const profile = JSON.parse(localStorage.getItem('profile')) || {};
        if (profile.income) {
            profile.progress = Math.min(profile.progress + 15, 75); // 15% per module
            localStorage.setItem('profile', JSON.stringify(profile));
            loadProfile();
        }
        const paymentPrompt = form.closest('.module').querySelector('.payment-prompt');
        if (paymentPrompt) paymentPrompt.classList.remove('hidden');
    });
});

// FOMO Timer
function startTimer() {
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;
    let timeLeft = 24 * 60 * 60;
    const interval = setInterval(() => {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeLeft--;
        if (timeLeft < 0) clearInterval(interval);
    }, 1000);
}

// Checkout with Guide Purchase
document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const confetti = document.querySelector('.confetti');
    confetti.classList.remove('hidden');
    setTimeout(() => confetti.classList.add('hidden'), 3000);
    const guide = document.querySelector('input[name="guide"]:checked')?.value;
    if (guide) {
        const profile = JSON.parse(localStorage.getItem('profile')) || {};
        profile.progress = 100; // 100% with guide
        localStorage.setItem('profile', JSON.stringify(profile));
        loadProfile();
    }
    alert('Redirecting to payment... (Mock integration)');
    // Replace with Stripe/Gumroad links
});

// Social Sharing
function shareBadge(type) {
    const url = type === 'beginner' 
        ? 'https://yourusername.github.io/assets/img/beginner-badge.png'
        : 'https://yourusername.github.io/assets/img/intermediate-badge.png';
    const text = type === 'beginner'
        ? 'I’m an AI Beginner Star! Join me at Easy AI Course! #EasyAIHustle'
        : 'I’m an AI Freelance Pro! Learn to earn with Easy AI Course! #EasyAIHustle';
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
}

// Initialize
window.onload = () => {
    loadProfile();
    startTimer();
};