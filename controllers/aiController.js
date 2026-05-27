import { GoogleGenerativeAI } from '@google/generative-ai';

export const generateWellnessPlan = async (req, res) => {
  try {
    const { age, medicalHistory, currentProblems, lifestyle } = req.body;

    // 1. Validation Guard
    if (!age || !medicalHistory || !currentProblems) {
      return res.status(400).json({ success: false, message: "Missing required profile data metrics." });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ ERROR: GEMINI_API_KEY is not defined in your backend .env file!");
      return res.status(500).json({ success: false, message: "AI Configuration missing on server." });
    }

    // 2. Initialize the Gemini Engine
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // 3. Get modern model with NATIVE JSON CONFIGURATION 🧠
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", // 👈 FIXED: Upgraded from deprecated 1.5 to stable 2.5
      generationConfig: {
        responseMimeType: "application/json" 
      }
    });

    // 4. Construct the layout prompt
    const prompt = `
      You are an expert digital geriatric healthcare assistant and longevity coach specialized in senior citizens for the application 'SehatSetu'.
      Analyze the following senior user profile metrics:
      - Age: ${age} years old
      - Past Medical History/Chronic Conditions: ${medicalHistory}
      - Current Health Symptoms/Complaints: ${currentProblems}
      - Lifestyle/Daily Physical Activity Level: ${lifestyle || 'Sedentary'}

      Based on this context, generate a highly custom, actionable, and safe wellness framework.
      Return a JSON object that matches this schema structure perfectly:
      {
        "dietaryAdvice": ["tip 1", "tip 2"],
        "recommendedExercises": ["exercise 1", "exercise 2"],
        "precautions": ["warning 1", "warning 2"],
        "dailyRoutineTip": "A concise concluding motivational lifestyle advice string."
      }
    `;

    // 5. Fire request and parse text safely
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const structuredPlan = JSON.parse(responseText);

    return res.status(200).json({
      success: true,
      data: structuredPlan
    });

  } catch (error) {
    console.error("🔥 GenAI Endpoint Crash:", error);
    return res.status(500).json({
      success: false,
      message: "Server encountered an error processing AI wellness matrix.",
      error: error.message
    });
  }
};