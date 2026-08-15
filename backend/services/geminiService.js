const {GoogleGenAI} = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey : process.env.GEMINI_API_KEY
});

const cleanJSON = (text) => {
    return text.replace(/'''json/g, "").replace(/'''/g, "").trim();
}

const generateQuestion = async (interview) => {
try{
  const prompt = `You are an expert technical interviewer.

Generate ${interview.questionCount} interview questions based on the following details.

Interview Details:

Role: ${interview.role}

Experience: ${interview.experience}

Technologies: ${interview.technologies.join(", ")}

Difficulty: ${interview.difficulty}

Description: ${interview.description}

Instructions:

1. Generate exactly ${interview.questionCount} questions.
2. Questions should gradually increase in difficulty.
3. Questions must be relevant to the role and technologies.
4. Do not repeat questions.
5. Each question must include:
   - question
   - expectedAnswer
   - technology
   - difficulty
6. Return ONLY a valid JSON array.
7. Do NOT add explanations.
8. Do NOT wrap the response inside markdown or \`\`\`.

Example Response:

[
  {
    "question": "What is React?",
    "expectedAnswer": "React is a JavaScript library used to build user interfaces.",
    "technology": "React",
    "difficulty": "Easy"
  },
  {
    "question": "Explain the Virtual DOM.",
    "expectedAnswer": "The Virtual DOM is a lightweight copy of the real DOM used by React to efficiently update the UI.",
    "technology": "React",
    "difficulty": "Medium"
  }
]
`;

        const response = await ai.models.generateContent({
            model : "gemini-3.6-flash",
            contents : prompt
        });

        const question = JSON.parse(cleanJSON(response.text))
        return question; 
}catch(err){
    throw err
}
}

const evaluateInterview = async (questions) => {
  try{
    const prompt = `
    You are an expert technical interviewer.

Evaluate the candidate's complete technical interview based on the questions, expected answers, and candidate answers provided below.

IMPORTANT:
- Evaluate every question individually.
- Compare the candidate's answer with the expected answer.
- Consider technical correctness, completeness, communication, and confidence.
- Do not give credit for an answer that is technically incorrect just because it sounds confident.
- If the candidate did not answer a question, give appropriate low scores.
- Be fair and consistent.
- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT wrap the response in \`\`\`.
- Do NOT add explanations outside the JSON.

SCORING:

technicalScore:
0 = completely incorrect or no relevant knowledge
1-3 = very poor understanding
4-5 = partial/basic understanding
6-7 = good understanding with minor issues
8-9 = very good and mostly complete
10 = excellent, accurate, and complete

communicationScore:
0 = no meaningful answer
1-3 = very unclear
4-5 = understandable but poorly explained
6-7 = clear explanation
8-9 = very clear and well structured
10 = exceptionally clear and well structured

confidenceScore:
0 = no answer
1-3 = very uncertain
4-5 = somewhat uncertain
6-7 = reasonably confident
8-9 = confident
10 = very confident and precise

overallScore:
Give an overall score from 0 to 10 based on the quality of the candidate's answer.

accuracy:
Give the overall interview accuracy as a number from 0 to 100.

Interview Questions:

${questions.map((q, index) => `
Question ${index + 1}

Order:
${q.order}

Question:
${q.question}

Expected Answer:
${q.expectedAnswer || "No expected answer provided"}

Candidate Answer:
${q.userAnswer || "No answer provided"}
`).join("\n")}

Return ONLY JSON in exactly this structure:

{
    "overallScore": 0,
    "accuracy": 0,
    "overallFeedback": "",
    "strengths": [],
    "weaknesses": [],
    "questions": [
        {
            "order": 1,
            "technicalScore": 0,
            "communicationScore": 0,
            "confidenceScore": 0,
            "overallScore": 0,
            "feedback": "",
            "strength": "",
            "improvements": ""
        }
    ]
}

Rules for the JSON:
1. "overallScore" must be a number from 0 to 10.
2. "accuracy" must be a number from 0 to 100.
3. "overallFeedback" must contain useful feedback about the complete interview.
4. "strengths" must be an array of strings.
5. "weaknesses" must be an array of strings.
6. "questions" must contain exactly one object for every interview question.
7. Each question object must use the original question's "order".
8. "technicalScore" must be from 0 to 10.
9. "communicationScore" must be from 0 to 10.
10. "confidenceScore" must be from 0 to 10.
11. Each question's "overallScore" must be from 0 to 10.
12. "feedback" must explain how good or poor the candidate's answer was.
13. "strength" must describe something the candidate did well. If there is no meaningful strength, use an appropriate short statement.
14. "improvements" must explain what the candidate should improve.
15. Do not skip any question.
16. Do not create extra questions.
17. Do not change the question order.
18. Return valid JSON only.
`;
    const response = await ai.models.generateContent({
      model : "gemini-3.6-flash",
      contents : prompt
    });
    const result = JSON.parse(cleanJSON(response.text));
    return result;

  }catch(err){
    throw err
  }
}

module.exports = {generateQuestion, evaluateInterview}
