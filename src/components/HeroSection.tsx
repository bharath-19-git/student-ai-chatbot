import { BookOpen, Sparkles, Brain } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="mb-8 text-center animate-fade-in">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20">
        <Sparkles className="h-4 w-4" />
        AI-Powered Learning
      </div>
      <h1 className="mb-3 font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
        Ask Any Academic{" "}
        <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
          Doubt
        </span>
      </h1>
      <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
        Get clear, step-by-step explanations for your study questions. 
        Your personal AI tutor is here to help you understand any concept.
      </p>
      
      {/* Feature pills */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-xs font-medium text-success border border-success/20">
          <Brain className="h-3.5 w-3.5" />
          Accurate Answers
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-info/10 px-3 py-1.5 text-xs font-medium text-info border border-info/20">
          <BookOpen className="h-3.5 w-3.5" />
          Step-by-Step
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1.5 text-xs font-medium text-warning border border-warning/20">
          <Sparkles className="h-3.5 w-3.5" />
          Easy to Understand
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
