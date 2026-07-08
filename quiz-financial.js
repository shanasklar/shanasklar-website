const QUESTIONS = [
  {
    id: 1,
    text: "When you think about your finances right now, what comes up first?",
    answers: [
      { text: "Avoidance — I'd rather not look at it.", type: 1 },
      { text: "Anxiety or shame — I feel like I should be further along.", type: 1 },
      { text: "Frustration — I work hard but can't seem to get ahead.", type: 2 },
      { text: "Readiness — I know something needs to change and I'm ready.", type: 3 }
    ]
  },
  {
    id: 2,
    text: "What's your biggest obstacle with money?",
    answers: [
      { text: "I don't really understand how it works — no one ever taught me.", type: 1 },
      { text: "I know what I should do, but I can't seem to actually do it.", type: 2 },
      { text: "I feel judged or overwhelmed when money comes up.", type: 1 },
      { text: "I want to grow my wealth but don't know where to start.", type: 3 }
    ]
  },
  {
    id: 3,
    text: "How do you feel about your current career or income situation?",
    answers: [
      { text: "I'm okay with my career — I just need help managing what I earn.", type: 2 },
      { text: "I want to grow my income but feel stuck in my current path.", type: 2 },
      { text: "I'm seriously considering a career change as part of my fresh start.", type: 3 },
      { text: "I want to leave what I'm doing and build something entirely my own.", type: 3 }
    ]
  },
  {
    id: 4,
    text: "What does financial freedom mean to you?",
    answers: [
      { text: "Never feeling panic when I check my bank account.", type: 1 },
      { text: "Having enough to be generous — with others and myself.", type: 2 },
      { text: "The freedom to choose how I spend my time, not just my money.", type: 3 },
      { text: "Building real security for my future and my family.", type: 2 }
    ]
  },
  {
    id: 5,
    text: "What's held you back from getting financial support before?",
    answers: [
      { text: "I've felt judged or shamed — like I wasn't doing enough.", type: 1 },
      { text: "I didn't think I earned enough to need an advisor.", type: 1 },
      { text: "I didn't know who to trust or where to start.", type: 2 },
      { text: "I've tried things before but nothing felt right for where I actually am.", type: 2 }
    ]
  }
];

const RESULTS = {
  1: {
    type: "avoider",
    label: "The Avoider",
    headline: "You're not bad with money. Your nervous system just learned to protect you from it.",
    lead: "Avoidance isn't a character flaw — it's a survival response. When money has felt scary, overwhelming, or tied to shame, your brain does the only thing it knows: it looks away. That ends here.",
    where: "You're at the beginning — not because you're behind, but because no one ever made this feel safe enough to start. That's exactly what we fix first.",
    need: "A judgment-free foundation. Real financial education delivered at your pace, in a space where you never feel stupid or behind.",
    body: [
      "Before strategy, before budgets, before any of the 'what you should be doing' talk — you need to feel <strong>safe enough to look.</strong>",
      "Shana's approach starts with nervous system regulation and financial literacy together. You'll learn how money actually works, why you've related to it the way you have, and how to build a new relationship with it — one that doesn't make you want to close the tab.",
      "This isn't about catching up. It's about starting clean, from solid ground."
    ],
    cta: "Book Your Free Call With Shana"
  },
  2: {
    type: "striver",
    label: "The Striver",
    headline: "You know more than you think. The gap isn't knowledge — it's the space between knowing and doing.",
    lead: "You've read the articles. You've made the plans. And somehow you're still in the same place. That's not a willpower problem — it's a nervous system pattern. And patterns can change.",
    where: "You're in motion but spinning your wheels. You have the awareness — what's missing is the accountability, the coaching, and a plan that's actually built around your real life.",
    need: "1:1 coaching and accountability. Someone who helps you close the gap between what you know and what you actually do — without judgment when you fall off track.",
    body: [
      "Knowing what to do and consistently doing it are two entirely different skills. <strong>The second one isn't taught — it's coached.</strong>",
      "Shana works with you to identify the specific patterns keeping you stuck, build systems that fit your actual life, and stay in your corner when things get hard. This isn't a course you buy and forget. It's a relationship.",
      "You're closer than you think. Let's close the gap."
    ],
    cta: "Book Your Free Call With Shana"
  },
  3: {
    type: "liberator",
    label: "The Liberator",
    headline: "You're not just ready to manage your money better. You're ready to build a completely different life.",
    lead: "This goes beyond budgets. You can feel that the life you're living and the life you want are two different things — financially, professionally, maybe in every way. You're ready to close that gap.",
    where: "You're at an inflection point. The old path doesn't fit anymore and you can feel it. You don't just need financial advice — you need someone who understands that money, career, and identity are all connected.",
    need: "A strategic partner. Someone who can hold the big picture — your finances, your career direction, and the vision you have for your life — and help you build toward all of it at once.",
    body: [
      "Financial freedom and life freedom aren't separate goals. <strong>The work Shana does sits at the intersection of both.</strong>",
      "Whether you're considering a career change, building toward leaving a job that no longer fits, or simply ready to design a financial life that actually matches who you are — this is the conversation for you.",
      "You've been patient long enough. Let's build the plan."
    ],
    cta: "Book Your Free Call With Shana"
  }
};

// ── State ──
let currentQuestion = 0;
let scores = [];
let selectedAnswer = null;

// ── DOM refs ──
const progressFill   = document.getElementById('progressFill');
const progressLabel  = document.getElementById('progressLabel');
const questionScreen = document.getElementById('questionScreen');
const leadScreen     = document.getElementById('leadScreen');
const loadingScreen  = document.getElementById('loadingScreen');
const stepLabel      = document.getElementById('stepLabel');
const questionText   = document.getElementById('questionText');
const answersEl      = document.getElementById('answers');
const backBtn        = document.getElementById('backBtn');
const nextBtn        = document.getElementById('nextBtn');
const leadForm       = document.getElementById('leadForm');

function updateProgress() {
  const total = QUESTIONS.length + 1;
  const pct   = (currentQuestion / total) * 100;
  progressFill.style.width = pct + '%';
  progressLabel.textContent = currentQuestion < QUESTIONS.length
    ? `Question ${currentQuestion + 1} of ${QUESTIONS.length}`
    : 'Almost there';
}

function renderQuestion() {
  const q = QUESTIONS[currentQuestion];
  stepLabel.textContent    = `Question ${currentQuestion + 1} of ${QUESTIONS.length}`;
  questionText.textContent = q.text;

  answersEl.innerHTML = '';
  selectedAnswer = scores[currentQuestion] !== undefined ? scores[currentQuestion] : null;

  q.answers.forEach((a, i) => {
    const card = document.createElement('button');
    card.className = 'answer-card' + (selectedAnswer === i ? ' selected' : '');
    card.textContent = a.text;
    card.addEventListener('click', () => selectAnswer(i));
    answersEl.appendChild(card);
  });

  backBtn.disabled = currentQuestion === 0;
  nextBtn.disabled = selectedAnswer === null;
  nextBtn.textContent = currentQuestion === QUESTIONS.length - 1 ? 'See My Results →' : 'Next →';
  updateProgress();
}

function selectAnswer(index) {
  selectedAnswer = index;
  document.querySelectorAll('.answer-card').forEach((c, i) => {
    c.classList.toggle('selected', i === index);
  });
  nextBtn.disabled = false;
}

function goNext() {
  if (selectedAnswer === null) return;
  scores[currentQuestion] = selectedAnswer;
  currentQuestion++;
  if (currentQuestion >= QUESTIONS.length) {
    showLeadScreen();
  } else {
    animateIn(renderQuestion);
  }
}

function goBack() {
  if (currentQuestion === 0) return;
  currentQuestion--;
  animateIn(renderQuestion);
}

function animateIn(fn) {
  questionScreen.style.opacity = '0';
  questionScreen.style.transform = 'translateY(12px)';
  setTimeout(() => {
    fn();
    questionScreen.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    questionScreen.style.opacity = '1';
    questionScreen.style.transform = 'translateY(0)';
  }, 150);
}

function showLeadScreen() {
  questionScreen.classList.add('hidden');
  leadScreen.classList.remove('hidden');
  progressFill.style.width = '90%';
  progressLabel.textContent = 'Almost there';
}

function getResultType() {
  const counts = { 1: 0, 2: 0, 3: 0 };
  scores.forEach((answerIndex, qIndex) => {
    const type = QUESTIONS[qIndex].answers[answerIndex].type;
    counts[type]++;
  });
  return parseInt(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]);
}

function submitLead(e) {
  e.preventDefault();
  const name  = document.getElementById('firstName').value.trim();
  const email = document.getElementById('email').value.trim();
  if (!name || !email) return;

  const resultType = getResultType();
  localStorage.setItem('ss_result', resultType);
  localStorage.setItem('ss_name', name);
  localStorage.setItem('ss_path', 'financial');

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: '94db4811-bc72-4880-8788-345bca8393e5',
      name,
      email,
      path: 'Money & Life',
      quiz_result: RESULTS[resultType].label,
      subject: `New lead [Money & Life]: ${name} — ${RESULTS[resultType].label}`
    })
  }).catch(() => {});

  leadScreen.classList.add('hidden');
  loadingScreen.classList.remove('hidden');
  progressFill.style.width = '100%';

  setTimeout(() => {
    window.location.href = `results-financial.html?type=${RESULTS[resultType].type}`;
  }, 2200);
}

nextBtn.addEventListener('click', goNext);
backBtn.addEventListener('click', goBack);
leadForm.addEventListener('submit', submitLead);
renderQuestion();
