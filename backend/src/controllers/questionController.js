const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { validationResult } = require('express-validator');
const FileUpload = require('../models/FileUpload');
const Question = require('../models/Question');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload PDF file
exports.uploadPDF = [
  upload.single('pdf'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'No file uploaded'
        });
      }

      // Create file upload record
      const fileUpload = await FileUpload.create({
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploadedBy: req.user.id,
        section: req.body.section || 'general',
        status: 'uploaded'
      });

      // TODO: Integrate with MCP server for PDF processing
      // For now, we'll simulate processing
      setTimeout(async () => {
        try {
          await FileUpload.findByIdAndUpdate(fileUpload._id, {
            status: 'processing'
          });

          // Simulate question extraction
          setTimeout(async () => {
            const questionsCount = Math.floor(Math.random() * 50) + 10;
            await FileUpload.findByIdAndUpdate(fileUpload._id, {
              status: 'completed',
              questionsExtracted: questionsCount,
              'metadata.mcpProcessed': true
            });
          }, 3000);
        } catch (error) {
          console.error('Processing error:', error);
        }
      }, 1000);

      res.status(201).json({
        status: 'success',
        data: {
          file: fileUpload
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        status: 'error',
        message: 'File upload failed'
      });
    }
  }
];

// Get all uploaded files
exports.getUploadedFiles = async (req, res) => {
  try {
    const files = await FileUpload.find({})
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: files.length,
      data: {
        files
      }
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch files'
    });
  }
};

// Delete uploaded file
exports.deleteFile = async (req, res) => {
  try {
    const file = await FileUpload.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({
        status: 'error',
        message: 'File not found'
      });
    }

    // Delete physical file
    const filePath = path.join(__dirname, '../../uploads', file.filename);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.warn('Could not delete physical file:', error.message);
    }

    // Delete related questions
    await Question.deleteMany({ 'source.filename': file.filename });

    // Delete file record
    await FileUpload.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete file'
    });
  }
};

// Get questions from a specific file
exports.getQuestionsFromFile = async (req, res) => {
  try {
    const file = await FileUpload.findById(req.params.fileId);
    
    if (!file) {
      return res.status(404).json({
        status: 'error',
        message: 'File not found'
      });
    }

    const questions = await Question.find({ 'source.filename': file.filename })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: questions.length,
      data: {
        file,
        questions
      }
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch questions'
    });
  }
};

// Get all questions
exports.getAllQuestions = async (req, res) => {
  try {
    const { section, difficulty, page = 1, limit = 10 } = req.query;
    
    const filter = { isActive: true };
    if (section) filter.section = section;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await Question.find(filter)
      .populate('source.uploadedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Question.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      results: questions.length,
      data: {
        questions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch questions'
    });
  }
};