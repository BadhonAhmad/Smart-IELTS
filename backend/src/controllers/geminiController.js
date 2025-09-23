const { generateMCQQuestions, generateIELTSQuestions, generatePassage, generateIELTSPassage } = require('../services/geminiService');

/**
 * Generate general MCQ questions
 * POST /api/gemini/generate-mcq
 */
const generateMCQ = async (req, res) => {
  try {
    const { topic = 'General Knowledge', count = 5 } = req.body;

    // Validate count
    if (count < 1 || count > 10) {
      return res.status(400).json({
        success: false,
        message: 'Count must be between 1 and 10'
      });
    }

    const result = await generateMCQQuestions(topic, count);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate questions',
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'MCQ questions generated successfully',
      data: {
        topic,
        count: result.count,
        questions: result.data
      }
    });
  } catch (error) {
    console.error('Error in generateMCQ controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Generate IELTS skill-specific questions
 * POST /api/gemini/generate-ielts
 */
const generateIELTS = async (req, res) => {
  try {
    const { skill = 'reading', count = 5 } = req.body;

    // Validate skill
    const validSkills = ['listening', 'reading', 'writing', 'speaking'];
    if (!validSkills.includes(skill.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid skill. Must be one of: listening, reading, writing, speaking'
      });
    }

    // Validate count
    if (count < 1 || count > 10) {
      return res.status(400).json({
        success: false,
        message: 'Count must be between 1 and 10'
      });
    }

    const result = await generateIELTSQuestions(skill, count);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate IELTS questions',
        error: result.error
      });
    }

    res.json({
      success: true,
      message: `IELTS ${skill} questions generated successfully`,
      data: {
        skill,
        count: result.count,
        questions: result.data
      }
    });
  } catch (error) {
    console.error('Error in generateIELTS controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Test endpoint to check if Gemini AI is working
 * GET /api/gemini/test
 */
const testGemini = async (req, res) => {
  try {
    const result = await generateMCQQuestions('Basic English', 1);
    
    res.json({
      success: true,
      message: 'Gemini AI service is working',
      apiKeyConfigured: !!process.env.GEMINI_API_KEY,
      testResult: result
    });
  } catch (error) {
    console.error('Error in testGemini controller:', error);
    res.status(500).json({
      success: false,
      message: 'Gemini AI service test failed',
      error: error.message,
      apiKeyConfigured: !!process.env.GEMINI_API_KEY
    });
  }
};

/**
 * Generate a large passage for reading practice
 * POST /api/gemini/generate-passage
 */
const generateReadingPassage = async (req, res) => {
  try {
    const { topic = 'Academic Research', level = 'intermediate', wordCount = 500 } = req.body;

    // Validate level
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validLevels.includes(level.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid level. Must be one of: beginner, intermediate, advanced'
      });
    }

    // Validate word count
    if (wordCount < 200 || wordCount > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Word count must be between 200 and 1000'
      });
    }

    const result = await generatePassage(topic, level, wordCount);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate passage',
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'Reading passage generated successfully',
      data: result.data,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('Error in generateReadingPassage controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Generate IELTS themed passage
 * POST /api/gemini/generate-ielts-passage
 */
const generateIELTSReadingPassage = async (req, res) => {
  try {
    const { theme = 'science', level = 'intermediate', wordCount = 500 } = req.body;

    // Validate theme
    const validThemes = ['science', 'environment', 'education', 'culture', 'business', 'health', 'technology', 'history', 'society', 'arts'];
    if (!validThemes.includes(theme.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid theme. Must be one of: ${validThemes.join(', ')}`
      });
    }

    // Validate level
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validLevels.includes(level.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid level. Must be one of: beginner, intermediate, advanced'
      });
    }

    // Validate word count
    if (wordCount < 200 || wordCount > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Word count must be between 200 and 1000'
      });
    }

    const result = await generateIELTSPassage(theme, level, wordCount);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate IELTS passage',
        error: result.error
      });
    }

    res.json({
      success: true,
      message: `IELTS ${theme} passage generated successfully`,
      data: result.data,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('Error in generateIELTSReadingPassage controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Handle chat conversations with Gemini AI
 * POST /api/gemini/chat
 */
const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Import the specific function for chat
    const { generateChatResponse } = require('../services/geminiService');
    
    const result = await generateChatResponse(message);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate response',
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'Response generated successfully',
      response: result.data
    });
  } catch (error) {
    console.error('Error in handleChat controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  generateMCQ,
  generateIELTS,
  testGemini,
  generateReadingPassage,
  generateIELTSReadingPassage,
  handleChat
};