import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Eye, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import townOriginal from "@/assets/town-original.png";
import townDifferences from "@/assets/town-differences.png";

interface SpotDifferencePuzzleProps {
  onSolve: (secretWord: string) => void;
  isSolved: boolean;
}

interface HiddenItem {
  id: string;
  name: string;
  x: number; // percentage from left
  y: number; // percentage from top
  size: number; // click area size in percentage
}

const HIDDEN_ITEMS: HiddenItem[] = [
  { id: "gift", name: "Gift Box", x: 5, y: 85, size: 6 },
  { id: "candy-cane", name: "Candy Cane", x: 88, y: 75, size: 5 },
  { id: "snowman", name: "Snowman", x: 58, y: 62, size: 5 },
  {
    id: "gingerbread-window",
    name: "Gingerbread Man (Window)",
    x: 22,
    y: 45,
    size: 6,
  },
  {
    id: "gingerbread-door",
    name: "Gingerbread Man (Door)",
    x: 26,
    y: 60,
    size: 6,
  },
];

const SpotDifferencePuzzle = ({
  onSolve,
  isSolved,
}: SpotDifferencePuzzleProps) => {
  const { toast } = useToast();
  const [foundItems, setFoundItems] = useState<string[]>([]);
  const [showHints, setShowHints] = useState(false);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSolved) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    for (const item of HIDDEN_ITEMS) {
      if (foundItems.includes(item.id)) continue;

      const distance = Math.sqrt(
        Math.pow(x - item.x, 2) + Math.pow(y - item.y, 2)
      );
      if (distance < item.size) {
        const newFound = [...foundItems, item.id];
        setFoundItems(newFound);

        if (newFound.length === HIDDEN_ITEMS.length) {
          onSolve("ROCK");
          toast({
            title: "👁️ All Hidden Items Found!",
            description: "Sharp eyes! Secret word: ROCK",
          });
        } else {
          toast({
            title: `✓ Found: ${item.name}`,
            description: `${newFound.length}/${HIDDEN_ITEMS.length} items found!`,
          });
        }
        return;
      }
    }

    toast({
      title: "Keep looking!",
      description: "There's nothing special there. Try another spot!",
    });
  };

  return (
    <div className="bg-card/30 backdrop-blur-sm border border-christmas-gold/30 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Eye className="w-8 h-8 text-christmas-gold" />
        <h3 className="font-display text-xl text-christmas-gold">
          Find the Hidden Items
        </h3>
        {isSolved ? (
          <Unlock className="w-5 h-5 text-christmas-green" />
        ) : (
          <Lock className="w-5 h-5 text-muted-foreground" />
        )}
      </div>

      <p className="text-muted-foreground text-sm mb-4 text-center">
        Compare these images and click to find {HIDDEN_ITEMS.length} hidden
        items in Scene B!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        {/* Scene A - Original */}
        <div className="relative rounded-lg overflow-hidden border-2 border-christmas-pine/50">
          <img
            src={townOriginal}
            alt="Original Christmas village scene"
            className="w-full h-auto"
          />
          <div className="absolute bottom-2 left-2 bg-christmas-night/80 text-christmas-snow text-xs px-2 py-1 rounded">
            Scene A (Original)
          </div>
        </div>

        {/* Scene B - With differences - clickable */}
        <div
          className="relative rounded-lg overflow-hidden border-2 border-christmas-gold/50 cursor-crosshair"
          onClick={handleImageClick}
        >
          <img
            src={townDifferences}
            alt="Christmas village with hidden items"
            className="w-full h-auto"
          />
          <div className="absolute bottom-2 left-2 bg-christmas-night/80 text-christmas-snow text-xs px-2 py-1 rounded">
            Scene B (Click to find items!)
          </div>

          {/* Show found item markers */}
          {foundItems.map((itemId) => {
            const item = HIDDEN_ITEMS.find((i) => i.id === itemId);
            if (!item) return null;
            return (
              <div
                key={item.id}
                className="absolute w-6 h-6 bg-christmas-green rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-lg animate-scale-in"
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
              >
                <Check className="w-4 h-4 text-white" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-christmas-snow mb-2">
          Found: {foundItems.length}/{HIDDEN_ITEMS.length}
        </p>
        <div className="flex flex-wrap gap-2">
          {HIDDEN_ITEMS.map((item) => (
            <span
              key={item.id}
              className={`text-xs px-2 py-1 rounded ${
                foundItems.includes(item.id)
                  ? "bg-christmas-green/30 text-christmas-green"
                  : "bg-muted/30 text-muted-foreground"
              }`}
            >
              {foundItems.includes(item.id) ? item.name : "???"}
            </span>
          ))}
        </div>
      </div>

      {isSolved && (
        <div className="text-center text-christmas-green font-display text-lg">
          ✅ Secret Word: ROCK
        </div>
      )}

      {!isSolved && (
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHints(!showHints)}
            className="text-muted-foreground"
          >
            {showHints ? "Hide Hints" : "Show Hints"}
          </Button>
          {showHints && (
            <p className="text-xs text-muted-foreground text-center">
              Look for: a gift box, candy cane, snowman, and two gingerbread men
              (one in window, one on door)
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SpotDifferencePuzzle;
