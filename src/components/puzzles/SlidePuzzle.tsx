import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Puzzle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import santaImage from "@/assets/santa-puzzle.png";

interface SlidePuzzleProps {
  onSolve: (secretWord: string) => void;
  isSolved: boolean;
}

const CORRECT_ANSWER = "1988"; // Die Hard release year
const GRID_SIZE = 3;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

const SlidePuzzle = ({ onSolve, isSolved }: SlidePuzzleProps) => {
  const [tiles, setTiles] = useState<number[]>([]);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [answer, setAnswer] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tileImages, setTileImages] = useState<string[]>([]);

  useEffect(() => {
    // Load and slice the Santa image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const tileSize = Math.floor(img.width / GRID_SIZE);
      const tiles: string[] = [];

      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const canvas = document.createElement("canvas");
          canvas.width = tileSize;
          canvas.height = tileSize;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(
              img,
              col * tileSize,
              row * tileSize,
              tileSize,
              tileSize,
              0,
              0,
              tileSize,
              tileSize
            );
            tiles.push(canvas.toDataURL());
          }
        }
      }

      setTileImages(tiles);
      setImageLoaded(true);
      initializePuzzle();
    };
    img.src = santaImage;
  }, []);

  const initializePuzzle = () => {
    let shuffled: number[];
    do {
      shuffled = [...Array(TILE_COUNT).keys()].sort(() => Math.random() - 0.5);
    } while (!isSolvable(shuffled) || isComplete(shuffled));
    setTiles(shuffled);
    setPuzzleSolved(false);
  };

  const isSolvable = (arr: number[]): boolean => {
    let inversions = 0;
    const emptyIndex = TILE_COUNT - 1;
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] !== emptyIndex && arr[j] !== emptyIndex && arr[i] > arr[j]) {
          inversions++;
        }
      }
    }
    return inversions % 2 === 0;
  };

  const isComplete = (arr: number[]): boolean => {
    return arr.every((tile, index) => tile === index);
  };

  const handleTileClick = (index: number) => {
    if (puzzleSolved || isSolved) return;

    const emptyIndex = tiles.indexOf(TILE_COUNT - 1);
    const validMoves = getValidMoves(emptyIndex);

    if (validMoves.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [
        newTiles[emptyIndex],
        newTiles[index],
      ];
      setTiles(newTiles);

      if (isComplete(newTiles)) {
        setPuzzleSolved(true);
        toast({
          title: "🧩 Puzzle Complete!",
          description: "Now answer the question to get your secret word!",
        });
      }
    }
  };

  const getValidMoves = (emptyIndex: number): number[] => {
    const moves: number[] = [];
    const row = Math.floor(emptyIndex / GRID_SIZE);
    const col = emptyIndex % GRID_SIZE;

    if (row > 0) moves.push(emptyIndex - GRID_SIZE);
    if (row < GRID_SIZE - 1) moves.push(emptyIndex + GRID_SIZE);
    if (col > 0) moves.push(emptyIndex - 1);
    if (col < GRID_SIZE - 1) moves.push(emptyIndex + 1);

    return moves;
  };

  const handleAnswerSubmit = () => {
    if (answer.trim() === CORRECT_ANSWER) {
      onSolve("JINGLE");
      toast({
        title: "🎬 Correct!",
        description:
          "Die Hard was released in 1988! Your secret word is: JINGLE",
      });
    } else {
      toast({
        title: "❌ Incorrect",
        description:
          "That's not the right year. Think about the best Christmas movie ever!",
        variant: "destructive",
      });
    }
  };

  if (!imageLoaded) {
    return (
      <div className="bg-card/30 backdrop-blur-sm border border-christmas-red/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Puzzle className="w-8 h-8 text-christmas-red" />
          <h3 className="font-display text-xl text-christmas-red">
            Christmas Slide Puzzle
          </h3>
        </div>
        <div className="flex items-center justify-center h-48">
          <div className="text-muted-foreground animate-pulse">
            Loading puzzle...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/30 backdrop-blur-sm border border-christmas-red/30 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Puzzle className="w-8 h-8 text-christmas-red" />
        <h3 className="font-display text-xl text-christmas-red">
          Christmas Slide Puzzle
        </h3>
        {isSolved ? (
          <Unlock className="w-5 h-5 text-christmas-green" />
        ) : (
          <Lock className="w-5 h-5 text-muted-foreground" />
        )}
      </div>

      <div className="grid grid-cols-3 gap-1 w-48 h-48 mx-auto mb-4 bg-christmas-night/50 p-1 rounded-lg overflow-hidden">
        {tiles.map((tile, index) => (
          <button
            key={index}
            onClick={() => handleTileClick(index)}
            disabled={tile === TILE_COUNT - 1 || puzzleSolved || isSolved}
            className={`aspect-square rounded-sm overflow-hidden transition-all
              ${
                tile === TILE_COUNT - 1
                  ? "bg-transparent"
                  : "hover:ring-2 hover:ring-christmas-gold cursor-pointer shadow-lg"
              }
              ${puzzleSolved || isSolved ? "opacity-80" : ""}
            `}
          >
            {tile !== TILE_COUNT - 1 && tileImages[tile] && (
              <img
                src={tileImages[tile]}
                alt={`Tile ${tile + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            )}
          </button>
        ))}
      </div>

      {/* Reference image */}
      {!puzzleSolved && !isSolved && (
        <div className="flex flex-col items-center gap-2 mb-4">
          <p className="text-muted-foreground text-sm text-center">
            Slide the tiles to complete the picture!
          </p>
          <div className="w-20 h-20 rounded-lg overflow-hidden border border-christmas-red/30">
            <img
              src={santaImage}
              alt="Reference"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-xs text-muted-foreground">Goal</p>
        </div>
      )}

      {(puzzleSolved || isSolved) && !isSolved && (
        <div className="space-y-3">
          <p className="text-christmas-gold text-center font-display">
            🎬 What year did the best (definitely) Christmas movie come out?
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter the year..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="bg-muted/50 border-christmas-gold/30"
            />
            <Button
              onClick={handleAnswerSubmit}
              className="bg-christmas-green hover:bg-christmas-green/80"
            >
              Submit
            </Button>
          </div>
        </div>
      )}

      {isSolved && (
        <div className="text-center text-christmas-green font-display text-lg">
          ✅ Secret Word: JINGLE
        </div>
      )}

      {!isSolved && (
        <Button
          variant="ghost"
          size="sm"
          onClick={initializePuzzle}
          className="w-full mt-2 text-muted-foreground"
        >
          Shuffle Puzzle
        </Button>
      )}
    </div>
  );
};

export default SlidePuzzle;
