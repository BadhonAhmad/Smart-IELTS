export interface IFeedback {
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  overallComment: string;
}

export interface ISpeakingScores {
  fluency: number; // 0-9
  lexicalResource: number; // 0-9
  grammaticalRange: number; // 0-9
  pronunciation: number; // 0-9
}

export interface IWritingScores {
  taskAchievement: number; // 0-9
  coherenceCohesion: number; // 0-9
  lexicalResource: number; // 0-9
  grammaticalRange: number; // 0-9
}

export interface ISpeakingEvaluation {
  id: string;
  sessionId: string;
  questionId: string;
  audioUrl?: string;
  transcript: string;
  duration: number; // in seconds
  scores: ISpeakingScores;
  feedback: IFeedback;
  overallScore: number; // 0-9
  evaluatedAt: Date;
  evaluatedBy: 'ai' | 'human' | 'self';
}

export interface IWritingEvaluation {
  id: string;
  sessionId: string;
  taskId: string;
  essay: string;
  wordCount: number;
  scores: IWritingScores;
  feedback: IFeedback;
  overallScore: number; // 0-9
  evaluatedAt: Date;
  evaluatedBy: 'ai' | 'human' | 'self';
  plagiarismCheck?: {
    score: number;
    sources: string[];
  };
}

export class SpeakingEvaluation implements ISpeakingEvaluation {
  id: string;
  sessionId: string;
  questionId: string;
  audioUrl?: string;
  transcript: string;
  duration: number;
  scores: ISpeakingScores;
  feedback: IFeedback;
  overallScore: number;
  evaluatedAt: Date;
  evaluatedBy: 'ai' | 'human' | 'self';

  constructor(data: Partial<ISpeakingEvaluation>) {
    this.id = data.id || '';
    this.sessionId = data.sessionId || '';
    this.questionId = data.questionId || '';
    this.audioUrl = data.audioUrl;
    this.transcript = data.transcript || '';
    this.duration = data.duration || 0;
    this.scores = data.scores || {
      fluency: 0,
      lexicalResource: 0,
      grammaticalRange: 0,
      pronunciation: 0
    };
    this.feedback = data.feedback || {
      strengths: [],
      improvements: [],
      suggestions: [],
      overallComment: ''
    };
    this.overallScore = data.overallScore || this.calculateOverallScore();
    this.evaluatedAt = data.evaluatedAt || new Date();
    this.evaluatedBy = data.evaluatedBy || 'ai';
  }

  private calculateOverallScore(): number {
    const { fluency, lexicalResource, grammaticalRange, pronunciation } = this.scores;
    return Math.round((fluency + lexicalResource + grammaticalRange + pronunciation) / 4 * 10) / 10;
  }

  updateScores(scores: Partial<ISpeakingScores>): void {
    this.scores = { ...this.scores, ...scores };
    this.overallScore = this.calculateOverallScore();
    this.evaluatedAt = new Date();
  }

  addFeedback(feedback: Partial<IFeedback>): void {
    this.feedback = { ...this.feedback, ...feedback };
    this.evaluatedAt = new Date();
  }

  getBandScore(): number {
    if (this.overallScore >= 8.5) return 9;
    if (this.overallScore >= 7.5) return 8;
    if (this.overallScore >= 6.5) return 7;
    if (this.overallScore >= 5.5) return 6;
    if (this.overallScore >= 4.5) return 5;
    if (this.overallScore >= 3.5) return 4;
    if (this.overallScore >= 2.5) return 3;
    if (this.overallScore >= 1.5) return 2;
    return 1;
  }

  toJSON(): ISpeakingEvaluation {
    return {
      id: this.id,
      sessionId: this.sessionId,
      questionId: this.questionId,
      audioUrl: this.audioUrl,
      transcript: this.transcript,
      duration: this.duration,
      scores: this.scores,
      feedback: this.feedback,
      overallScore: this.overallScore,
      evaluatedAt: this.evaluatedAt,
      evaluatedBy: this.evaluatedBy
    };
  }
}

export class WritingEvaluation implements IWritingEvaluation {
  id: string;
  sessionId: string;
  taskId: string;
  essay: string;
  wordCount: number;
  scores: IWritingScores;
  feedback: IFeedback;
  overallScore: number;
  evaluatedAt: Date;
  evaluatedBy: 'ai' | 'human' | 'self';
  plagiarismCheck?: {
    score: number;
    sources: string[];
  };

  constructor(data: Partial<IWritingEvaluation>) {
    this.id = data.id || '';
    this.sessionId = data.sessionId || '';
    this.taskId = data.taskId || '';
    this.essay = data.essay || '';
    this.wordCount = data.wordCount || this.calculateWordCount();
    this.scores = data.scores || {
      taskAchievement: 0,
      coherenceCohesion: 0,
      lexicalResource: 0,
      grammaticalRange: 0
    };
    this.feedback = data.feedback || {
      strengths: [],
      improvements: [],
      suggestions: [],
      overallComment: ''
    };
    this.overallScore = data.overallScore || this.calculateOverallScore();
    this.evaluatedAt = data.evaluatedAt || new Date();
    this.evaluatedBy = data.evaluatedBy || 'ai';
    this.plagiarismCheck = data.plagiarismCheck;
  }

  private calculateWordCount(): number {
    return this.essay.split(/\s+/).filter(word => word.length > 0).length;
  }

  private calculateOverallScore(): number {
    const { taskAchievement, coherenceCohesion, lexicalResource, grammaticalRange } = this.scores;
    return Math.round((taskAchievement + coherenceCohesion + lexicalResource + grammaticalRange) / 4 * 10) / 10;
  }

  updateScores(scores: Partial<IWritingScores>): void {
    this.scores = { ...this.scores, ...scores };
    this.overallScore = this.calculateOverallScore();
    this.evaluatedAt = new Date();
  }

  addFeedback(feedback: Partial<IFeedback>): void {
    this.feedback = { ...this.feedback, ...feedback };
    this.evaluatedAt = new Date();
  }

  updateEssay(essay: string): void {
    this.essay = essay;
    this.wordCount = this.calculateWordCount();
    this.evaluatedAt = new Date();
  }

  setBandScore(): number {
    if (this.overallScore >= 8.5) return 9;
    if (this.overallScore >= 7.5) return 8;
    if (this.overallScore >= 6.5) return 7;
    if (this.overallScore >= 5.5) return 6;
    if (this.overallScore >= 4.5) return 5;
    if (this.overallScore >= 3.5) return 4;
    if (this.overallScore >= 2.5) return 3;
    if (this.overallScore >= 1.5) return 2;
    return 1;
  }

  addPlagiarismCheck(score: number, sources: string[]): void {
    this.plagiarismCheck = { score, sources };
    this.evaluatedAt = new Date();
  }

  toJSON(): IWritingEvaluation {
    return {
      id: this.id,
      sessionId: this.sessionId,
      taskId: this.taskId,
      essay: this.essay,
      wordCount: this.wordCount,
      scores: this.scores,
      feedback: this.feedback,
      overallScore: this.overallScore,
      evaluatedAt: this.evaluatedAt,
      evaluatedBy: this.evaluatedBy,
      plagiarismCheck: this.plagiarismCheck
    };
  }
}