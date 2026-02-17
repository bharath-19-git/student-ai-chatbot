import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import PuzzleSection from "@/components/PuzzleSection";
import QuizSection from "@/components/QuizSection";
import { Puzzle, Brain } from "lucide-react";

const PuzzlesQuizzes = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            <Brain className="h-4 w-4" />
            Brain Training
          </div>
          <h1 className="mb-3 font-display text-4xl font-bold text-foreground md:text-5xl">
            Puzzles & Quizzes
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Challenge yourself with logical puzzles and test your knowledge with fun quizzes. 
            Learn while you play!
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="puzzles" className="mx-auto max-w-3xl">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="puzzles" className="gap-2">
              <Puzzle className="h-4 w-4" />
              Puzzles
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="gap-2">
              <Brain className="h-4 w-4" />
              Quizzes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="puzzles" className="animate-fade-in">
            <PuzzleSection />
          </TabsContent>
          
          <TabsContent value="quizzes" className="animate-fade-in">
            <QuizSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PuzzlesQuizzes;
