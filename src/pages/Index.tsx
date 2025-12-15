import { useState } from "react";
import Snowfall from "@/components/Snowfall";
import ChristmasLights from "@/components/ChristmasLights";
import EscapeRoom from "@/components/EscapeRoom";
import ProgressTracker from "@/components/ProgressTracker";

const Index = () => {
  const [solvedCount, setSolvedCount] = useState(0);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowfall />
      <ChristmasLights />

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <header className="text-center mb-12 pt-8">
          <h1 className="font-display text-5xl md:text-7xl text-gradient-gold mb-4 animate-pulse-glow inline-block">
            🎄 Developer Escape Room 🎄
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto mb-2">
            Santa's workshop has been locked down!
          </p>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Use your developer skills to find 4 hidden clues and escape before
            Christmas!
          </p>
        </header>

        {/* Progress Tracker */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <span className="text-christmas-gold font-display text-lg">
              Clues Found: {solvedCount}/4
            </span>
          </div>
          <ProgressTracker solved={solvedCount} />
        </div>

        {/* Hints Banner */}
        <div className="bg-card/30 backdrop-blur-sm border border-christmas-green/30 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
          <h2 className="font-display text-christmas-green text-lg mb-2 text-center">
            🔍 Developer Hints
          </h2>
          <ul className="text-sm text-muted-foreground space-y-1 text-center">
            <li>• Right-click → Inspect Element reveals secrets</li>
            <li>
              • Check data attributes, CSS pseudo-elements & the Network tab
            </li>
            <li>• The Console (F12) holds the final piece</li>
          </ul>
        </div>

        {/* Escape Room Challenges */}
        <main>
          <EscapeRoom onProgress={setSolvedCount} solvedCount={solvedCount} />
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 text-muted-foreground">
          <p className="text-sm">
            🎅 Made with ❤️ for developers who love puzzles
          </p>
          <p className="text-xs mt-2 opacity-50">
            Happy Holidays! May your code be bug-free 🐛
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
