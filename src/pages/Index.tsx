import { useState, useCallback } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import QuestionForm from "@/components/QuestionForm";
import AnswerDisplay from "@/components/AnswerDisplay";
import LoadingSpinner from "@/components/LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const FALLBACK_MESSAGE = "I'm having trouble generating an answer right now.\nPlease try rephrasing your question or try again in a moment.";

const Index = () => {
  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState("mathematics");
  const [level, setLevel] = useState("school");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSimplifying, setIsSimplifying] = useState(false);

  const callAI = useCallback(async (): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("ai-tutor", {
      body: {
        type: "doubt",
        question,
        subject,
        level: level === "school" ? "School Level" : "College Level",
      },
    });

    if (error) throw error;
    if (data.error) throw new Error(data.error);
    if (!data.content || data.content.trim() === "") throw new Error("Empty response");
    return data.content;
  }, [question, subject, level]);

  const handleSubmit = useCallback(async () => {
    if (!question.trim()) {
      toast.error("Please enter a question before submitting.");
      return;
    }

    setIsLoading(true);
    setAnswer("");

    let retryCount = 0;
    const maxRetries = 1;

    while (retryCount <= maxRetries) {
      try {
        const content = await callAI();
        setAnswer(content);
        setIsLoading(false);
        return;
      } catch (error) {
        console.error(`Attempt ${retryCount + 1} failed:`, error);
        retryCount++;
        
        if (retryCount > maxRetries) {
          setAnswer(FALLBACK_MESSAGE);
          setIsLoading(false);
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }, [question, callAI]);

  const handleSimplify = useCallback(async () => {
    setIsSimplifying(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-tutor", {
        body: {
          type: "doubt",
          question: `Please simplify this explanation in very simple terms: ${answer}`,
          subject,
          level: "School Level",
          simplify: true,
        },
      });

      if (error) throw error;
      setAnswer(data.content);
      toast.success("Answer simplified!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to simplify. Please try again.");
    } finally {
      setIsSimplifying(false);
    }
  }, [answer, subject]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <HeroSection />

        <div className="mx-auto max-w-3xl">
          <QuestionForm
            question={question}
            subject={subject}
            level={level}
            isLoading={isLoading}
            onQuestionChange={setQuestion}
            onSubjectChange={setSubject}
            onLevelChange={setLevel}
            onSubmit={handleSubmit}
          />

          {isLoading && (
            <div className="mt-8">
              <LoadingSpinner message="Generating your answer..." />
            </div>
          )}

          {answer && !isLoading && (
            <div className="mt-8">
              <AnswerDisplay
                answer={answer}
                onSimplify={handleSimplify}
                isSimplifying={isSimplifying}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
