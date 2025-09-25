const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the AI client with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate MCQ questions using Gemini AI
 * @param {string} topic - The topic for which to generate questions
 * @param {number} count - Number of questions to generate (default: 5)
 * @returns {Promise<Array>} Array of MCQ objects
 */
async function generateMCQQuestions(topic = 'General Knowledge', count = 5) {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create the prompt for MCQ generation
    const prompt = `Generate ${count} multiple choice questions about ${topic} for IELTS preparation. 
    
    Return the response in this exact JSON format:
    {
      "questions": [
        {
          "id": 1,
          "question": "Question text here?",
          "options": [
            "Option A",
            "Option B", 
            "Option C",
            "Option D"
          ],
          "correctAnswer": "Option A",
          "explanation": "Brief explanation of why this is correct"
        }
      ]
    }
    
    Make sure:
    - Questions are relevant to IELTS level English
    - All 4 options are plausible
    - Only one correct answer
    - Include brief explanations
    - Use proper JSON format
    - Questions should test comprehension, vocabulary, or grammar`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and parse the JSON response
    let cleanedText = text.trim();
    
    // Remove markdown code blocks if present
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n/, '').replace(/\n```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n/, '').replace(/\n```$/, '');
    }

    // Parse JSON
    const parsedResponse = JSON.parse(cleanedText);
    
    return {
      success: true,
      data: parsedResponse.questions || [],
      count: parsedResponse.questions?.length || 0
    };
  } catch (error) {
    console.error('Error generating MCQ questions:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
}

/**
 * Generate questions for specific IELTS skills
 * @param {string} skill - IELTS skill (listening, reading, writing, speaking)
 * @param {number} count - Number of questions
 * @returns {Promise<Object>} Generated questions response
 */
async function generateIELTSQuestions(skill = 'reading', count = 5) {
  const skillTopics = {
    listening: 'IELTS Listening',
    reading: 'IELTS Reading',
    writing: 'IELTS Writing',
    speaking: 'IELTS Speaking'
  };

  const topic = skillTopics[skill.toLowerCase()] || skillTopics.reading;
  return await generateMCQQuestions(topic, count);
}

/**
 * Generate a large passage for IELTS reading practice
 * @param {string} topic - The topic for the passage
 * @param {string} level - Difficulty level (beginner, intermediate, advanced)
 * @param {number} wordCount - Approximate word count (default: 750)
 * @returns {Promise<Object>} Generated passage response
 */
async function generatePassage(topic = 'Academic Research', level = 'intermediate', wordCount = 750) {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create the prompt for passage generation
    const prompt = `Generate a comprehensive academic passage about ${topic} for IELTS reading practice.

    Requirements:
    - Level: ${level}
    - Word count: Approximately ${wordCount} words (700-800 words)
    - Academic style appropriate for IELTS
    - Include complex sentence structures and academic vocabulary
    - Should be informative and engaging
    - Include different paragraph structures (introduction, body paragraphs, conclusion)
    - Use formal tone suitable for academic reading
    - Include specific details, statistics, examples, and data that can form the basis for 12-14 questions

    The passage should be suitable for creating multiple choice questions later.

    Return the response in this exact JSON format:
    {
      "passage": {
        "title": "Passage Title Here",
        "content": "The full passage text here...",
        "level": "${level}",
        "topic": "${topic}",
        "summary": "Brief summary of the passage content"
      }
    }

    Make sure:
    - The passage is well-structured with clear paragraphs
    - Uses appropriate academic vocabulary for ${level} level
    - Contains factual information that can be questioned
    - Has a logical flow of ideas
    - Includes specific details, statistics, or examples that can form basis for questions`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and parse the JSON response
    let cleanedText = text.trim();
    
    // Remove markdown code blocks if present
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n/, '').replace(/\n```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n/, '').replace(/\n```$/, '');
    }

    // Parse JSON
    const parsedResponse = JSON.parse(cleanedText);
    
    return {
      success: true,
      data: parsedResponse.passage || {},
      metadata: {
        generatedAt: new Date().toISOString(),
        actualWordCount: parsedResponse.passage?.content?.split(' ').length || 0
      }
    };
  } catch (error) {
    console.error('Error generating passage:', error);
    return {
      success: false,
      error: error.message,
      data: {}
    };
  }
}

/**
 * Generate passage for specific IELTS reading themes
 * @param {string} theme - IELTS reading theme
 * @param {string} level - Difficulty level
 * @param {number} wordCount - Word count
 * @returns {Promise<Object>} Generated passage response
 */
async function generateIELTSPassage(theme = 'science', level = 'intermediate') {
  const themes = {
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

  const topicDescription = themes[theme.toLowerCase()] || themes.science;
  return await generatePassage(topicDescription, level);
}

/**
 * Generate 12-14 MCQ questions based on a given passage
 * @param {string} passageContent - The passage content
 * @param {string} level - Difficulty level
 * @param {number} questionCount - Number of questions to generate (default: 13)
 * @returns {Promise<Object>} Generated questions response
 */
async function generateQuestionsFromPassage(passageContent, level = 'intermediate', questionCount = 13) {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Create the prompt for passage-based question generation
    const prompt = `Based on the following passage, generate exactly ${questionCount} multiple choice questions for IELTS reading comprehension at ${level} level:

PASSAGE:
${passageContent}

CRITICAL: Return ONLY valid JSON in this EXACT format with NO additional text, explanations, or formatting:

{"questions":[{"questionText":"What is the main purpose of the passage?","options":{"A":"Option A text","B":"Option B text","C":"Option C text","D":"Option D text"},"correctAnswer":"A","explanation":"Brief explanation","difficulty":"medium","questionType":"main_idea"}]}

Requirements:
- Generate exactly ${questionCount} questions
- Each question must have exactly 4 options (A, B, C, D)
- Only one correct answer per question
- Use difficulty: easy, medium, hard
- Use question types: detail, main_idea, inference, vocabulary, reference
- Cover different parts of the passage (beginning, middle, end)
- Include questions about specific details, main ideas, inferences, and vocabulary
- Return ONLY the JSON object, no other text`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and parse the JSON response
    let cleanedText = text.trim();
    
    // Remove markdown code blocks if present
    cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/\n?```/g, '');
    
    // Extract JSON part
    const jsonStart = cleanedText.indexOf('{');
    const jsonEnd = cleanedText.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('No valid JSON found in response');
    }
    
    cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);

    // Additional JSON cleaning to fix common issues
    cleanedText = cleanedText
      .replace(/,\s*}/g, '}') // Remove trailing commas before closing braces
      .replace(/,\s*]/g, ']') // Remove trailing commas before closing brackets
      .replace(/(\w+):\s*"([^"]*)"\s*,?\s*}/g, '$1: "$2"}') // Fix malformed object endings
      .replace(/"\s*,?\s*}/g, '"}') // Fix quotes before closing braces
      .replace(/"\s*,?\s*]/g, '"]') // Fix quotes before closing brackets
      .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
      .replace(/"\s*,\s*"([A-D])":/g, '", "$1":') // Fix malformed option separators
      .replace(/"\s*,\s*"correctAnswer":/g, '", "correctAnswer":') // Fix before correctAnswer
      .replace(/"\s*,\s*"explanation":/g, '", "explanation":') // Fix before explanation
      .replace(/"\s*,\s*"difficulty":/g, '", "difficulty":') // Fix before difficulty
      .replace(/"\s*,\s*"questionType":/g, '", "questionType":') // Fix before questionType
      .replace(/"\s*,\s*"questionNumber":/g, '", "questionNumber":') // Fix before questionNumber
      .replace(/"\s*,\s*"passageNumber":/g, '", "passageNumber":'); // Fix before passageNumber

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError.message);
      console.error('Raw response:', text.substring(0, 500) + '...');
      console.error('Cleaned text:', cleanedText.substring(0, 500) + '...');
      
      // Try to fix common JSON issues
      try {
        // Attempt to fix common JSON syntax errors
        const fixedJson = cleanedText
          .replace(/"\s*,\s*"([A-D])":/g, '", "$1":') // Fix malformed option separators
          .replace(/"\s*,\s*"correctAnswer":/g, '", "correctAnswer":') // Fix before correctAnswer
          .replace(/"\s*,\s*"explanation":/g, '", "explanation":') // Fix before explanation
          .replace(/"\s*,\s*"difficulty":/g, '", "difficulty":') // Fix before difficulty
          .replace(/"\s*,\s*"questionType":/g, '", "questionType":') // Fix before questionType
          .replace(/"\s*,\s*"questionNumber":/g, '", "questionNumber":') // Fix before questionNumber
          .replace(/"\s*,\s*"passageNumber":/g, '", "passageNumber":') // Fix before passageNumber
          .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
        
        parsedResponse = JSON.parse(fixedJson);
        console.log('Successfully parsed after fixing JSON syntax');
      } catch (secondError) {
        throw new Error(`JSON parsing failed: ${parseError.message}`);
      }
    }
    
    // Validate that we have questions
    if (!parsedResponse.questions || parsedResponse.questions.length === 0) {
      throw new Error('No questions generated');
    }

    return {
      success: true,
      data: parsedResponse.questions,
      count: parsedResponse.questions.length
    };
  } catch (error) {
    console.error('Error generating questions from passage:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
}

/**
 * Generate fill-in-the-blank questions based on a given passage
 * @param {string} passageContent - The passage content
 * @param {number} count - Number of fill-blank questions to generate
 * @returns {Promise<Object>} Generated fill-blank questions response
 */
async function generateFillBlankQuestions(passageContent, count = 2) {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create the prompt for fill-blank question generation
    const prompt = `Based on the following passage, generate exactly ${count} fill-in-the-blank questions for IELTS reading comprehension:

PASSAGE:
${passageContent}

CRITICAL: Return ONLY valid JSON in this EXACT format with NO additional text, explanations, or formatting:

{"questions":[{"id":1,"text":"The passage states that green infrastructure helps mitigate heat absorption while providing natural cooling through _____.","blanks":[{"position":0,"correctAnswer":"evapotranspiration","explanation":"Brief explanation of the answer"}]}]}

Requirements:
- Generate exactly ${count} fill-in-the-blank questions
- Each question should have 1-2 blanks (represented by _____)
- Blanks should test key vocabulary, concepts, or factual information from the passage
- Provide position index for each blank (starting from 0)
- Include brief explanations for each correct answer
- Use information directly from the passage
- Return ONLY the JSON object, no other text`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and parse the JSON response
    let cleanedText = text.trim();
    
    // Remove markdown code blocks if present
    cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/\n?```/g, '');
    
    // Extract JSON part
    const jsonStart = cleanedText.indexOf('{');
    const jsonEnd = cleanedText.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('No valid JSON found in response');
    }
    
    cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError.message);
      console.error('Raw response:', text.substring(0, 500) + '...');
      console.error('Cleaned text:', cleanedText.substring(0, 500) + '...');
      throw new Error(`JSON parsing failed: ${parseError.message}`);
    }
    
    // Validate that we have questions
    if (!parsedResponse.questions || parsedResponse.questions.length === 0) {
      throw new Error('No fill-blank questions generated');
    }

    return {
      success: true,
      data: parsedResponse.questions,
      count: parsedResponse.questions.length
    };
  } catch (error) {
    console.error('Error generating fill-blank questions:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
}

/**
 * Analyze handwritten writing answer from image and provide IELTS scoring
 * @param {Buffer} imageBuffer - The image buffer
 * @param {Object} question - The writing question details
 * @returns {Promise<Object>} Analysis response with scores and feedback
 */
async function analyzeWritingImage(imageBuffer, question) {
  try {
    // Get the generative model that supports vision
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');

    // Create the analysis prompt
    const prompt = `You are an expert IELTS examiner analyzing a handwritten writing answer. 

WRITING TASK DETAILS:
Type: ${question.type}
Title: ${question.title}
Description: ${question.description}
Instructions: ${question.instructions ? question.instructions.join(', ') : 'N/A'}
Time Limit: ${question.timeLimit || 'N/A'}
Word Count Requirement: ${question.wordCount || 'N/A'}

Please analyze this handwritten answer image and provide a comprehensive IELTS writing evaluation.

CRITICAL: Return ONLY valid JSON in this EXACT format with NO additional text:

{
  "extractedText": "The full text extracted from the handwriting",
  "wordCount": 250,
  "scores": {
    "overallScore": 6.5,
    "taskAchievement": 7.0,
    "coherenceCohesion": 6.5,
    "lexicalResource": 6.0,
    "grammaticalRange": 6.5
  },
  "analysis": {
    "taskResponse": "Detailed analysis of how well the task was addressed",
    "organization": "Analysis of coherence and cohesion",
    "vocabulary": "Analysis of lexical resource usage",
    "grammar": "Analysis of grammatical range and accuracy"
  },
  "errors": {
    "spelling": [
      {"word": "govenment", "correction": "government", "position": 45},
      {"word": "necesary", "correction": "necessary", "position": 120}
    ],
    "grammar": [
      {"error": "is necesary", "correction": "is necessary", "explanation": "Spelling error in adjective", "position": 115}
    ]
  },
  "feedback": "Overall examiner feedback with specific suggestions for improvement",
  "bandDescriptors": {
    "taskAchievement": "Addresses the task with relevant ideas but may lack development",
    "coherenceCohesion": "Generally well organized with clear progression",
    "lexicalResource": "Adequate range of vocabulary with some inaccuracies",
    "grammaticalRange": "Mix of simple and complex sentences with some errors"
  }
}

Requirements:
- Extract ALL readable text from the handwriting accurately
- Provide IELTS band scores (1-9 scale, with 0.5 increments)
- Calculate overall score as average of the 4 criteria
- Identify spelling and grammar errors with positions
- Give constructive feedback focusing on IELTS criteria
- Analyze according to IELTS Task ${question.type === 'essay' ? '2' : '1'} requirements
- Consider word count requirements in scoring
- Return ONLY the JSON object`;

    // Prepare the image data
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: 'image/jpeg'
      }
    };

    // Generate content with image and prompt
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean and parse the JSON response
    let cleanedText = text.trim();
    
    // Remove markdown code blocks if present
    cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/\n?```/g, '');
    
    // Extract JSON part
    const jsonStart = cleanedText.indexOf('{');
    const jsonEnd = cleanedText.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('No valid JSON found in response');
    }
    
    cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError.message);
      console.error('Raw response:', text.substring(0, 500) + '...');
      throw new Error(`JSON parsing failed: ${parseError.message}`);
    }

    // Validate required fields
    if (!parsedResponse.extractedText || !parsedResponse.scores) {
      throw new Error('Invalid response format - missing required fields');
    }

    return {
      success: true,
      data: parsedResponse
    };
  } catch (error) {
    console.error('Error analyzing writing image:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
}

/**
 * Generate chat response using Gemini AI for IELTS assistance
 * @param {string} message - User's message/question
 * @returns {Promise<Object>} Response object with success status and data
 */
async function generateChatResponse(message) {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create the system prompt for IELTS assistance
    const systemPrompt = `You are an expert IELTS tutor and study assistant. Your role is to help students with:
    - IELTS test preparation and strategies
    - Study materials and practice questions
    - Exam tips and time management
    - English language skills improvement
    - Answering questions about IELTS format and requirements
    - Providing motivation and study guidance
    
    Be helpful, encouraging, and provide clear, concise answers. Focus on IELTS-specific advice.
    Keep responses under 200 words for better readability in a chat interface.
    
    User's question: ${message}`;

    // Generate content
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response
    const cleanedResponse = text.trim();

    return {
      success: true,
      data: cleanedResponse
    };
  } catch (error) {
    console.error('Error generating chat response:', error);
    return {
      success: false,
      error: error.message,
      data: 'I\'m sorry, I\'m having trouble responding right now. Please try again.'
    };
  }
}

/**
 * Generate a complete 3-passage IELTS reading test
 * @param {string} level - Difficulty level (intermediate, advanced)
 * @returns {Promise<Object>} Generated reading test response
 */
async function generateCompleteReadingTest(level = 'intermediate') {
  try {
    const themes = ['science', 'environment', 'education', 'culture', 'business', 'health', 'technology', 'history', 'society', 'arts'];
    const selectedThemes = themes.sort(() => 0.5 - Math.random()).slice(0, 3); // Randomly select 3 themes
    
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

    const passages = [];
    const allQuestions = [];
    const questionsByPassage = { passage1: [], passage2: [], passage3: [] };
    let questionNumber = 1;

    // Generate 3 passages with 12-14 questions each
    for (let i = 0; i < 3; i++) {
      const theme = selectedThemes[i];
      const passageTitle = `${theme.charAt(0).toUpperCase() + theme.slice(1)} Reading Passage ${i + 1}`;
      
      console.log(`Generating passage ${i + 1} for theme: ${theme}`);
      
      // Generate passage (700-800 words)
      const passageResult = await generatePassage(themeDescriptions[theme], level, 750);
      
      if (!passageResult.success) {
        throw new Error(`Failed to generate passage ${i + 1}: ${passageResult.error}`);
      }

      // Generate 12-14 questions for this passage
      const questionCount = 12 + Math.floor(Math.random() * 3); // 12-14 questions
      const questionsResult = await generateQuestionsFromPassage(passageResult.data.content, level, questionCount);
      
      if (!questionsResult.success) {
        throw new Error(`Failed to generate questions for passage ${i + 1}: ${questionsResult.error}`);
      }

      // Create passage object
      const passage = {
        title: passageTitle,
        content: passageResult.data.content,
        wordCount: passageResult.data.content.split(/\s+/).length,
        readingTime: Math.ceil(passageResult.data.content.split(/\s+/).length / 200),
        summary: passageResult.data.summary || `A comprehensive passage about ${theme}`,
        passageNumber: i + 1
      };

      // Process questions and assign question numbers
      const passageQuestions = questionsResult.data.map((q, index) => {
        const questionNumber = allQuestions.length + index + 1;
        questionsByPassage[`passage${i + 1}`].push(questionNumber);
        
        return {
          questionNumber: questionNumber,
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
          questionType: q.questionType || 'detail',
          passageNumber: i + 1
        };
      });

      passages.push(passage);
      allQuestions.push(...passageQuestions);
    }

    return {
      success: true,
      data: {
        passages,
        questions: allQuestions,
        questionsByPassage,
        metadata: {
          totalQuestions: allQuestions.length,
          totalPassages: 3,
          level,
          themes: selectedThemes
        }
      }
    };
  } catch (error) {
    console.error('Error generating complete reading test:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
}

/**
 * Generate a single passage and questions for a specific round
 * @param {number} roundNumber - Round number (1, 2, or 3)
 * @param {string} level - Difficulty level (intermediate, advanced)
 * @returns {Promise<Object>} Generated round response
 */
async function generateSinglePassageRound(roundNumber, level = 'intermediate') {
  try {
    const themes = ['science', 'environment', 'education', 'culture', 'business', 'health', 'technology', 'history', 'society', 'arts'];
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    
    const themeDescriptions = {
      science: 'Scientific discoveries and technological innovations',
      environment: 'Environmental issues and climate change',
      education: 'Educational systems and learning methodologies',
      culture: 'Cultural practices and social traditions',
      business: 'Economic systems and business practices',
      health: 'Medical research and healthcare systems',
      technology: 'Digital technology and artificial intelligence',
      history: 'Historical events and their impact',
      society: 'Social issues and community development',
      arts: 'Artistic movements and creative expression'
    };

    console.log(`Generating passage ${roundNumber} for theme: ${selectedTheme}`);
    
    // Generate passage (700-800 words, but flexible)
    const passageResult = await generatePassage(themeDescriptions[selectedTheme], level, 750);
    
    if (!passageResult.success) {
      throw new Error(`Failed to generate passage: ${passageResult.error}`);
    }

    // Generate 12-14 questions for this passage
    const questionCount = 12 + Math.floor(Math.random() * 3); // 12-14 questions
    const questionsResult = await generateQuestionsFromPassage(passageResult.data.content, level, questionCount);
    
    if (!questionsResult.success) {
      throw new Error(`Failed to generate questions: ${questionsResult.error}`);
    }

    // Add passage number to questions
    const questionsWithPassageNumber = questionsResult.data.map((question, index) => ({
      ...question,
      questionNumber: index + 1,
      passageNumber: roundNumber
    }));

    return {
      success: true,
      data: {
        passage: {
          title: passageResult.data.title,
          content: passageResult.data.content,
          wordCount: passageResult.data.wordCount,
          readingTime: Math.ceil(passageResult.data.wordCount / 200),
          summary: passageResult.data.summary,
          passageNumber: roundNumber
        },
        questions: questionsWithPassageNumber,
        metadata: {
          theme: selectedTheme,
          level: level,
          roundNumber: roundNumber,
          questionCount: questionsWithPassageNumber.length
        }
      }
    };

  } catch (error) {
    console.error(`Error generating round ${roundNumber}:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  generateMCQQuestions,
  generateIELTSQuestions,
  generatePassage,
  generateIELTSPassage,
  generateQuestionsFromPassage,
  generateFillBlankQuestions,
  generateChatResponse,
  analyzeWritingImage,
  generateCompleteReadingTest,
  generateSinglePassageRound
};
