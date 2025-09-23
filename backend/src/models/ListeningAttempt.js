const mongoose = require('mongoose');

const listeningAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ListeningExercise',
    required: true
  },
  answers: [{
    questionId: {
      type: String,
      required: true
    },
    userAnswer: {
      type: mongoose.Schema.Types.Mixed, // Can be string, array, boolean
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    timeSpent: {
      type: Number, // Time spent on this question in seconds
      default: 0
    }
  }],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  totalTimeSpent: {
    type: Number, // Total time in minutes
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
listeningAttemptSchema.index({ userId: 1, exerciseId: 1 });
listeningAttemptSchema.index({ userId: 1, createdAt: -1 });

const ListeningAttempt = mongoose.model('ListeningAttempt', listeningAttemptSchema);

module.exports = ListeningAttempt;