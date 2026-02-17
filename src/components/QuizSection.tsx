import { useState } from "react";
import { Play, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import LoadingSpinner from "@/components/LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizData {
  questions: QuizQuestion[];
}

const subjects = [
  { value: "mathematics", label: "Mathematics" },
  { value: "science", label: "Science" },
  { value: "computer-basics", label: "Computer Basics" },
  { value: "aptitude", label: "Aptitude" },
];

const QuizSection = () => {
  const [subject, setSubject] = useState("mathematics");
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const startQuiz = async () => {
    setIsLoading(true);
    setQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizCompleted(false);

    try {
      const { data, error } = await supabase.functions.invoke("ai-tutor", {
        body: {
          type: "quiz",
          quizSubject: subject,
          quizQuestionCount: 5,
        },
      });

      if (error) throw error;

      const content = data.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const quizData = JSON.parse(jsonMatch[0]);
        setQuiz(quizData);
      } else {
        throw new Error("Invalid quiz format");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);

    const isCorrect = index === quiz?.questions[currentQuestion].correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setAnswers([...answers, index]);
  };

  const nextQuestion = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const retryQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizCompleted(false);
  };

  const progress = quiz ? ((currentQuestion + (showResult ? 1 : 0)) / quiz.questions.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {!quiz && !isLoading && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display">Start a Quiz</CardTitle>
            <CardDescription>
              Test your knowledge with multiple-choice questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={startQuiz}
              className="w-full gap-2 gradient-primary hover:opacity-90"
            >
              <Play className="h-4 w-4" />
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading && <LoadingSpinner message="Generating quiz..." />}

      {quiz && !isLoading && !quizCompleted && (
        <Card className="shadow-soft animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-lg">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
              </span>
            </div>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-medium">{quiz.questions[currentQuestion].question}</p>

            <div className="space-y-2">
              {quiz.questions[currentQuestion].options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === quiz.questions[currentQuestion].correctIndex;
                const showCorrect = showResult && isCorrect;
                const showWrong = showResult && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={cn(
                      "w-full rounded-lg border p-4 text-left transition-all duration-200",
                      "hover:border-primary hover:bg-primary/5",
                      isSelected && !showResult && "border-primary bg-primary/10",
                      showCorrect && "border-success bg-success/10",
                      showWrong && "border-destructive bg-destructive/10",
                      showResult && !isSelected && !isCorrect && "opacity-50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showCorrect && <CheckCircle className="h-5 w-5 text-success" />}
                      {showWrong && <XCircle className="h-5 w-5 text-destructive" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className="space-y-4 animate-fade-in">
                <div className={cn(
                  "rounded-lg p-4",
                  selectedAnswer === quiz.questions[currentQuestion].correctIndex
                    ? "bg-success/10"
                    : "bg-destructive/10"
                )}>
                  <p className="font-medium">
                    {selectedAnswer === quiz.questions[currentQuestion].correctIndex
                      ? "✅ Correct!"
                      : "❌ Incorrect"}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {quiz.questions[currentQuestion].explanation}
                  </p>
                </div>
                <Button onClick={nextQuestion} className="w-full">
                  {currentQuestion < quiz.questions.length - 1 ? "Next Question" : "See Results"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {quizCompleted && quiz && (
        <Card className="shadow-soft animate-fade-in border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl">Quiz Complete! 🎉</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-full gradient-primary shadow-glow">
              <span className="text-3xl font-bold text-primary-foreground">
                {score}/{quiz.questions.length}
              </span>
            </div>
            <p className="text-lg text-muted-foreground">
              {score === quiz.questions.length
                ? "Perfect score! Excellent work! 🌟"
                : score >= quiz.questions.length / 2
                ? "Good job! Keep practicing! 💪"
                : "Keep learning! You'll do better next time! 📚"}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={retryQuiz} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Retry Quiz
              </Button>
              <Button onClick={startQuiz} className="gap-2 gradient-primary hover:opacity-90">
                <Play className="h-4 w-4" />
                New Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizSection;
