import { MCQ } from './MCQ';

export interface IQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false-not-given' | 'yes-no-not-given' | 'fill-blank' | 'matching' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

export interface IPassage {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  type: 'academic' | 'general';
  timeRecommended: number; // in minutes
  questions: IQuestion[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class Question implements IQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false-not-given' | 'yes-no-not-given' | 'fill-blank' | 'matching' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;

  constructor(data: Partial<IQuestion>) {
    this.id = data.id || '';
    this.type = data.type || 'multiple-choice';
    this.question = data.question || '';
    this.options = data.options;
    this.correctAnswer = data.correctAnswer || '';
    this.points = data.points || 1;
    this.difficulty = data.difficulty || 'medium';
    this.explanation = data.explanation;
  }

  validateAnswer(userAnswer: string | string[]): boolean {
    if (Array.isArray(this.correctAnswer) && Array.isArray(userAnswer)) {
      return this.correctAnswer.every(ans => userAnswer.includes(ans)) && 
             userAnswer.every(ans => this.correctAnswer.includes(ans));
    }
    if (typeof this.correctAnswer === 'string' && typeof userAnswer === 'string') {
      return userAnswer.trim().toLowerCase() === this.correctAnswer.trim().toLowerCase();
    }
    return false;
  }

  toJSON(): IQuestion {
    return {
      id: this.id,
      type: this.type,
      question: this.question,
      options: this.options,
      correctAnswer: this.correctAnswer,
      points: this.points,
      difficulty: this.difficulty,
      explanation: this.explanation
    };
  }
}

export class Passage implements IPassage {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  type: 'academic' | 'general';
  timeRecommended: number;
  questions: IQuestion[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<IPassage>) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.content = data.content || '';
    this.wordCount = data.wordCount || this.calculateWordCount();
    this.difficulty = data.difficulty || 'medium';
    this.topic = data.topic || '';
    this.type = data.type || 'academic';
    this.timeRecommended = data.timeRecommended || 20;
    this.questions = data.questions || [];
    this.tags = data.tags || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  private calculateWordCount(): number {
    return this.content.split(/\s+/).filter(word => word.length > 0).length;
  }

  addQuestion(question: IQuestion): void {
    this.questions.push(question);
    this.updatedAt = new Date();
  }

  removeQuestion(questionId: string): void {
    this.questions = this.questions.filter(q => q.id !== questionId);
    this.updatedAt = new Date();
  }

  getQuestionsByType(type: IQuestion['type']): IQuestion[] {
    return this.questions.filter(q => q.type === type);
  }

  getTotalPoints(): number {
    return this.questions.reduce((total, q) => total + q.points, 0);
  }

  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date();
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
    this.updatedAt = new Date();
  }

  updateContent(content: string): void {
    this.content = content;
    this.wordCount = this.calculateWordCount();
    this.updatedAt = new Date();
  }

  toJSON(): IPassage {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      wordCount: this.wordCount,
      difficulty: this.difficulty,
      topic: this.topic,
      type: this.type,
      timeRecommended: this.timeRecommended,
      questions: this.questions,
      tags: this.tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}