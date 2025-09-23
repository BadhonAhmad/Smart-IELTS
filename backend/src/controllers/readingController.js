const ReadingTest = require('../models/ReadingTest');
const ReadingTestAttempt = require('../models/ReadingTestAttempt');
const { generatePassage, generateQuestionsFromPassage } = require('../services/geminiService');

/**
 * Generate a complete reading test with passage and 10 MCQs
 * POST /api/reading/generate-test
 */
const generateReadingTest = async (req, res) => {
  try {
    const {
      theme = 'science',
      level = 'intermediate',
      wordCount = 500,
      title
    } = req.body;

    // Validate inputs
    const validThemes = ['science', 'environment', 'education', 'culture', 'business', 'health', 'technology', 'history', 'society', 'arts'];
    const validLevels = ['beginner', 'intermediate', 'advanced'];

    if (!validThemes.includes(theme)) {
      return res.status(400).json({
        success: false,
        message: `Invalid theme. Must be one of: ${validThemes.join(', ')}`
      });
    }

    if (!validLevels.includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid level. Must be one of: beginner, intermediate, advanced'
      });
    }

    if (wordCount < 200 || wordCount > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Word count must be between 200 and 1000'
      });
    }

    // Step 1: Generate passage
    const themeDescriptions = {
      science: 'Scientific discoveries and technological innovations',
      environment: 'Environmental issues and climate change',
      education: 'Educational systems and learning methodologies',
      culture: 'Cultural diversity and social anthropology',
      business: 'Business management and economic development',
      health: 'Healthcare systems and medical research',
      technology: 'Digital technology and artificial intelligence',
      history: 'Historical events and archaeological discoveries',
      society: 'Social issues and community development',
      arts: 'Arts, literature and creative expression'
    };

    const passageResult = await generatePassage(themeDescriptions[theme], level, wordCount);

    if (!passageResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate passage',
        error: passageResult.error
      });
    }

    // Step 2: Generate 10 MCQ questions based on the passage
    const questionsResult = await generateQuestionsFromPassage(passageResult.data.content, level);

    if (!questionsResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate questions',
        error: questionsResult.error
      });
    }

    // Step 3: Create reading test object
    const readingTest = new ReadingTest({
      title: title || passageResult.data.title || `${theme.charAt(0).toUpperCase() + theme.slice(1)} Reading Test`,
      passage: {
        title: passageResult.data.title,
        content: passageResult.data.content,
        wordCount: passageResult.data.wordCount,
        summary: passageResult.data.summary
      },
      questions: questionsResult.data.map((q, index) => ({
        questionNumber: index + 1,
        questionText: q.questionText,
        options: {
          A: q.options.A,
          B: q.options.B,
          C: q.options.C,
          D: q.options.D
        },
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty || 'medium',
        questionType: q.questionType || 'detail'
      })),
      metadata: {
        theme,
        level,
        tags: [theme, level, 'ai-generated']
      },
      generatedBy: 'ai'
    });

    // Step 4: Save to database
    const savedTest = await readingTest.save();

    res.status(201).json({
      success: true,
      message: 'Reading test generated successfully',
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
  generateReadingTest,
  getAllReadingTests,
  getReadingTestById,
  submitReadingTest,
  getUserAttempts
};