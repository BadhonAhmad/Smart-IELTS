const mongoose = require('mongoose');

// Schema for individual answer
const answerSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  selectedAnswer: {
    type: String,
    enum: ['A', 'B', 'C', 'D'],
    required: true
  },
  correctAnswer: {
    type: String,
    enum: ['A', 'B', 'C', 'D'],
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  timeSpent: {
    type: Number, // in seconds
    required: true,
    min: 0
  }
});

// Reading Test Attempt schema
const readingTestAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  readingTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReadingTest',
    required: true
  },
  answers: {
    type: [answerSchema],
    validate: {
      validator: function (answers) {
        return answers.length === 10;
      },
      message: 'Must answer all 10 questions'
    }
  },
  score: {
    totalQuestions: {
      type: Number,
      default: 10
    },
    correctAnswers: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    bandScore: {
      type: Number,
      min: 0,
      max: 9
    }
  },
  timing: {
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    totalTimeSpent: {
      type: Number, // in minutes
      required: true
    },
    timeLimit: {
      type: Number, // in minutes
      default: 20
    },
    isCompleted: {
      type: Boolean,
      default: true
    }
  },
  performance: {
    difficultyBreakdown: {
      easy: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      medium: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      hard: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      }
    },
    questionTypeBreakdown: {
      detail: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      main_idea: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      inference: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      vocabulary: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      reference: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      }
    }
  },
  feedback: {
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    overallComment: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
readingTestAttemptSchema.index({ user: 1, createdAt: -1 });
readingTestAttemptSchema.index({ readingTest: 1, 'score.percentage': -1 });
readingTestAttemptSchema.index({ 'score.bandScore': 1 });

// Virtual for IELTS band score calculation
readingTestAttemptSchema.virtual('calculatedBandScore').get(function () {
  const percentage = this.score.percentage;
  if (percentage >= 90) return 9;
  if (percentage >= 80) return 8;
  if (percentage >= 70) return 7;
  if (percentage >= 60) return 6;
  if (percentage >= 50) return 5;
  if (percentage >= 40) return 4;
  if (percentage >= 30) return 3;
  if (percentage >= 20) return 2;
  return 1;
});

// Method to calculate detailed performance
readingTestAttemptSchema.methods.calculatePerformance = function (readingTest) {
  const performance = {
    difficultyBreakdown: {
      easy: { correct: 0, total: 0 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 }
    },
    questionTypeBreakdown: {
      detail: { correct: 0, total: 0 },
      main_idea: { correct: 0, total: 0 },
      inference: { correct: 0, total: 0 },
      vocabulary: { correct: 0, total: 0 },
      reference: { correct: 0, total: 0 }
    }
  };

  this.answers.forEach((answer, index) => {
    const question = readingTest.questions[index];
    if (question) {
      // Difficulty breakdown
      performance.difficultyBreakdown[question.difficulty].total++;
      if (answer.isCorrect) {
        performance.difficultyBreakdown[question.difficulty].correct++;
      }

      // Question type breakdown
      performance.questionTypeBreakdown[question.questionType].total++;
      if (answer.isCorrect) {
        performance.questionTypeBreakdown[question.questionType].correct++;
      }
    }
  });

  this.performance = performance;
  return performance;
};

// Method to generate feedback
readingTestAttemptSchema.methods.generateFeedback = function () {
  const percentage = this.score.percentage;
  const performance = this.performance;
  const feedback = {
    strengths: [],
    weaknesses: [],
    recommendations: []
  };

  // Analyze difficulty performance
  Object.keys(performance.difficultyBreakdown).forEach(difficulty => {
    const stats = performance.difficultyBreakdown[difficulty];
    if (stats.total > 0) {
      const accuracy = (stats.correct / stats.total) * 100;
      if (accuracy >= 70) {
        feedback.strengths.push(`Strong performance on ${difficulty} questions (${accuracy.toFixed(1)}%)`);
      } else if (accuracy < 50) {
        feedback.weaknesses.push(`Need improvement on ${difficulty} questions (${accuracy.toFixed(1)}%)`);
        feedback.recommendations.push(`Practice more ${difficulty} level reading exercises`);
      }
    }
  });

  // Analyze question type performance
  Object.keys(performance.questionTypeBreakdown).forEach(type => {
    const stats = performance.questionTypeBreakdown[type];
    if (stats.total > 0) {
      const accuracy = (stats.correct / stats.total) * 100;
      if (accuracy < 50) {
        const typeMap = {
          detail: 'detail-finding',
          main_idea: 'main idea identification',
          inference: 'inference making',
          vocabulary: 'vocabulary understanding',
          reference: 'reference tracking'
        };
        feedback.weaknesses.push(`Difficulty with ${typeMap[type]} questions`);
        feedback.recommendations.push(`Focus on ${typeMap[type]} practice exercises`);
      }
    }
  });

  // Overall recommendations
  if (percentage < 60) {
    feedback.recommendations.push('Increase daily reading practice with academic texts');
    feedback.recommendations.push('Work on time management during reading tests');
  }

  // Generate overall comment
  let comment = '';
  if (percentage >= 80) {
    comment = 'Excellent performance! You demonstrate strong reading comprehension skills.';
  } else if (percentage >= 60) {
    comment = 'Good performance with room for improvement in specific areas.';
  } else if (percentage >= 40) {
    comment = 'Adequate performance, but significant improvement needed for IELTS success.';
  } else {
    comment = 'Needs substantial improvement. Focus on fundamental reading skills.';
  }

  feedback.overallComment = comment;
  this.feedback = feedback;
  return feedback;
};

// Static method to get user statistics
readingTestAttemptSchema.statics.getUserStats = function (userId) {
  return this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: '$score.percentage' },
        averageBandScore: { $avg: '$score.bandScore' },
        averageTimeSpent: { $avg: '$timing.totalTimeSpent' },
        bestScore: { $max: '$score.percentage' },
        latestAttempt: { $max: '$createdAt' }
      }
    }
  ]);
};

const ReadingTestAttempt = mongoose.model('ReadingTestAttempt', readingTestAttemptSchema);

module.exports = ReadingTestAttempt;