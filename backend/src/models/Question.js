const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  section: {
    type: String,
    enum: ['listening', 'reading', 'writing', 'speaking'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  options: [{
    text: String,
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  explanation: {
    type: String
  },
  source: {
    filename: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    extractedAt: {
      type: Date,
      default: Date.now
    }
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
questionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better search performance
questionSchema.index({ section: 1, difficulty: 1, isActive: 1 });
questionSchema.index({ 'source.filename': 1 });
questionSchema.index({ tags: 1 });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;