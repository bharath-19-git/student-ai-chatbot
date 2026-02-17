import { useState } from "react";
import { Lightbulb, Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PuzzleData {
  puzzle: string;
  hint: string;
  solution: string;
  explanation: string;
}

const PuzzleSection = () => {
  const [difficulty, setDifficulty] = useState("easy");
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const generatePuzzle = async () => {
    setIsLoading(true);
    setPuzzle(null);
    setShowHint(false);
    setShowSolution(false);

    try {
      const { data, error } = await supabase.functions.invoke("ai-tutor", {
        body: {
          type: "puzzle",
          puzzleDifficulty: difficulty,
        },
      });

      if (error) throw error;

      // Parse the JSON response
      const content = data.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const puzzleData = JSON.parse(jsonMatch[0]);
        setPuzzle(puzzleData);
      } else {
        throw new Error("Invalid puzzle format");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate puzzle. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="font-display">Generate a Puzzle</CardTitle>
          <CardDescription>
            Challenge yourself with logical and mathematical puzzles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={generatePuzzle}
                disabled={isLoading}
                className="w-full sm:w-auto gap-2 gradient-primary hover:opacity-90"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                {puzzle ? "Next Puzzle" : "Get Puzzle"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && <LoadingSpinner message="Generating puzzle..." />}

      {puzzle && !isLoading && (
        <Card className="shadow-soft animate-fade-in border-accent/20">
          <CardHeader>
            <CardTitle className="font-display text-lg">🧩 Puzzle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed">{puzzle.puzzle}</p>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => setShowHint(!showHint)}
                className="gap-2"
              >
                <Lightbulb className="h-4 w-4 text-accent" />
                {showHint ? "Hide Hint" : "Show Hint"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSolution(!showSolution)}
                className="gap-2"
              >
                <Eye className="h-4 w-4 text-primary" />
                {showSolution ? "Hide Solution" : "Reveal Solution"}
              </Button>
            </div>

            {showHint && (
              <div className="rounded-lg bg-accent/10 p-4 animate-fade-in">
                <p className="font-medium text-accent">💡 Hint</p>
                <p className="mt-1 text-muted-foreground">{puzzle.hint}</p>
              </div>
            )}

            {showSolution && (
              <div className="rounded-lg bg-success/10 p-4 animate-fade-in">
                <p className="font-medium text-success">✅ Solution</p>
                <p className="mt-1 font-semibold">{puzzle.solution}</p>
                <p className="mt-3 font-medium text-foreground">Explanation:</p>
                <p className="mt-1 text-muted-foreground">{puzzle.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PuzzleSection;
