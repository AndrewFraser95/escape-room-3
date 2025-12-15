import { Puzzle, Film, Music, Eye } from "lucide-react";

interface ProgressTrackerProps {
  solved: number;
}

const ProgressTracker = ({ solved }: ProgressTrackerProps) => {
  const challenges = [
    {
      icon: Puzzle,
      label: "Christmas Slide Puzzle",
      color: "text-christmas-red",
    },
    { icon: Film, label: "Missing Movie Round", color: "text-christmas-green" },
    { icon: Eye, label: "Spot the Difference", color: "text-christmas-gold" },
    { icon: Music, label: "Music Misshap", color: "text-blue-400" },
  ];

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      {challenges.map((challenge, index) => {
        const Icon = challenge.icon;
        const isSolved = index < solved;

        return (
          <div
            key={challenge.label}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              isSolved ? "scale-110" : "opacity-50"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                isSolved
                  ? `${challenge.color} border-current bg-current/10`
                  : "border-muted-foreground/30 bg-muted/20"
              }`}
            >
              <Icon
                className={`w-6 h-6 ${
                  isSolved ? challenge.color : "text-muted-foreground"
                }`}
              />
            </div>
            <span
              className={`text-xs ${
                isSolved ? challenge.color : "text-muted-foreground"
              }`}
            >
              {challenge.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressTracker;
