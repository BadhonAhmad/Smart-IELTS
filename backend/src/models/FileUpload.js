const mongoose = require('mongoose');

const fileUploadSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true,
    unique: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'completed', 'error'],
    default: 'uploaded'
  },
  section: {
    type: String,
    enum: ['listening', 'reading', 'writing', 'speaking', 'general'],
    default: 'general'
  },
  questionsExtracted: {
    type: Number,
    default: 0
  },
  processingError: {
    type: String
  },
  metadata: {
    pageCount: Number,
    extractedText: String,
    mcpProcessed: {
      type: Boolean,
      default: false
    }
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
fileUploadSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better performance
fileUploadSchema.index({ uploadedBy: 1, status: 1 });
fileUploadSchema.index({ section: 1, status: 1 });
fileUploadSchema.index({ createdAt: -1 });

const FileUpload = mongoose.model('FileUpload', fileUploadSchema);

module.exports = FileUpload;