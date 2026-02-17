import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, question, subject, level, simplify, puzzleDifficulty, quizSubject, quizQuestionCount } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "doubt") {
      // Enhanced system prompt for better accuracy
      systemPrompt = `You are an expert AI tutor specializing in academic subjects. Your goal is to provide accurate, clear, and educational answers.

IMPORTANT RULES:
1. Always verify facts before stating them - never guess or make up information
2. Use proper terminology for the subject
3. Break down complex concepts into simple, digestible steps
4. Provide relevant examples when helpful
5. If you're uncertain about something, say so
6. Keep explanations concise but thorough
7. Format your response with clear sections using headings and bullet points
8. For math/science: show formulas in plain text (e.g., "Area = length × width")
9. Always explain WHY something works, not just HOW`;
      
      userPrompt = `Subject: ${subject}
Level: ${level}
Question: ${question}

${simplify ? "IMPORTANT: Explain this in the SIMPLEST possible terms, as if teaching a complete beginner. Use everyday analogies and avoid jargon." : "Provide a clear, accurate explanation with step-by-step breakdown where applicable."}`;
    } else if (type === "puzzle") {
      systemPrompt = `You are a puzzle master creating engaging educational puzzles for students.
Generate a ${puzzleDifficulty} difficulty logical/mathematical/reasoning puzzle.
Format your response as JSON with this exact structure:
{
  "puzzle": "The puzzle question text",
  "hint": "A helpful hint without giving away the answer",
  "solution": "The answer",
  "explanation": "Step-by-step explanation of how to solve it"
}
Make it engaging, educational, and appropriate for students.`;
      
      userPrompt = `Generate a new ${puzzleDifficulty} difficulty puzzle.`;
    } else if (type === "quiz") {
      systemPrompt = `You are an educational quiz creator. Generate engaging multiple-choice questions for students.
Subject: ${quizSubject}
Format your response as JSON with this exact structure:
{
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}
Create ${quizQuestionCount || 5} questions that are educational and progressively challenging.`;
      
      userPrompt = `Generate a ${quizSubject} quiz with ${quizQuestionCount || 5} multiple choice questions.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI tutor error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
