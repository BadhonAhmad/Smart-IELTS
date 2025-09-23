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
    listening: 'IELTS Listening comprehension with audio scenarios, conversations, and academic lectures',
    reading: 'IELTS Reading comprehension with academic texts, articles, and passage analysis',
    writing: 'IELTS Writing skills including task response, coherence, lexical resource, and grammatical accuracy',
    speaking: 'IELTS Speaking skills including fluency, pronunciation, vocabulary, and grammar'
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
async function generatePassage(topic = 'Academic Research', level = 'intermediate', wordCount = 500) {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create the prompt for passage generation
    const prompt = `Generate a comprehensive academic passage about ${topic} for IELTS reading practice.

    Requirements:
    - Level: ${level}
    - Word count: approximately ${wordCount} words
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
        "wordCount": ${wordCount},
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
        requestedWordCount: wordCount,
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
async function generateIELTSPassage(theme = 'science', level = 'intermediate', wordCount = 500) {
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
  return await generatePassage(topicDescription, level, wordCount);
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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create the prompt for passage-based question generation
    const prompt = `Based on the following passage, generate exactly 10 multiple choice questions for IELTS reading comprehension at ${level} level:

PASSAGE:
${passageContent}

Generate questions that test:
- 3 detail questions (specific information from the text)
- 2 main idea questions (overall understanding)
- 2 inference questions (reading between the lines)
- 2 vocabulary questions (word meaning in context)
- 1 reference question (what pronouns/words refer to)

Return the response in this exact JSON format:
{
  "questions": [
    {
      "questionText": "What is the main purpose of the passage?",
      "options": {
        "A": "Option A text",
        "B": "Option B text",
        "C": "Option C text",
        "D": "Option D text"
      },
      "correctAnswer": "A",
      "explanation": "Brief explanation of why this is correct",
      "difficulty": "medium",
      "questionType": "main_idea"
    }
  ]
}

IMPORTANT:
- Generate exactly 10 questions
- Each question must have exactly 4 options (A, B, C, D)
- Only one correct answer per question
- Include brief explanations
- Use appropriate difficulty: easy, medium, hard
- Use question types: detail, main_idea, inference, vocabulary, reference
- Make sure all questions are answerable from the passage
- Ensure proper JSON format`;

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
    
    // Validate that we have exactly 10 questions
    if (!parsedResponse.questions || parsedResponse.questions.length !== 10) {
      throw new Error(`Expected 10 questions, got ${parsedResponse.questions?.length || 0}`);
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

module.exports = {
  generateMCQQuestions,
  generateIELTSQuestions,
  generatePassage,
  generateIELTSPassage,
  generateQuestionsFromPassage
};
