import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Music, Play, Pause } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

interface AudioPuzzleProps {
  onSolve: (secretWord: string) => void;
  isSolved: boolean;
}

// Public domain Christmas songs (using simple tone generation)
const PLAYING_SONGS = ["Jingle Bells", "Silent Night", "Deck the Halls"];

const ALL_SONGS = [
  "Jingle Bells",
  "Silent Night",
  "Deck the Halls",
  "Frosty the Snowman",
  "Rudolph the Red-Nosed Reindeer",
  "Santa Claus is Coming to Town",
  "White Christmas",
  "O Holy Night",
  "Away in a Manger",
  "The First Noel",
];

const AudioPuzzle = ({ onSolve, isSolved }: AudioPuzzleProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  // Simple melody frequencies for each song (first few notes)
  const melodies = {
    "Jingle Bells": [330, 330, 330, 330, 330, 330, 330, 392, 262, 294, 330],
    "Silent Night": [392, 440, 392, 330, 392, 440, 392, 330, 587, 587, 494],
    "Deck the Halls": [
      392, 349, 330, 294, 262, 294, 330, 262, 294, 330, 349, 294,
    ],
  };

  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, []);

  const playMusic = () => {
    if (audioContextRef.current) {
      stopMusic();
    }

    audioContextRef.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const ctx = audioContextRef.current;

    // Play all 3 songs simultaneously with different volumes and octaves
    Object.entries(melodies).forEach(([_, notes], songIndex) => {
      let time = ctx.currentTime;
      const baseOctave = [1, 1.5, 0.75][songIndex]; // Different octaves

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = freq * baseOctave;
        osc.type = ["sine", "triangle", "square"][songIndex] as OscillatorType;

        gain.gain.value = 0.15;
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);

        osc.start(time);
        osc.stop(time + 0.4);
        oscillatorsRef.current.push(osc);

        time += 0.35;
      });
    });

    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 4000);
  };

  const stopMusic = () => {
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {}
    });
    oscillatorsRef.current = [];
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggleSong = (song: string) => {
    if (isSolved) return;

    setSelectedSongs((prev) =>
      prev.includes(song)
        ? prev.filter((s) => s !== song)
        : prev.length < 3
        ? [...prev, song]
        : prev
    );
  };

  const checkAnswer = () => {
    const correct =
      PLAYING_SONGS.every((song) => selectedSongs.includes(song)) &&
      selectedSongs.length === 3;

    if (correct) {
      onSolve("ALL");
      toast({
        title: "🎵 Perfect Ear!",
        description: "You identified all 3 songs! Secret word: ALL",
      });
    } else {
      const correctCount = selectedSongs.filter((s) =>
        PLAYING_SONGS.includes(s)
      ).length;
      toast({
        title: `${correctCount}/3 Correct`,
        description: "Listen again and try different selections!",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-card/30 backdrop-blur-sm border border-blue-400/30 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Music className="w-8 h-8 text-blue-400" />
        <h3 className="font-display text-xl text-blue-400">
          Christmas Song Mix
        </h3>
        {isSolved ? (
          <Unlock className="w-5 h-5 text-christmas-green" />
        ) : (
          <Lock className="w-5 h-5 text-muted-foreground" />
        )}
      </div>

      <p className="text-muted-foreground text-sm mb-4 text-center">
        3 Christmas songs are playing at once. Identify all 3!
      </p>

      <Button
        onClick={isPlaying ? stopMusic : playMusic}
        className="w-full mb-4 bg-blue-500 hover:bg-blue-600"
        disabled={isSolved}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 mr-2" />
        ) : (
          <Play className="w-4 h-4 mr-2" />
        )}
        {isPlaying ? "Playing..." : "Play Mixed Audio"}
      </Button>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {ALL_SONGS.map((song) => (
          <div
            key={song}
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
              selectedSongs.includes(song)
                ? "bg-christmas-green/30 border border-christmas-green"
                : "bg-muted/30 border border-transparent hover:border-muted"
            } ${isSolved ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => toggleSong(song)}
          >
            <Checkbox
              checked={selectedSongs.includes(song)}
              disabled={isSolved}
              className="pointer-events-none"
            />
            <span className="text-sm text-christmas-snow">{song}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center mb-3">
        Selected: {selectedSongs.length}/3
      </p>

      {!isSolved && (
        <Button
          onClick={checkAnswer}
          disabled={selectedSongs.length !== 3}
          className="w-full bg-christmas-green hover:bg-christmas-green/80"
        >
          Submit Selection
        </Button>
      )}

      {isSolved && (
        <div className="text-center text-christmas-green font-display text-lg">
          ✅ Secret Word: ALL
        </div>
      )}
    </div>
  );
};

export default AudioPuzzle;
