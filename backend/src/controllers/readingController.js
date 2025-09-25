const ReadingTest = require('../models/ReadingTest');
const ReadingTestAttempt = require('../models/ReadingTestAttempt');
const { generatePassage, generateQuestionsFromPassage, generateCompleteReadingTest, generateSinglePassageRound } = require('../services/geminiService');

/**
 * Generate a single passage and questions for a specific round
 * GET /api/reading/generate-round/:roundNumber
 */
const generateReadingRound = async (req, res) => {
  try {
    const roundNumber = parseInt(req.params.roundNumber);
    const level = req.query.level || 'intermediate';
    
    if (roundNumber < 1 || roundNumber > 3) {
      return res.status(400).json({
        success: false,
        message: 'Round number must be between 1 and 3'
      });
    }

    console.log(`Generating reading test round ${roundNumber} at ${level} level...`);
    
    // Generate single passage and questions
    const roundData = await generateSinglePassageRound(roundNumber, level);
    
    if (!roundData.success) {
      return res.status(500).json({
        success: false,
        message: `Failed to generate round ${roundNumber}`,
        error: roundData.error
      });
    }

    res.json({
      success: true,
      message: `Round ${roundNumber} generated successfully`,
      data: {
        roundNumber,
        passage: roundData.data.passage,
        questions: roundData.data.questions,
        metadata: roundData.data.metadata
      }
    });

  } catch (error) {
    console.error(`Error generating reading round ${req.params.roundNumber}:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to generate round ${req.params.roundNumber}`,
      error: error.message
    });
  }
};

/**
 * Generate a complete 3-passage reading test with 40 questions
 * GET /api/reading/generate-test
 */
const generateReadingTest = async (req, res) => {
  try {
    const levels = ['intermediate', 'advanced'];
    const level = levels[Math.floor(Math.random() * levels.length)];
    const title = `IELTS Academic Reading Test - 3 Passages`;

    console.log(`Generating 3-passage reading test at ${level} level...`);

    // Generate complete 3-passage test
    const testResult = await generateCompleteReadingTest(level);

    if (!testResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate reading test',
        error: testResult.error
      });
    }

    // Create reading test object
    const readingTest = new ReadingTest({
      title: title,
      passages: testResult.data.passages,
      questions: testResult.data.questions,
      questionsByPassage: testResult.data.questionsByPassage,
      metadata: {
        theme: 'mixed',
        level: level,
        tags: [...testResult.data.metadata.themes, level, 'ai-generated', '3-passages']
      },
      generatedBy: 'ai'
    });

    // Save to database
    const savedTest = await readingTest.save();

    res.status(201).json({
      success: true,
      message: '3-passage reading test generated successfully',
      data: savedTest
    });

  } catch (error) {
    console.error('Error generating reading test:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get all reading tests
 * GET /api/reading/tests
 */
const getAllReadingTests = async (req, res) => {
  try {
    const {
      theme,
      level,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isActive: true };

    if (theme) query['metadata.theme'] = theme;
    if (level) query['metadata.level'] = level;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const tests = await ReadingTest.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email');

    const totalTests = await ReadingTest.countDocuments(query);

    res.json({
      success: true,
      data: {
        tests,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalTests / parseInt(limit)),
          totalTests,
          hasNextPage: skip + tests.length < totalTests,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching reading tests:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get a specific reading test by ID
 * GET /api/reading/tests/:id
 */
const getReadingTestById = async (req, res) => {
  try {
    const { id } = req.params;

    const test = await ReadingTest.findById(id)
      .populate('createdBy', 'name email');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Reading test not found'
      });
    }

    if (!test.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Reading test is no longer available'
      });
    }

    res.json({
      success: true,
      data: test
    });

  } catch (error) {
    console.error('Error fetching reading test:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Submit reading test attempt
 * POST /api/reading/submit/:testId
 */
const submitReadingTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const { answers, startTime, endTime } = req.body;
    const userId = req.user?.id; // Assuming auth middleware sets this

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Validate inputs
    if (!answers || !Array.isArray(answers) || answers.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Must provide exactly 10 answers'
      });
    }

    // Get the reading test
    const readingTest = await ReadingTest.findById(testId);
    if (!readingTest || !readingTest.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Reading test not found'
      });
    }

    // Calculate score and timing
    let correctAnswers = 0;
    const processedAnswers = answers.map((answer, index) => {
      const question = readingTest.questions[index];
      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;

      return {
        questionNumber: index + 1,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        timeSpent: answer.timeSpent || 0
      };
    });

    const percentage = (correctAnswers / 10) * 100;
    const totalTimeSpent = Math.floor((new Date(endTime) - new Date(startTime)) / (1000 * 60));

    // Create test attempt
    const attempt = new ReadingTestAttempt({
      user: userId,
      readingTest: testId,
      answers: processedAnswers,
      score: {
        correctAnswers,
        percentage,
        bandScore: Math.max(1, Math.min(9, Math.floor(percentage / 10)))
      },
      timing: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        totalTimeSpent,
        timeLimit: readingTest.scoring.timeLimit
      }
    });

    // Calculate performance and feedback
    attempt.calculatePerformance(readingTest);
    attempt.generateFeedback();

    // Save attempt
    await attempt.save();

    // Update test statistics
    readingTest.statistics.totalAttempts += 1;
    const newAverage = ((readingTest.statistics.averageScore * (readingTest.statistics.totalAttempts - 1)) + percentage) / readingTest.statistics.totalAttempts;
    readingTest.statistics.averageScore = Math.round(newAverage * 100) / 100;

    const newTimeAverage = ((readingTest.statistics.averageTimeSpent * (readingTest.statistics.totalAttempts - 1)) + totalTimeSpent) / readingTest.statistics.totalAttempts;
    readingTest.statistics.averageTimeSpent = Math.round(newTimeAverage * 100) / 100;

    await readingTest.save();

    res.status(201).json({
      success: true,
      message: 'Reading test submitted successfully',
      data: {
        attemptId: attempt._id,
        score: attempt.score,
        timing: attempt.timing,
        performance: attempt.performance,
        feedback: attempt.feedback
      }
    });

  } catch (error) {
    console.error('Error submitting reading test:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get user's reading test attempts
 * GET /api/reading/my-attempts
 */
const getUserAttempts = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const attempts = await ReadingTestAttempt.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('readingTest', 'title metadata.theme metadata.level');

    const totalAttempts = await ReadingTestAttempt.countDocuments({ user: userId });

    res.json({
      success: true,
      data: {
        attempts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalAttempts / parseInt(limit)),
          totalAttempts,
          hasNextPage: skip + attempts.length < totalAttempts,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user attempts:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  generateReadingRound,
  generateReadingTest,
  getAllReadingTests,
  getReadingTestById,
  submitReadingTest,
  getUserAttempts
};