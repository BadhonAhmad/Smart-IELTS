export interface ListeningQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string;
  audio?: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  content: string;
  questions: ReadingQuestion[];
}

export interface ReadingQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string;
}

export interface WritingTask {
  id: string;
  type: 'task1' | 'task2';
  title: string;
  prompt: string;
  wordLimit: number;
  timeLimit: number;
}

export interface SpeakingQuestion {
  id: string;
  part: 1 | 2 | 3;
  question: string;
  prepTime?: number;
  speakTime: number;
}

// Mock Data
export const mockListeningQuestions: ListeningQuestion[] = [
  {
    id: '1',
    type: 'multiple-choice',
    question: 'What is the main topic of the conversation?',
    options: ['Travel plans', 'University courses', 'Job interview', 'Restaurant booking'],
    correctAnswer: 'University courses'
  },
  {
    id: '2',
    type: 'fill-blank',
    question: 'The lecture will be held on _______.',
    correctAnswer: 'Tuesday'
  }
];

export const mockReadingPassages: ReadingPassage[] = [
  {
    id: '1',
    title: 'Climate Change and Biodiversity',
    content: 'Climate change is one of the most pressing environmental challenges of our time. Rising temperatures, changing precipitation patterns, and extreme weather events are affecting ecosystems worldwide. The impact on biodiversity is particularly concerning, as many species struggle to adapt to rapidly changing conditions...',
    questions: [
      {
        id: '1',
        type: 'multiple-choice',
        question: 'According to the passage, what is the main cause of biodiversity loss?',
        options: ['Pollution', 'Climate change', 'Deforestation', 'Urbanization'],
        correctAnswer: 'Climate change'
      }
    ]
  }
];

export const mockWritingTasks: WritingTask[] = [
  {
    id: '1',
    type: 'task1',
    title: 'Academic Writing Task 1',
    prompt: 'The chart below shows the percentage of households in different income brackets in three countries. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.',
    wordLimit: 150,
    timeLimit: 20
  },
  {
    id: '2',
    type: 'task2',
    title: 'Academic Writing Task 2',
    prompt: 'Some people believe that universities should only offer subjects that are useful for the future, such as science and technology. Others believe that universities should offer a wide range of subjects. Discuss both views and give your opinion.',
    wordLimit: 250,
    timeLimit: 40
  }
];

export const mockSpeakingQuestions: SpeakingQuestion[] = [
  {
    id: '1',
    part: 1,
    question: 'Tell me about your hometown.',
    speakTime: 2
  },
  {
    id: '2',
    part: 2,
    question: 'Describe a book that you have read recently. You should say: what the book was about, why you chose to read it, what you learned from it, and explain whether you would recommend it to others.',
    prepTime: 1,
    speakTime: 2
  },
  {
    id: '3',
    part: 3,
    question: 'How do you think reading habits have changed over the past few decades?',
    speakTime: 3
  }
];