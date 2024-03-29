import { CodeInput } from "../components/CodeInput";
import { VideoPlayer } from "../components/VideoPlayer";
import { TutorialStep } from "../components/TutorialStep";
import { useCallback, useRef, useState } from "react";
import { GameMode } from "../types";
import tvFrame from "../assets/images/background/tv_frame.png";
import { VideoPlayback } from "../components/VideoPlayback";

interface Props {
  onGameEnd: () => void;
}
export function GamePage({ onGameEnd }: Props) {
  const [chosenSoundIds, setChosenSoundIds] = useState<number[]>([]);

  const [gameMode, setGameMode] = useState<GameMode>("tutorial");
  const currentChosenSoundIdx = useRef(-1);

  const goToNextScene = useCallback(() => {
    if (gameMode === "playback") {
      return onGameEnd();
    }
    const sequence: GameMode[] = [
      "tutorial",
      "stills",
      "prep_playback",
      "playback",
    ];

    setGameMode((prev) => {
      const idx = sequence.findIndex((x) => x === prev);
      return sequence[(idx + 1) % sequence.length];
    });
  }, [onGameEnd, gameMode]);

  const finalizeChoice = useCallback(() => {
    setChosenSoundIds((prev) => {
      const res = [...prev, currentChosenSoundIdx.current];
      console.log(res);
      return res;
    });
    currentChosenSoundIdx.current = -1;
  }, [setChosenSoundIds]);

  const setChosenSound = useCallback((id: number) => {
    currentChosenSoundIdx.current = id;
  }, []);

  if (gameMode === "tutorial") {
    return <TutorialStep goToNextScene={goToNextScene} />;
  }
  if (gameMode === "prep_playback") {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative overflow-hidden">
          <img src={tvFrame} className="h-96" draggable={false} />
          <div
            className="absolute top-12 left-4 w-3/4 h-3/4 -z-10 staticcy"
            style={{ objectFit: "cover" }}
          />
        </div>
        <button
          className="bg-black hover:bg-white text-white hover:text-black font-handwritten font-bold text-3xl py-4 px-24 rounded-full flex items-center gap-4"
          onClick={goToNextScene}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Start Playback
        </button>
      </div>
    );
  }

  if (gameMode === "playback") {
    return (
      <div className="flex flex-col items-center gap-4">
        <VideoPlayback
          goToNextScene={goToNextScene}
          chosenSoundIds={chosenSoundIds}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 shadow-inner bg-opacity-15 rounded-3xl">
      <VideoPlayer
        goToNextScene={goToNextScene}
        onTimeRanOut={finalizeChoice}
      />
      <CodeInput onSoundChosen={setChosenSound} />
    </div>
  );
}
