const QUESTIONS = [
  {
    id: 1,
    text: "What's your biggest challenge with your dog right now?",
    answers: [
      { text: "Pulling on the leash, reactivity, or ignoring me in public.", type: 2 },
      { text: "Basic commands — sit, stay, come — aren't reliable yet.", type: 1 },
      { text: "Anxiety, fear, or shutting down. My dog seems stressed.", type: 3 },
      { text: "We just got a new dog and I want to start things right.", type: 1 }
    ]
  },
  {
    id: 2,
    text: "How would you describe your dog at home vs. out in the world?",
    answers: [
      { text: "Great at home, completely different outside.", type: 2 },
      { text: "Inconsistent — I never know which dog I'm going to get.", type: 2 },
      { text: "Anxious in both settings. They can't seem to settle.", type: 3 },
      { text: "Pretty good overall — I just want a stronger foundation.", type: 1 }
    ]
  },
  {
    id: 3,
    text: "What does success look like for you and your dog?",
    answers: [
      { text: "Calm, loose-leash walks and being ignored in public.", type: 2 },
      { text: "Reliable commands and a dog who actually listens.", type: 1 },
      { text: "A calmer, happier dog who feels safe in the world.", type: 3 },
      { text: "A deep bond — I want my dog to trust me and want to be with me.", type: 3 }
    ]
  },
  {
    id: 4,
    text: "Have you worked with a trainer before?",
    answers: [
      { text: "Never — this is our first time seeking help.", type: 1 },
      { text: "We tried group classes but needed something more personal.", type: 2 },
      { text: "Yes, but the approach didn't fit us. We're starting fresh.", type: 3 },
      { text: "We've made some progress but hit a wall and need more.", type: 2 }
    ]
  }
];

const RESULTS = {
  1: {
    type: "fresh-start",
    label: "The Fresh Start",
    headline: "The best time to build the right foundation is right now.",
    lead: "Whether you just got your dog or you're starting over, you're in the ideal position — you get to build this relationship from the ground up, the right way.",
    where: "You're at the beginning of the training journey. There's no bad history to undo, no patterns to break. Just a dog and a human learning how to speak each other's language.",
    need: "A clear, consistent foundation built on communication and trust — not force, not fear. The Scentsible K9 method teaches you how to be the calm, confident leader your dog is already looking for.",
    body: [
      "Dogs don't need dominance. They need a <strong>regulated, consistent human</strong> who communicates clearly and makes them feel safe.",
      "Shana's approach starts with understanding your dog — what they're communicating, what they need, and what conditions help them feel safe enough to learn. From there, you'll build real skills together: leash manners, basic obedience, and the foundation of a relationship built on trust.",
      "Starting right is the greatest gift you can give your dog."
    ],
    cta: "Book Your Free Consultation"
  },
  2: {
    type: "breakthrough",
    label: "The Breakthrough",
    headline: "You've tried. Your dog has tried. You both deserve an approach that actually works.",
    lead: "You're not starting from zero — you've put in the work. But something isn't clicking, and it's frustrating. The missing piece usually isn't technique. It's the nervous system underneath it.",
    where: "You've got experience and some results — but also some stuck points. Your dog knows what you're asking; they're just not consistently responding. That gap is workable.",
    need: "A different lens. The Scentsible K9 method looks at what's happening in your dog's nervous system — and yours — before applying any technique. When both are regulated, everything gets easier.",
    body: [
      "Most training focuses on what the dog is doing. Shana focuses on <strong>why</strong> — and that's where breakthroughs happen.",
      "If your dog is reactive, inconsistent, or seems to forget everything they know in certain situations, it's almost always a nervous system response, not a training failure. We'll identify exactly what's triggering it and build a real solution around your actual life.",
      "You're closer to the breakthrough than it feels."
    ],
    cta: "Book Your Free Consultation"
  },
  3: {
    type: "bond-builder",
    label: "The Bond Builder",
    headline: "Your dog isn't the problem. The connection is just missing — and that's fixable.",
    lead: "You want more than obedience. You want a dog that's calm, happy, and actually wants to be with you. That kind of relationship isn't trained — it's built. And it starts with understanding.",
    where: "Something is off in the communication between you and your dog. They may be anxious, checked out, or just not reading your signals. The good news: nervous systems are remarkably responsive to the right conditions.",
    need: "A focus on connection before commands. Shana uses the Scentsible K9 method to help you understand what your dog is telling you — and how to respond in a way that builds trust, not compliance.",
    body: [
      "Anxious dogs aren't difficult dogs. They're dogs who <strong>haven't felt safe enough to relax into the relationship yet.</strong>",
      "Shana works with you to create the conditions your dog needs to feel safe, seen, and secure — the three foundations of the Scentsible K9 method. You'll learn to read what your dog is actually communicating and respond in a way that builds genuine trust, not just compliance.",
      "The dog you want is already in there. They just need the right conditions to come out."
    ],
    cta: "Book Your Free Consultation"
  }
};

// ── State ──
let currentQuestion = 0;
let scores = [];
let selectedAnswer = null;

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
  localStorage.setItem('ss_path', 'dogs');

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: '94db4811-bc72-4880-8788-345bca8393e5',
      name,
      email,
      path: 'You & Your Dog',
      quiz_result: RESULTS[resultType].label,
      subject: `New lead [Dog Training]: ${name} — ${RESULTS[resultType].label}`
    })
  }).catch(() => {});

  leadScreen.classList.add('hidden');
  loadingScreen.classList.remove('hidden');
  progressFill.style.width = '100%';

  setTimeout(() => {
    window.location.href = `results-dogs.html?type=${RESULTS[resultType].type}`;
  }, 2200);
}

nextBtn.addEventListener('click', goNext);
backBtn.addEventListener('click', goBack);
leadForm.addEventListener('submit', submitLead);
renderQuestion();
