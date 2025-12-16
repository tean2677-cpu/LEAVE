import { useState, useEffect, useCallback, useRef } from "react";
import { useBedroomGame } from "@/lib/stores/useBedroomGame";

const diaryTexts = {
  1: `Day 1
     Dear diary, yesterday Mom told me that we would be moving, and I didn't know it would be this far away. The new neighborhood is nice and small, like my room. 
But that's all I can see from my new window which is too dark to see out of, like it shot out darkness instead of letting light through. 
We still need most of our stuff to be shipped here, or at least that is what dad said. I saw some drawings on the walls on the way here, one had a "fun" face. 
I also saw red eyes staring at me, along with some strange sounds, but I have my teddy bear next to me, and it does help me a lot. 
I also have a cup of glass because I saw something in the kitchen last time, no way I'm going in there again at night. 
Well, it's about time to sleep. I hope I don't wake up in the middle of the night.`,

  2: `Day 2
     I'm glad I forgot to put the flashlight back into my mom's room yesterday. I felt I had no choice, though, as they weren't there and I wasn't sure what to do. 
It did well against the monsters… ghosts… whatever you call them. They were here, all in my room. 
I know for sure they exist, though I don't know what to do. My parents would only tell me I'm imagining things. 
Speaking of them, they're packing for some reason. We haven't even been here for a day, and it's as if they're leaving.`,

  3: `Day 3
     I think they came more prepared than last time. They were more… aggressive, hostile, preying on me with those eyes, vexing me with those sounds, and the worst one… the face.
Everywhere dark I go, I always see that face now, the smile, its white eyes. 
Anyway, I noticed the fog just now. I can't even open the windows; it's jammed. 
I wish for it to be gone; it's compromising my view. I think the mesmerizing thing with red eyes that makes me yearn for water makes the fog, maybe it's sucking up water, who knows.
Also, my parents are gone for longer, and when they are here… They aren't doing anything; food just appears on the table randomly, but they aren't here most of the time and their rooms are getting emptier by the day.`,

  4: `Day 4
     The monsters are here from the evening to the night. 
The stares are making me more dizzy, and maybe more prone to these attacks. I should sleep more, but I physically can't. I wake up every few minutes and I haven't even slept properly… 
I don't even know. The house is... Very quiet to say the least, even in the morning. It's just me, myself, and them.`,

  5: `Day 5
I see the diary fading in my hands right now as I write, like little pieces are coming off the pages, as if they're just vanishing, gone.  
I just can't get used to this. The fog is consuming my eyesight. My teddy bear is gone, I don't even have water now…  
Some stalker is coming, I can hear him in the other room, so I can't let them have me. This is my last entry.`,

  epilogue: `Day ???
     Hi, I'm William, I'm 10 years old and I like normal kid stuff. Yknow, like videogames, watching videos, etc. 
     Anyway, my parents told me we're moving in here because it was cheaper than where we were before. 
     My Dad is a teacher, my mom is... well...... she left us.
     Apparently this house was owned by someone that took their life. I hope no ghosts are here. :)
     Well, first day here so wish me luck!`,
};

export function Diary({ onComplete }: { onComplete: () => void }) {
  const currentNight = useBedroomGame((state) => state.currentNight);
  const isEpilogue = useBedroomGame((state) => state.isEpilogue);
  
  let diaryText;
  if (isEpilogue) {
    diaryText = diaryTexts.epilogue;
  } else {
    diaryText = diaryTexts[currentNight as keyof typeof diaryTexts] || diaryTexts[1];
  }
  const [revealedChars, setRevealedChars] = useState(0);
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);
  const [skipPressed, setSkipPressed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);

  console.log('Diary component rendered');

  const revealNext = useCallback(() => {
    if (revealedChars < diaryText.length) {
      setRevealedChars((prev) => prev + 1);
    } else {
      setIsFullyRevealed(true);
    }
  }, [revealedChars]);

  // Typewriter effect
  useEffect(() => {
    if (isFullyRevealed || skipPressed) return;
    timeoutRef.current = setTimeout(revealNext, 30);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [revealedChars, isFullyRevealed, skipPressed, revealNext]);

  // Auto-advance after 2s when fully revealed or skipped
  useEffect(() => {
    if (isFullyRevealed || skipPressed) {
      console.log('Diary: Auto-advancing in 2 seconds...');
      autoAdvanceRef.current = setTimeout(() => {
        console.log('Diary: Calling onComplete...');
        onComplete();
      }, 2000);
      return () => {
        if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      };
    }
  }, [isFullyRevealed, skipPressed, onComplete]);

  // Enter key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        console.log('Diary: Enter key pressed', { isFullyRevealed, skipPressed });
        if (!isFullyRevealed && !skipPressed) {
          // First press: reveal full text instantly
          console.log('Diary: Revealing full text instantly');
          setSkipPressed(true);
          setIsFullyRevealed(true);
          setRevealedChars(diaryText.length);
        } else {
          // Second press or after reveal: skip diary
          console.log('Diary: Skipping diary, calling onComplete...');
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
          onComplete();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullyRevealed, skipPressed, onComplete]);

  const displayText = skipPressed || isFullyRevealed ? diaryText : diaryText.slice(0, revealedChars);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="max-w-2xl p-8 text-lg font-mono text-white leading-relaxed whitespace-pre-wrap">
        {displayText}
        {!isFullyRevealed && !skipPressed && (
          <span className="inline-block w-2 h-5 ml-1 bg-white animate-pulse" />
        )}
        <div className="mt-8 text-sm text-gray-400">
          Press Enter to {isFullyRevealed || skipPressed ? "skip" : "reveal faster"}
        </div>
      </div>
    </div>
  );
}