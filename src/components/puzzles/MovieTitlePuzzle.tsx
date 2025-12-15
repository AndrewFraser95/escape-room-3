import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Film } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MovieTitlePuzzleProps {
  onSolve: (secretWord: string) => void;
  isSolved: boolean;
}

const MOVIE_QUESTIONS = [
  { title: "Home _____", answer: "ALONE", hint: "Kevin's situation" },
  {
    title: "The _____ Express",
    answer: "POLAR",
    hint: "Arctic train ride",
  },
  {
    title: "_____ Actually",
    answer: "LOVE",
    hint: "British romance anthology",
  },
  {
    title: "A Christmas _____",
    answer: "CAROL",
    hint: "Dickens classic",
  },
  {
    title: "_____ the Snowman",
    answer: "FROSTY",
    hint: "Magical winter friend",
  },
];

const MovieTitlePuzzle = ({ onSolve, isSolved }: MovieTitlePuzzleProps) => {
  const { toast } = useToast();
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>(
    Array(5).fill(false)
  );

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value.toUpperCase();
    setAnswers(newAnswers);
  };

  const checkAllAnswers = () => {
    const results = MOVIE_QUESTIONS.map(
      (q, i) => answers[i].trim().toUpperCase() === q.answer
    );
    setCorrectAnswers(results);

    const allCorrect = results.every(Boolean);
    const correctCount = results.filter(Boolean).length;

    if (allCorrect) {
      onSolve("BELLS");
      toast({
        title: "🎬 All Correct!",
        description: "You know your Christmas movies! Secret word: BELLS",
      });
    } else {
      toast({
        title: `${correctCount}/5 Correct`,
        description: "Keep trying! Check the highlighted ones.",
        variant: correctCount > 0 ? "default" : "destructive",
      });
    }
  };

  return (
    <div className="bg-card/30 backdrop-blur-sm border border-christmas-green/30 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Film className="w-8 h-8 text-christmas-green" />
        <h3 className="font-display text-xl text-christmas-green">
          Missing Movie Words
        </h3>
        {isSolved ? (
          <Unlock className="w-5 h-5 text-christmas-green" />
        ) : (
          <Lock className="w-5 h-5 text-muted-foreground" />
        )}
      </div>

      <p className="text-muted-foreground text-sm mb-4 text-center">
        Fill in the missing word from each Christmas movie title!
      </p>

      <div className="space-y-3">
        {MOVIE_QUESTIONS.map((movie, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-christmas-snow min-w-[180px]">
              {movie.title}
            </span>
            <Input
              type="text"
              placeholder={movie.hint}
              value={answers[index]}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              disabled={isSolved}
              className={`bg-muted/50 border flex-1 uppercase ${
                correctAnswers[index]
                  ? "border-christmas-green text-christmas-green"
                  : "border-christmas-gold/30"
              }`}
            />
            {correctAnswers[index] && (
              <span className="text-christmas-green">✓</span>
            )}
          </div>
        ))}
      </div>

      {!isSolved && (
        <Button
          onClick={checkAllAnswers}
          className="w-full mt-4 bg-christmas-green hover:bg-christmas-green/80"
        >
          Check All Answers
        </Button>
      )}

      {isSolved && (
        <div className="text-center text-christmas-green font-display text-lg mt-4">
          ✅ Secret Word: BELLS
        </div>
      )}
    </div>
  );
};

export default MovieTitlePuzzle;
