export const questionBank = [
  // Basic Interactions
  {
    question: "Do you speak any other languages?",
    spanishQuestion: "¿Hablas otros idiomas?",
    expectedAnswer: "Sí, hablo inglés y español. / No, solo hablo español e inglés.",
    difficulty: 1 // 1-5 scale
  },
  {
    question: "Could you speak more slowly, please?",
    spanishQuestion: "¿Podrías hablar más despacio, por favor?",
    expectedAnswer: "Sí, claro. Hablaré más despacio.",
    difficulty: 1
  },

  // Specific Time-Based Questions (More complex due to time expressions)
  {
    question: "Are you available at 3 PM tomorrow?",
    spanishQuestion: "¿Estás disponible mañana a las tres de la tarde?",
    expectedAnswer: "Sí, estoy disponible. / No, no estoy disponible.",
    difficulty: 2
  },
  {
    question: "Can we meet next Monday at 2 PM?",
    spanishQuestion: "¿Podemos reunirnos el próximo lunes a las dos?",
    expectedAnswer: "Sí, podemos reunirnos. / No, no puedo reunirme.",
    difficulty: 2
  },

  // Direct Yes/No Questions (Past tense makes these harder)
  {
    question: "Did you complete your Spanish homework?",
    spanishQuestion: "¿Completaste tu tarea de español?",
    expectedAnswer: "Sí, completé mi tarea. / No, no completé mi tarea.",
    difficulty: 3
  },
  {
    question: "Have you studied the past tense?",
    spanishQuestion: "¿Has estudiado el tiempo pasado?",
    expectedAnswer: "Sí, he estudiado el pasado. / No, no lo he estudiado.",
    difficulty: 4 // Present perfect tense
  },

  // Specific Number Responses (Numbers and time expressions)
  {
    question: "How many hours do you study Spanish per week?",
    spanishQuestion: "¿Cuántas horas estudias español por semana?",
    expectedAnswer: "Estudio [número] horas por semana.",
    difficulty: 3
  },
  {
    question: "How many Spanish classes have you taken?",
    spanishQuestion: "¿Cuántas clases de español has tomado?",
    expectedAnswer: "He tomado [número] clases de español.",
    difficulty: 4 // Present perfect with numbers
  },

  // Simple Either/Or Questions (Comparative structures)
  {
    question: "Do you prefer morning or afternoon sessions?",
    spanishQuestion: "¿Prefieres las sesiones de mañana o tarde?",
    expectedAnswer: "Prefiero las sesiones de mañana/tarde.",
    difficulty: 2
  },
  {
    question: "Do you learn better by speaking or writing?",
    spanishQuestion: "¿Aprendes mejor hablando o escribiendo?",
    expectedAnswer: "Aprendo mejor hablando/escribiendo.",
    difficulty: 3 // Gerund forms
  },

  // Direct Comprehension Checks (Past tense and formal requests)
  {
    question: "Did you understand what I just said?",
    spanishQuestion: "¿Entendiste lo que acabo de decir?",
    expectedAnswer: "Sí, entendí. / No, no entendí.",
    difficulty: 3
  },
  {
    question: "Should I repeat the question?",
    spanishQuestion: "¿Debo repetir la pregunta?",
    expectedAnswer: "Sí, por favor repite. / No, entendí bien.",
    difficulty: 2
  }
]; 