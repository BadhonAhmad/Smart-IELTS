export interface IMCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'listening' | 'reading' | 'general';
  section?: number; // For listening sections 1-4
  points: number;
  timeLimit?: number; // in seconds
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class MCQ implements IMCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'listening' | 'reading' | 'general';
  section?: number;
  points: number;
  timeLimit?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<IMCQ>) {
    this.id = data.id || '';
    this.question = data.question || '';
    this.options = data.options || [];
    this.correctAnswer = data.correctAnswer || '';
    this.explanation = data.explanation;
    this.difficulty = data.difficulty || 'medium';
    this.category = data.category || 'general';
    this.section = data.section;
    this.points = data.points || 1;
    this.timeLimit = data.timeLimit;
    this.tags = data.tags || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  validateAnswer(userAnswer: string): boolean {
    return userAnswer.trim().toLowerCase() === this.correctAnswer.trim().toLowerCase();
  }

  getHint(): string {
    if (this.explanation) {
      return this.explanation.substring(0, 50) + '...';
    }
    return 'No hint available';
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

  updateDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void {
    this.difficulty = difficulty;
    this.updatedAt = new Date();
  }

  toJSON(): IMCQ {
    return {
      id: this.id,
      question: this.question,
      options: this.options,
      correctAnswer: this.correctAnswer,
      explanation: this.explanation,
      difficulty: this.difficulty,
      category: this.category,
      section: this.section,
      points: this.points,
      timeLimit: this.timeLimit,
      tags: this.tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}