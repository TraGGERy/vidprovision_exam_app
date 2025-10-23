import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { 
      question, 
      options, 
      correctAnswer, 
      userAnswer, 
      isCorrect, 
      characterStyle,
      showDetailedExplanations = false,
      focusOnZimbabweLaws = false
    } = await request.json();

    // Validate required fields
    if (!question || !options || !correctAnswer || userAnswer === undefined || isCorrect === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Character styles and their prompting approaches
    const characterPrompts = {
      academic: 'You are a knowledgeable driving instructor with an academic approach. Use formal language and provide detailed explanations with references to driving regulations.',
      enthusiastic: 'You are an enthusiastic driving coach who uses encouraging language. Be energetic, use exclamations, and motivate the student while explaining concepts clearly.',
      cautious: 'You are a safety-focused driving instructor. Emphasize caution, defensive driving techniques, and potential hazards in every explanation.',
      technical: 'You are a technically-minded driving expert. Include specific details about vehicle operation, road mechanics, and the physics of driving in your explanations.'
    };

    // Select the appropriate character style or default to academic
    const characterPrompt = characterPrompts[characterStyle as keyof typeof characterPrompts] || characterPrompts.academic;

    // Create the system message
    let systemMessage = `${characterPrompt}\n\n`;
    
    // Add Zimbabwe-specific context if requested
    if (focusOnZimbabweLaws) {
      systemMessage += `You are helping a student prepare for their Zimbabwe driving license exam. Zimbabwe driving laws are similar to British driving regulations with some local adaptations. Include specific references to Zimbabwe driving regulations where applicable.\n\n`;
    } else {
      systemMessage += `You are helping a student prepare for their driving license exam.\n\n`;
    }
    
    // Adjust response length based on detailed explanations setting
    if (showDetailedExplanations) {
      systemMessage += `Provide a comprehensive explanation (5-8 sentences) that covers the rule in detail, its safety implications, and practical application.\n\n`;
    } else {
      systemMessage += `Respond in a concise, helpful manner (maximum 3-4 sentences).\n\n`;
    }
    
    systemMessage += `${isCorrect ? 'The student answered correctly, but still needs to understand WHY this is the correct answer.' : 'The student answered incorrectly. Explain why their answer was wrong and why the correct answer is important.'}`;

    // Create the user message with question details
    const userMessage = `Question: ${question}
Options: ${options.join(', ')}
Correct answer: ${correctAnswer}
Student's answer: ${userAnswer}

Please provide a helpful explanation about this driving rule or situation.`;

    // Initialize OpenAI client
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY not configured' },
        { status: 500 }
      );
    }
    const openai = new OpenAI({ apiKey });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      max_tokens: showDetailedExplanations ? 300 : 150, // More tokens for detailed explanations
      temperature: 0.7,
    });

    // Extract and return the generated advice
    const advice = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate advice for this question.";
    
    return NextResponse.json({ advice });
  } catch (error) {
    console.error('Error generating advice:', error);
    return NextResponse.json(
      { error: 'Failed to generate advice' },
      { status: 500 }
    );
  }
}