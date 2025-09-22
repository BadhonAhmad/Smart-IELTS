// Export all model interfaces and classes
export * from './User';
export * from './MCQ';
export * from './Passage';
export * from './TestSession';
export * from './Evaluation';

// Re-export for easier imports
export { User, type IUser } from './User';
export { MCQ, type IMCQ } from './MCQ';
export { Passage, Question, type IPassage, type IQuestion } from './Passage';
export { TestSession, TestAnswer, type ITestSession, type ITestAnswer, type ITestScore } from './TestSession';
export { 
  SpeakingEvaluation, 
  WritingEvaluation, 
  type ISpeakingEvaluation, 
  type IWritingEvaluation,
  type IFeedback,
  type ISpeakingScores,
  type IWritingScores 
} from './Evaluation';

// Model factory functions for easy instantiation
export const ModelFactory = {
  createUser: (data: Partial<IUser>) => new User(data),
  createMCQ: (data: Partial<IMCQ>) => new MCQ(data),
  createPassage: (data: Partial<IPassage>) => new Passage(data),
  createQuestion: (data: Partial<IQuestion>) => new Question(data),
  createTestSession: (data: Partial<ITestSession>) => new TestSession(data),
  createTestAnswer: (data: Partial<ITestAnswer>) => new TestAnswer(data),
  createSpeakingEvaluation: (data: Partial<ISpeakingEvaluation>) => new SpeakingEvaluation(data),
  createWritingEvaluation: (data: Partial<IWritingEvaluation>) => new WritingEvaluation(data)
};

// Utility types for data from agents/APIs
export type AgentMCQData = Omit<IMCQ, 'id' | 'createdAt' | 'updatedAt'>;
export type AgentPassageData = Omit<IPassage, 'id' | 'createdAt' | 'updatedAt' | 'wordCount'>;
export type AgentUserData = Omit<IUser, 'id' | 'createdAt' | 'updatedAt' | 'isVerified'>;

// Validation helpers
export const ValidationHelpers = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  isValidPassword: (password: string): boolean => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /\d/.test(password);
  },
  
  isValidMCQOptions: (options: string[]): boolean => {
    return options.length >= 2 && options.length <= 6;
  },
  
  isValidPassageLength: (content: string): boolean => {
    const wordCount = content.split(/\s+/).length;
    return wordCount >= 100 && wordCount <= 1000;
  }
};