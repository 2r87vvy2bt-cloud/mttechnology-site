function initFAQ() {
  const questions = [
    {
      question: 'How to cooperate with MT Technology?',
      answers: 'We’re always here to connect. You can reach us via [email], phone, or through the contact form.',
    },
    {
      question: 'What is the limit for the sale of raw materials?',
      answers: 'Tell us what you need, and we’ll build a custom offer.',
    },
    {
      question: 'How to become a permanent partner?',
      answers: 'Long-term collaboration starts with one step. We welcome forward-thinking companies to join our partner program.',
    },
  ];

  const questionsContainer = document.querySelector('.questions');
  questions.forEach((question, index) => {
    const q = document.createElement('div');
    q.classList.add('question');

    const questionText = document.createElement('div');
    questionText.classList.add('question__text');

    const ques = document.createElement('div');
    ques.classList.add('question__title');
    ques.innerHTML = question.question;
    ques.dataset.i18n = 'faq.questions.' + index;

    const answer = document.createElement('div');
    answer.classList.add('question__answer');
    answer.innerHTML = question.answers;
    answer.dataset.i18n = 'faq.answers.' + index;

    questionText.append(ques, answer);

    const btn = document.createElement('div');
    btn.classList.add('open-btn');

    const btnImg = document.createElement('img');
    btnImg.src = "../../public/images/icons/plus.svg";
    btnImg.loaded = 'lazy';

    btn.appendChild(btnImg);

    btn.addEventListener('click', () => {
      q.classList.toggle('active');

      const isOpen = answer.classList.toggle('active');
      btnImg.src = isOpen
        ? "../../public/images/icons/minus.svg"
        : "../../public/images/icons/plus.svg";
    })

    q.append(questionText, btn);
    questionsContainer.appendChild(q);
  });
}

window.initFAQ = initFAQ;