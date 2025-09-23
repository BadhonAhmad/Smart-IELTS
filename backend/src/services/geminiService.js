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
 * @param {number} wordCount - Approximate word count (default: 500)
 * @returns {Promise<Object>} Generated passage response
 */
async function generatePassage(topic = 'Academic Research', level = 'intermediate') {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create the prompt for passage generation
    const prompt = `Generate a comprehensive academic passage about ${topic} for IELTS reading practice.

    Requirements:
    - Level: ${level}
    - Academic style appropriate for IELTS
    - Include complex sentence structures and academic vocabulary
    - Should be informative and engaging
    - Include different paragraph structures (introduction, body paragraphs, conclusion)
    - Use formal tone suitable for academic reading

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
 * Generate 10 MCQ questions based on a given passage
 * @param {string} passageContent - The passage content
 * @param {string} level - Difficulty level
 * @returns {Promise<Object>} Generated questions response
 */
async function generateQuestionsFromPassage(passageContent, level = 'intermediate') {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Create the prompt for passage-based question generation
    const prompt = `Based on the following passage, generate exactly 5 multiple choice questions for IELTS reading comprehension at ${level} level:

PASSAGE:
${passageContent}

CRITICAL: Return ONLY valid JSON in this EXACT format with NO additional text, explanations, or formatting:

{"questions":[{"questionText":"What is the main purpose of the passage?","options":{"A":"Option A text","B":"Option B text","C":"Option C text","D":"Option D text"},"correctAnswer":"A","explanation":"Brief explanation","difficulty":"medium","questionType":"main_idea"}]}

Requirements:
- Generate exactly 5 questions
- Each question must have exactly 4 options (A, B, C, D)
- Only one correct answer per question
- Use difficulty: easy, medium, hard
- Use question types: detail, main_idea, inference, vocabulary, reference
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

module.exports = {
  generateMCQQuestions,
  generateIELTSQuestions,
  generatePassage,
  generateIELTSPassage,
  generateQuestionsFromPassage,
  generateChatResponse
};
