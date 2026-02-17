import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface AnswerDisplayProps {
  answer: string;
  onSimplify: () => void;
  isSimplifying: boolean;
}

const AnswerDisplay = ({ answer, onSimplify, isSimplifying }: AnswerDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(answer);
    setCopied(true);
    toast.success("Answer copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="animate-fade-in border-primary/20 shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <Sparkles className="h-5 w-5 text-accent" />
          Answer
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSimplify}
            disabled={isSimplifying}
            className="gap-2"
          >
            {isSimplifying ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Simplifying...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Simplify
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-success" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-ul:text-foreground/90 prose-ol:text-foreground/90">
          <ReactMarkdown>{answer}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnswerDisplay;
