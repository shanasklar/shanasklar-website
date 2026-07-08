const QUESTIONS = [
  {
    id: 1,
    text: "When you imagine your life five years from now — exactly as it is today — what's your gut reaction?",
    answers: [
      { text: "Absolute dread. I cannot keep doing this.", type: 2 },
      { text: "A deep sadness. I know I'm capable of so much more.", type: 1 },
      { text: "Confusion — I honestly don't know what I even want.", type: 1 },
      { text: "I've already started changing things, but I feel lost.", type: 3 }
    ]
  },
  {
    id: 2,
    text: "What feels most like your trap right now?",
    answers: [
      { text: "A career or role I've outgrown — or never truly chose.", type: 2 },
      { text: "Other people's expectations: family, society, a partner.", type: 1 },
      { text: "My own inner critic — I talk myself out of everything.", type: 1 },
      { text: "I've taken steps to change but I'm second-guessing all of them.", type: 3 }
    ]
  },
  {
    id: 3,
    text: "How long have you known something needs to change?",
    answers: [
      { text: "Years. I keep pushing it down and it keeps coming back.", type: 2 },
      { text: "Months — it's been quietly building.", type: 2 },
      { text: "I just woke up to it recently. It's new and disorienting.", type: 1 },
      { text: "I knew, I acted on it — and now I'm not sure I made the right call.", type: 3 }
    ]
  },
  {
    id: 4,
    text: "What would feel like a real win for you a year from now?",
    answers: [
      { text: "Waking up without that knot in my stomach every morning.", type: 1 },
      { text: "Having income and freedom on my own terms.", type: 2 },
      { text: "Knowing who I am outside of what I do for everyone else.", type: 1 },
      { text: "Moving forward with confidence instead of constantly second-guessing myself.", type: 3 }
    ]
  },
  {
    id: 5,
    text: "When you think about asking for help and investing in yourself — what comes up?",
    answers: [
      { text: "I've never really done it. I put everyone else first, always.", type: 1 },
      { text: "I'm ready. I know I need someone in my corner.", type: 2 },
      { text: "I've tried things before and I'm not sure where it went wrong.", type: 3 },
      { text: "It feels scary, but I know deep down that it's time.", type: 2 }
    ]
  }
];

const RESULTS = {
  1: {
    type: "awakening",
    label: "The Awakening",
    headline: "You're waking up. And that's exactly the right place to start.",
    lead: "You've been living on autopilot — doing what was expected, being who people needed, quietly wondering if this is really all there is. The fact that you're here means something in you is stirring.",
    body: [
      "This isn't a crisis. It's a calling.",
      "What you need most right now isn't a 10-step plan. It's <strong>permission to get honest with yourself</strong> — about what you've been tolerating, what you actually want, and what your life could look like if you stopped designing it for other people.",
      "Shana works with women in exactly this place. Her 1:1 coaching starts with clarity — helping you cut through the noise, name what's real, and begin building from there."
    ],
    cta: "Book Your Clarity Call With Shana",
    callType: "complimentary clarity call"
  },
  2: {
    type: "ready-rebel",
    label: "The Ready Rebel",
    headline: "You know. You've known for a while.",
    lead: "You're not stuck in confusion — you're stuck in the gap between knowing and doing. You can feel the life you want; you just can't see the bridge to get there. And that gap is exhausting.",
    body: [
      "Here's what's true: you don't need more motivation. <strong>You need a strategy — and someone who won't let you talk yourself out of it.</strong>",
      "Shana spent years in a career that looked right on paper while slowly losing herself inside it. She didn't leave recklessly — she built a plan. And she helps women like you do the same: get clear on the exit, build confidence in the path, and take the leap without burning everything down.",
      "You've waited long enough. Let's build your way out."
    ],
    cta: "Book Your Strategy Call With Shana",
    callType: "complimentary strategy call"
  },
  3: {
    type: "in-between",
    label: "The In-Between",
    headline: "You were brave enough to start. Now you need help finishing.",
    lead: "You've already made a move — or you're mid-leap — and instead of feeling free, you feel unmoored. The old life doesn't fit anymore, but the new one isn't fully formed yet. This is the hardest part of any transformation, and most people don't talk about it.",
    body: [
      "<strong>You haven't made a mistake. You're just in the middle of your story.</strong>",
      "Shana knows this place. She's lived it. And she specializes in helping women who are already in motion find solid ground — rebuilding identity, reclaiming confidence, and moving forward with direction instead of doubt.",
      "The transition isn't the end. It's the beginning of the real thing."
    ],
    cta: "Book Your Coaching Call With Shana",
    callType: "complimentary coaching call"
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
  const total = QUESTIONS.length + 1; // +1 for lead screen
  const pct   = ((currentQuestion) / total) * 100;
  progressFill.style.width = pct + '%';
  progressLabel.textContent = currentQuestion < QUESTIONS.length
    ? `Question ${currentQuestion + 1} of ${QUESTIONS.length}`
    : 'Almost there';
}

function renderQuestion() {
  const q = QUESTIONS[currentQuestion];
  stepLabel.textContent  = `Question ${currentQuestion + 1} of ${QUESTIONS.length}`;
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
  updateProgress();
  progressFill.style.width = '90%';
  progressLabel.textContent = 'Almost there';
}

function getResultType() {
  const typeCounts = { 1: 0, 2: 0, 3: 0 };
  scores.forEach((answerIndex, qIndex) => {
    const type = QUESTIONS[qIndex].answers[answerIndex].type;
    typeCounts[type]++;
  });
  // Return whichever type scored highest (ties go to lower number)
  return parseInt(Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0]);
}

function submitLead(e) {
  e.preventDefault();
  const name  = document.getElementById('firstName').value.trim();
  const email = document.getElementById('email').value.trim();
  if (!name || !email) return;

  const resultType = getResultType();
  const resultKey  = RESULTS[resultType].type;

  // Save to localStorage for results page
  localStorage.setItem('ss_result', resultType);
  localStorage.setItem('ss_name', name);

  // Submit to Formspree — replace YOUR_FORM_ID with your actual Formspree form ID
  // Sign up free at formspree.io, create a form, and paste the ID here
  const FORMSPREE_ID = 'YOUR_FORM_ID';

  if (FORMSPREE_ID !== 'YOUR_FORM_ID') {
    fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name,
        email,
        quiz_result: RESULTS[resultType].label,
        quiz_result_type: resultKey
      })
    }).catch(() => {}); // fire and forget — don't block the redirect
  }

  leadScreen.classList.add('hidden');
  loadingScreen.classList.remove('hidden');
  progressFill.style.width = '100%';
  progressLabel.textContent = 'Calculating…';

  setTimeout(() => {
    window.location.href = `results.html?type=${resultKey}`;
  }, 2200);
}

// ── Init ──
nextBtn.addEventListener('click', goNext);
backBtn.addEventListener('click', goBack);
leadForm.addEventListener('submit', submitLead);
renderQuestion();
