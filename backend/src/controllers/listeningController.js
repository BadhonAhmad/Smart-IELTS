const ListeningExercise = require('../models/ListeningExercise');
const ListeningAttempt = require('../models/ListeningAttempt');
const geminiService = require('../services/geminiService');

// Generate a new listening exercise
exports.generateExercise = async (req, res) => {
  try {
    const { topic = 'general', difficulty = 'intermediate' } = req.body;
    const userId = req.user.id;

    console.log(`Generating listening exercise - Topic: ${topic}, Difficulty: ${difficulty}`);
    
    // Generate exercise using Gemini AI
    const exerciseData = await geminiService.generateListeningExercise(topic, difficulty);
    
    // Create and save the exercise
    const exercise = new ListeningExercise({
      title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Listening Exercise`,
      conversation: exerciseData.conversation,
      questions: exerciseData.questions,
      difficulty,
      topic,
      createdBy: userId
    });

    await exercise.save();

    // Return exercise without showing the conversation text (for listening purposes)
    const responseExercise = {
      _id: exercise._id,
      title: exercise.title,
      questions: exercise.questions.map(q => ({
        id: q.id,
        type: q.type,
        question: q.question,
        options: q.options
        // Don't include correctAnswer or explanation
      })),
      difficulty: exercise.difficulty,
      topic: exercise.topic,
      duration: exercise.duration,
      // Don't include conversation text - it's for TTS only
      hasConversation: true
    };

    res.status(201).json({
      status: 'success',
      data: {
        exercise: responseExercise,
        conversationForTTS: exerciseData.conversation // Separate field for TTS
      }
    });
  } catch (error) {
    console.error('Generate exercise error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate listening exercise'
    });
  }
};

// Get conversation text for Text-to-Speech (internal use)
exports.getConversationForTTS = async (req, res) => {
  try {
    const { exerciseId } = req.params;

    const exercise = await ListeningExercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).json({
        status: 'error',
        message: 'Exercise not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        conversation: exercise.conversation
      }
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get conversation'
    });
  }
};

// Submit answers and get results
exports.submitAnswers = async (req, res) => {
  try {
    const { exerciseId, answers, startTime, endTime } = req.body;
    const userId = req.user.id;

    // Find the exercise
    const exercise = await ListeningExercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).json({
        status: 'error',
        message: 'Exercise not found'
      });
    }

    // Calculate results
    const results = [];
    let correctCount = 0;

    exercise.questions.forEach(question => {
      const userAnswer = answers.find(a => a.questionId === question.id);
      let isCorrect = false;

      if (userAnswer) {
        // Check answer based on question type
        if (question.type === 'true_false') {
          isCorrect = userAnswer.answer.toLowerCase() === question.correctAnswer.toLowerCase();
        } else if (question.type === 'mcq') {
          isCorrect = userAnswer.answer === question.correctAnswer;
        } else if (question.type === 'matching') {
          // For matching, compare arrays
          const userAnswerArray = Array.isArray(userAnswer.answer) ? userAnswer.answer : [];
          const correctAnswerArray = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
          isCorrect = JSON.stringify(userAnswerArray.sort()) === JSON.stringify(correctAnswerArray.sort());
        }

        if (isCorrect) correctCount++;
      }

      results.push({
        questionId: question.id,
        userAnswer: userAnswer ? userAnswer.answer : null,
        correctAnswer: question.correctAnswer,
        isCorrect,
        question: question.question,
        type: question.type,
        options: question.options,
        explanation: question.explanation
      });
    });

    const score = Math.round((correctCount / exercise.questions.length) * 100);
    const totalTimeSpent = Math.round((new Date(endTime) - new Date(startTime)) / (1000 * 60)); // in minutes

    // Save the attempt
    const attempt = new ListeningAttempt({
      userId,
      exerciseId,
      answers: results.map(r => ({
        questionId: r.questionId,
        userAnswer: r.userAnswer,
        isCorrect: r.isCorrect,
        timeSpent: 0 // TODO: Add individual question timing
      })),
      score,
      totalQuestions: exercise.questions.length,
      correctAnswers: correctCount,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      totalTimeSpent
    });

    await attempt.save();

    res.status(200).json({
      status: 'success',
      data: {
        score,
        correctAnswers: correctCount,
        totalQuestions: exercise.questions.length,
        totalTimeSpent,
        results,
        attemptId: attempt._id
      }
    });
  } catch (error) {
    console.error('Submit answers error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit answers'
    });
  }
};

// Get user's listening exercise history
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const attempts = await ListeningAttempt.find({ userId })
      .populate('exerciseId', 'title topic difficulty')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ListeningAttempt.countDocuments({ userId });

    res.status(200).json({
      status: 'success',
      data: {
        attempts,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get listening history'
    });
  }
};

// Get all exercises (admin only)
exports.getAllExercises = async (req, res) => {
  try {
    const exercises = await ListeningExercise.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        exercises
      }
    });
  } catch (error) {
    console.error('Get all exercises error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get exercises'
    });
  }
};