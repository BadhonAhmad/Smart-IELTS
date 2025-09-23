const mongoose = require('mongoose');

const listeningExerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  conversation: {
    type: String,
    required: true // The AI-generated conversation text for TTS
  },
  audioUrl: {
    type: String, // URL to generated audio file (optional)
  },
  questions: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['true_false', 'mcq', 'matching'],
      required: true
    },
    question: {
      type: String,
      required: true
    },
    options: {
      type: [String], // For MCQ and matching
      default: []
    },
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed, // String for true/false, string for mcq, array for matching
      required: true
    },
    explanation: {
      type: String,
      default: ''
    }
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  topic: {
    type: String,
    default: 'general'
  },
  duration: {
    type: Number, // Duration in minutes
    default: 10
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const ListeningExercise = mongoose.model('ListeningExercise', listeningExerciseSchema);

module.exports = ListeningExercise;