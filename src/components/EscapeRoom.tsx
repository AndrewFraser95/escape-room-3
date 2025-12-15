import { useState, useEffect, useRef } from "react";
import { Star, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import SlidePuzzle from "./puzzles/SlidePuzzle";
import MovieTitlePuzzle from "./puzzles/MovieTitlePuzzle";
import SpotDifferencePuzzle from "./puzzles/SpotDifferencePuzzle";
import AudioPuzzle from "./puzzles/AudioPuzzle";

interface EscapeRoomProps {
  onProgress: (solved: number) => void;
  solvedCount: number;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const EscapeRoom = ({ onProgress, solvedCount }: EscapeRoomProps) => {
  const { toast } = useToast();
  const [clues, setClues] = useState({
    slidePuzzle: "",
    movieTitles: "",
    spotDifference: "",
    audioPuzzle: "",
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [showWin, setShowWin] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const count = Object.values(clues).filter(Boolean).length;
    onProgress(count);
  }, [clues, onProgress]);

  // Timer effect
  useEffect(() => {
    if (showWin) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [showWin]);

  const handlePuzzleSolve = (
    puzzle: keyof typeof clues,
    secretWord: string
  ) => {
    setClues((prev) => ({ ...prev, [puzzle]: secretWord }));
  };

  const handlePasswordSubmit = () => {
    const correctPassword = "JINGLEBELLSROCKALL";
    const alternatePassword = "JINGLEBELLSROCK";

    if (
      passwordInput.toUpperCase().replace(/\s/g, "") === correctPassword ||
      passwordInput.toUpperCase().replace(/\s/g, "") === alternatePassword
    ) {
      setFinalTime(elapsedTime);
      setShowWin(true);
      toast({
        title: "🎉 CONGRATULATIONS!",
        description: "You've escaped the Christmas Puzzle Room!",
      });
    } else {
      toast({
        title: "❌ Incorrect Password",
        description:
          "Combine all 4 secret words! Hint: It's a rockin' phrase...",
        variant: "destructive",
      });
    }
  };

  if (showWin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="animate-float">
          <Star
            className="w-24 h-24 text-christmas-gold mb-6"
            fill="currentColor"
          />
        </div>
        <h2 className="font-display text-5xl text-christmas-gold mb-4">
          YOU ESCAPED!
        </h2>
        <p className="text-2xl text-foreground/80 mb-6">
          Merry Christmas! 🎄🎅🎁
        </p>

        {/* Timer Display */}
        <div className="bg-christmas-green/20 border border-christmas-green/50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Timer className="w-8 h-8 text-christmas-green" />
            <span className="font-display text-3xl text-christmas-green">
              {formatTime(finalTime)}
            </span>
          </div>
          <p className="text-christmas-snow/80 text-sm">Your completion time</p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-christmas-gold/30 rounded-lg p-6 glow-gold">
          <p className="text-christmas-gold font-display text-xl">
            "Jingle Bells Rock" - The Ultimate Christmas Anthem!
          </p>
        </div>
        <div className="mt-8 grid grid-cols-4 gap-4 text-4xl">
          <span className="animate-float" style={{ animationDelay: "0s" }}>
            🎄
          </span>
          <span className="animate-float" style={{ animationDelay: "0.2s" }}>
            🎅
          </span>
          <span className="animate-float" style={{ animationDelay: "0.4s" }}>
            🎁
          </span>
          <span className="animate-float" style={{ animationDelay: "0.6s" }}>
            ⭐
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Active Timer */}
      <div className="flex items-center justify-center gap-2 bg-christmas-night/50 border border-christmas-gold/30 rounded-lg py-2 px-4 w-fit mx-auto">
        <Timer className="w-5 h-5 text-christmas-gold" />
        <span className="font-display text-xl text-christmas-gold">
          {formatTime(elapsedTime)}
        </span>
      </div>

      <div className="space-y-6">
        <SlidePuzzle
          onSolve={(word) => handlePuzzleSolve("slidePuzzle", word)}
          isSolved={!!clues.slidePuzzle}
        />
        <MovieTitlePuzzle
          onSolve={(word) => handlePuzzleSolve("movieTitles", word)}
          isSolved={!!clues.movieTitles}
        />
        <SpotDifferencePuzzle
          onSolve={(word) => handlePuzzleSolve("spotDifference", word)}
          isSolved={!!clues.spotDifference}
        />
        <AudioPuzzle
          onSolve={(word) => handlePuzzleSolve("audioPuzzle", word)}
          isSolved={!!clues.audioPuzzle}
        />
      </div>

      {/* Secret Words Display */}
      <div className="bg-card/30 backdrop-blur-sm border border-christmas-gold/50 rounded-xl p-6">
        <h3 className="font-display text-xl text-christmas-gold text-center mb-4">
          🔑 Your Secret Words
        </h3>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {Object.entries(clues).map(([key, value], index) => (
            <div
              key={key}
              className={`p-3 rounded-lg text-center font-display ${
                value
                  ? "bg-christmas-green/30 border border-christmas-green text-christmas-green"
                  : "bg-muted/30 border border-muted text-muted-foreground"
              }`}
            >
              {value || `Puzzle ${index + 1}`}
            </div>
          ))}
        </div>

        {/* Password Entry */}
        <h3 className="font-display text-2xl text-christmas-gold text-center mb-4">
          🔐 Enter the Escape Password
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Combine all secret words..."
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="bg-muted/50 border-christmas-gold/30 text-foreground"
          />
          <Button
            onClick={handlePasswordSubmit}
            className="bg-christmas-red hover:bg-christmas-red/80 text-christmas-snow"
          >
            Unlock 🎁
          </Button>
        </div>
        <p className="text-muted-foreground text-sm text-center mt-4">
          Hint: Put all 4 words together to form a famous phrase!
        </p>
      </div>
    </div>
  );
};

export default EscapeRoom;
