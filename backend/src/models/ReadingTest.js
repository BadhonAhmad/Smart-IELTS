const mongoose = require('mongoose');

// Schema for individual MCQ questions
const mcqQuestionSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true,
    min: 1
  },
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    A: {
      type: String,
      required: true,
      trim: true
    },
    B: {
      type: String,
      required: true,
      trim: true
    },
    C: {
      type: String,
      required: true,
      trim: true
    },
    D: {
      type: String,
      required: true,
      trim: true
    }
  },
  correctAnswer: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D']
  },
  explanation: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  questionType: {
    type: String,
    enum: ['detail', 'main_idea', 'inference', 'vocabulary', 'reference'],
    default: 'detail'
  }
});

// Main Reading Test schema
const readingTestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  passages: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    wordCount: {
      type: Number,
      required: true,
      min: 500 // More flexible word count
    },
    readingTime: {
      type: Number, // in minutes
      default: function() {
        return Math.ceil(this.wordCount / 200); // Average reading speed
      }
    },
    summary: {
      type: String,
      required: true,
      trim: true
    },
    passageNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 3
    }
  }],
  questions: {
    type: [mcqQuestionSchema],
    validate: {
      validator: function(questions) {
        return questions.length >= 1; // Allow flexible question count
      },
      message: 'Reading test must have at least 1 question'
    }
  },
  questionsByPassage: {
    passage1: {
      type: [Number], // Array of question numbers for passage 1
      default: []
    },
    passage2: {
      type: [Number], // Array of question numbers for passage 2
      default: []
    },
    passage3: {
      type: [Number], // Array of question numbers for passage 3
      default: []
    }
  },
  metadata: {
    theme: {
      type: String,
      enum: ['science', 'environment', 'education', 'culture', 'business', 'health', 'technology', 'history', 'society', 'arts', 'mixed'],
      required: true
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
      default: 'intermediate'
    },
    tags: [{
      type: String,
      trim: true
    }],
    estimatedCompletionTime: {
      type: Number, // in minutes
      default: 20
    }
  },
  scoring: {
    totalMarks: {
      type: Number,
      default: 40
    },
    passingScore: {
      type: Number,
      default: 24
    },
    timeLimit: {
      type: Number, // in minutes
      default: 60 // 60 minutes for 3 passages
    }
  },
  statistics: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    averageTimeSpent: {
      type: Number, // in minutes
      default: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Can be system generated
  },
  isActive: {
    type: Boolean,
    default: true
  },
  generatedBy: {
    type: String,
    enum: ['ai', 'manual'],
    default: 'ai'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
readingTestSchema.index({ 'metadata.theme': 1, 'metadata.level': 1 });
readingTestSchema.index({ 'isActive': 1, 'createdAt': -1 });
readingTestSchema.index({ 'metadata.tags': 1 });

// Virtual for difficulty distribution
readingTestSchema.virtual('difficultyDistribution').get(function() {
  const distribution = { easy: 0, medium: 0, hard: 0 };
  this.questions.forEach(q => {
    distribution[q.difficulty]++;
  });
  return distribution;
});

// Virtual for question types distribution
readingTestSchema.virtual('questionTypesDistribution').get(function() {
  const distribution = { detail: 0, main_idea: 0, inference: 0, vocabulary: 0, reference: 0 };
  this.questions.forEach(q => {
    distribution[q.questionType]++;
  });
  return distribution;
});

// Method to calculate average difficulty
readingTestSchema.methods.getAverageDifficulty = function() {
  const difficultyScores = { easy: 1, medium: 2, hard: 3 };
  const totalScore = this.questions.reduce((sum, q) => sum + difficultyScores[q.difficulty], 0);
  return totalScore / this.questions.length;
};

// Method to get questions by difficulty
readingTestSchema.methods.getQuestionsByDifficulty = function(difficulty) {
  return this.questions.filter(q => q.difficulty === difficulty);
};

// Method to get questions by type
readingTestSchema.methods.getQuestionsByType = function(type) {
  return this.questions.filter(q => q.questionType === type);
};

// Static method to find tests by theme and level
readingTestSchema.statics.findByThemeAndLevel = function(theme, level) {
  return this.find({
    'metadata.theme': theme,
    'metadata.level': level,
    'isActive': true
  }).sort({ createdAt: -1 });
};

// Static method to get random test
readingTestSchema.statics.getRandomTest = function(level = null) {
  const query = { isActive: true };
  if (level) {
    query['metadata.level'] = level;
  }
  
  return this.aggregate([
    { $match: query },
    { $sample: { size: 1 } }
  ]);
};

// Pre-save middleware to ensure question numbers are sequential
readingTestSchema.pre('save', function(next) {
  if (this.questions && this.questions.length >= 40) {
    this.questions.forEach((question, index) => {
      question.questionNumber = index + 1;
    });
  }
  next();
});

// Pre-save middleware to calculate reading time for each passage
readingTestSchema.pre('save', function(next) {
  if (this.passages && this.passages.length === 3) {
    this.passages.forEach((passage) => {
      if (passage.wordCount) {
        passage.readingTime = Math.ceil(passage.wordCount / 200);
      }
    });
  }
  next();
});

const ReadingTest = mongoose.model('ReadingTest', readingTestSchema);

module.exports = ReadingTest;