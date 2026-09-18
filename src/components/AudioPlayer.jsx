import { useEffect, useRef, useState } from "react";
import Button from "./Button";

const AudioPlayer = ({
  title,
  duration = "08:42",
  progress = 48,
  source = "Briefing",
  audioUrl,
  speechText = "",
}) => {
  const audioRef = useRef(null);
  const speechRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration);
  const [progressValue, setProgressValue] = useState(progress);
  const hasAudio = Boolean(audioUrl);
  const hasSpeech = Boolean(speechText);
  const canPlay = hasAudio || hasSpeech;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setProgressValue(0);
    setIsPlaying(false);
  }, [audioUrl]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return undefined;
    }

    const cleanupSpeech = () => {
      window.speechSynthesis.cancel();
      speechRef.current = null;
      setIsPlaying(false);
      setCurrentTime(0);
      setProgressValue(0);
    };

    cleanupSpeech();

    return () => {
      cleanupSpeech();
    };
  }, [audioUrl, speechText]);

  const resetPlayerState = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setProgressValue(0);
  };

  const handleToggle = async () => {
    if (!canPlay) return;

    if (hasAudio) {
      if (!audioRef.current) return;

      if (audioRef.current.paused) {
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;

    if (!speechText) return;

    if (isPlaying) {
      synth.pause();
      setIsPlaying(false);
      return;
    }

    if (speechRef.current) {
      synth.resume();
      setIsPlaying(true);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    const voices = synth.getVoices ? synth.getVoices() : [];
    const englishVoice = voices.find(
      (voice) => /en/i.test(voice.lang) || /english/i.test(voice.name)
    );

    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => {
      synth.cancel();
      speechRef.current = null;
      resetPlayerState();
    };

    utterance.onerror = () => {
      synth.cancel();
      speechRef.current = null;
      resetPlayerState();
    };

    speechRef.current = utterance;
    synth.cancel();
    synth.speak(utterance);
    setIsPlaying(true);
  };

  const formatTime = (time) => {
    if (!Number.isFinite(time) || time < 0) return "00:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextTime = audio.currentTime;
    const nextProgress = audio.duration ? (nextTime / audio.duration) * 100 : 0;

    setCurrentTime(nextTime);
    setProgressValue(nextProgress);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setTotalDuration(formatTime(audio.duration));
    setCurrentTime(audio.currentTime);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setProgressValue(0);
  };

  return (
    <div className="rounded-[2rem] border border-violet-400/20 bg-[linear-gradient(180deg,rgba(13,15,22,0.92),rgba(17,19,27,0.78))] p-5 shadow-[0_0_0_1px_rgba(168,85,247,0.05),0_25px_50px_rgba(76,29,149,0.28)] backdrop-blur-sm sm:p-6">
      {hasAudio && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      )}

      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-violet-200/90">
            Audio briefing
          </p>
          <h3 className="mt-2 text-2xl font-medium tracking-[-0.05em] text-zinc-50 sm:text-[2rem]">
            {title}
          </h3>
        </div>
        <div className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-violet-100">
          {hasAudio ? "LIVE" : "READY"}
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between gap-3 rounded-[1.5rem] border border-violet-400/20 bg-white/[0.03] p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/80 to-fuchsia-500/70 shadow-[0_0_20px_rgba(168,85,247,0.35)]">
            <span className="text-xl">◉</span>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-200">{source}</p>
            <p className="text-xs text-zinc-400">
              {hasAudio ? "Morning briefing" : "Audio unavailable for this story yet"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleToggle}
            className={[
              "h-12 w-12 rounded-full border-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 p-0 text-xl text-white shadow-[0_0_18px_rgba(168,85,247,0.4)]",
              "w-auto !px-4 !py-3 !text-sm !font-medium",
            ].join(" ")}
            disabled={!canPlay}
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-400 via-violet-300 to-fuchsia-300 shadow-[0_0_10px_rgba(192,132,252,0.6)]"
            style={{ width: `${hasAudio ? progressValue : 0}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-zinc-400">
          <span>{hasAudio ? formatTime(currentTime) : "N/A"}</span>
          <span>{hasAudio ? totalDuration : "No audio"}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
