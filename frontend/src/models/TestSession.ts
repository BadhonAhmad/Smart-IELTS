export interface ITestAnswer {
  questionId: string;
  userAnswer: string | string[];
  isCorrect?: boolean;
  timeSpent: number; // in seconds
  timestamp: Date;
  attempts: number;
}

export interface ITestScore {
  overall: number;
  listening?: number;
  reading?: number;
  writing?: number;
  speaking?: number;
  breakdown: {
    correct: number;
    incorrect: number;
    unanswered: number;
    total: number;
    percentage: number;
  };
}

export interface ITestSession {
  id: string;
  userId: string;
  testType: 'listening' | 'reading' | 'writing' | 'speaking' | 'full-test';
  startTime: Date;
  endTime?: Date;
  status: 'in-progress' | 'completed' | 'abandoned' | 'paused';
  answers: ITestAnswer[];
  score?: ITestScore;
  timeLimit: number; // in minutes
  currentQuestionIndex: number;
  totalQuestions: number;
  settings: {
    showTimer: boolean;
    allowPause: boolean;
    showResults: boolean;
  };
}

export class TestAnswer implements ITestAnswer {
  questionId: string;
  userAnswer: string | string[];
  isCorrect?: boolean;
  timeSpent: number;
  timestamp: Date;
  attempts: number;

  constructor(data: Partial<ITestAnswer>) {
    this.questionId = data.questionId || '';
    this.userAnswer = data.userAnswer || '';
    this.isCorrect = data.isCorrect;
    this.timeSpent = data.timeSpent || 0;
    this.timestamp = data.timestamp || new Date();
    this.attempts = data.attempts || 1;
  }

  updateAnswer(answer: string | string[]): void {
    this.userAnswer = answer;
    this.attempts += 1;
    this.timestamp = new Date();
  }

  setCorrect(isCorrect: boolean): void {
    this.isCorrect = isCorrect;
  }

  addTimeSpent(seconds: number): void {
    this.timeSpent += seconds;
  }

  toJSON(): ITestAnswer {
    return {
      questionId: this.questionId,
      userAnswer: this.userAnswer,
      isCorrect: this.isCorrect,
      timeSpent: this.timeSpent,
      timestamp: this.timestamp,
      attempts: this.attempts
    };
  }
}

export class TestSession implements ITestSession {
  id: string;
  userId: string;
  testType: 'listening' | 'reading' | 'writing' | 'speaking' | 'full-test';
  startTime: Date;
  endTime?: Date;
  status: 'in-progress' | 'completed' | 'abandoned' | 'paused';
  answers: ITestAnswer[];
  score?: ITestScore;
  timeLimit: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  settings: {
    showTimer: boolean;
    allowPause: boolean;
    showResults: boolean;
  };

  constructor(data: Partial<ITestSession>) {
    this.id = data.id || '';
    this.userId = data.userId || '';
    this.testType = data.testType || 'reading';
    this.startTime = data.startTime || new Date();
    this.endTime = data.endTime;
    this.status = data.status || 'in-progress';
    this.answers = data.answers || [];
    this.score = data.score;
    this.timeLimit = data.timeLimit || 60;
    this.currentQuestionIndex = data.currentQuestionIndex || 0;
    this.totalQuestions = data.totalQuestions || 0;
    this.settings = data.settings || {
      showTimer: true,
      allowPause: true,
      showResults: true
    };
  }

  addAnswer(answer: ITestAnswer): void {
    const existingIndex = this.answers.findIndex(a => a.questionId === answer.questionId);
    if (existingIndex >= 0) {
      this.answers[existingIndex] = answer;
    } else {
      this.answers.push(answer);
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.totalQuestions - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  pause(): void {
    if (this.settings.allowPause) {
      this.status = 'paused';
    }
  }

  resume(): void {
    if (this.status === 'paused') {
      this.status = 'in-progress';
    }
  }

  complete(): void {
    this.status = 'completed';
    this.endTime = new Date();
    this.calculateScore();
  }

  abandon(): void {
    this.status = 'abandoned';
    this.endTime = new Date();
  }

  private calculateScore(): void {
    const correct = this.answers.filter(a => a.isCorrect === true).length;
    const incorrect = this.answers.filter(a => a.isCorrect === false).length;
    const unanswered = this.totalQuestions - this.answers.length;
    const total = this.totalQuestions;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    this.score = {
      overall: percentage,
      breakdown: {
        correct,
        incorrect,
        unanswered,
        total,
        percentage
      }
    };

    // Set section-specific scores based on test type
    if (this.testType === 'listening') {
      this.score.listening = percentage;
    } else if (this.testType === 'reading') {
      this.score.reading = percentage;
    }
  }

  getDuration(): number {
    if (this.endTime) {
      return Math.floor((this.endTime.getTime() - this.startTime.getTime()) / 1000 / 60);
    }
    return Math.floor((new Date().getTime() - this.startTime.getTime()) / 1000 / 60);
  }

  getProgress(): number {
    return Math.round((this.currentQuestionIndex / this.totalQuestions) * 100);
  }

  getRemainingTime(): number {
    const elapsed = this.getDuration();
    return Math.max(0, this.timeLimit - elapsed);
  }

  toJSON(): ITestSession {
    return {
      id: this.id,
      userId: this.userId,
      testType: this.testType,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.status,
      answers: this.answers,
      score: this.score,
      timeLimit: this.timeLimit,
      currentQuestionIndex: this.currentQuestionIndex,
      totalQuestions: this.totalQuestions,
      settings: this.settings
    };
  }
}