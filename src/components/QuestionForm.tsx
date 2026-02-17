import { Send, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const subjects = [
  { value: "mathematics", label: "Mathematics" },
  { value: "physics", label: "Physics" },
  { value: "chemistry", label: "Chemistry" },
  { value: "computer-science", label: "Computer Science" },
  { value: "biology", label: "Biology" },
  { value: "general-studies", label: "General Studies" },
];

interface QuestionFormProps {
  question: string;
  subject: string;
  level: string;
  isLoading: boolean;
  onQuestionChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onSubmit: () => void;
}

const QuestionForm = ({
  question,
  subject,
  level,
  isLoading,
  onQuestionChange,
  onSubjectChange,
  onLevelChange,
  onSubmit,
}: QuestionFormProps) => {
  return (
    <Card className="shadow-soft border-border/50 animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-display text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <GraduationCap className="h-4 w-4 text-primary" />
          </div>
          What's your question?
        </CardTitle>
        <CardDescription>
          Type or paste your academic question below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="question" className="text-sm font-medium">
            Your Question
          </Label>
          <Textarea
            id="question"
            placeholder="E.g., Explain the Pythagorean theorem with examples..."
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            className="min-h-[120px] resize-none border-border/60 focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Subject</Label>
            <Select value={subject} onValueChange={onSubjectChange}>
              <SelectTrigger className="border-border/60 focus:border-primary/50">
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

          <div className="space-y-2">
            <Label className="text-sm font-medium">Level</Label>
            <Select value={level} onValueChange={onLevelChange}>
              <SelectTrigger className="border-border/60 focus:border-primary/50">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="school">School Level</SelectItem>
                <SelectItem value="college">College Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full gap-2 gradient-primary hover:opacity-90 transition-all duration-200 shadow-glow"
          size="lg"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Getting Answer...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Get Answer
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuestionForm;
