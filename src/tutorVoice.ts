import { useEffect, useRef, useState } from 'react';
import type { Lang } from './tutorScience';

interface Recognition {
  lang: string;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  abort(): void;
}
const browser = window as Window & {
  SpeechRecognition?: new () => Recognition;
  webkitSpeechRecognition?: new () => Recognition;
};

export function useTutorVoice(lang: Lang, enabled: boolean, rate: number) {
  const [status, setStatus] = useState<'idle' | 'listening' | 'speaking' | 'paused'>('idle');
  const [failed, setFailed] = useState(false);
  const synth = window.speechSynthesis;
  const Recognition = browser.SpeechRecognition || browser.webkitSpeechRecognition;
  const microphone = useRef<Recognition | null>(null);
  const generation = useRef(0);
  const utterance = useRef<SpeechSynthesisUtterance>();
  const last = useRef<{ parts: string[]; done?: () => void; highlight?: (index: number) => void }>();
  function stop() {
    generation.current++;
    const active = microphone.current;
    microphone.current = null;
    active?.abort();
    synth?.cancel();
    utterance.current = undefined;
    setStatus('idle');
  }
  useEffect(() => {
    stop();
    last.current = undefined;
    return stop;
  }, [lang, enabled]);

  function speak(parts: string[], done?: () => void, highlight?: (index: number) => void) {
    if (!enabled || !synth || !window.SpeechSynthesisUtterance) return;
    stop();
    setFailed(false);
    last.current = {parts, done, highlight};
    const token = generation.current;
    const locale = lang === 'ar' ? 'ar' : 'en';
    function next(index: number) {
      if (token !== generation.current) return;
      if (index === parts.length) {
        setStatus('idle');
        highlight?.(-1);
        done?.();
        return;
      }
      const speech = new SpeechSynthesisUtterance(parts[index]);
      utterance.current = speech;
      const voices = synth.getVoices().filter(voice => voice.lang.toLowerCase().startsWith(locale));
      const preferred = voices.find(voice => voice.localService) || voices[0];
      if (preferred) speech.voice = preferred;
      speech.lang = preferred?.lang || (locale === 'ar' ? 'ar-AE' : 'en-US');
      speech.rate = rate;
      speech.onend = () => next(index + 1);
      speech.onerror = () => {
        if (token !== generation.current) return;
        highlight?.(-1);
        setStatus('idle');
        setFailed(true);
      };
      highlight?.(index);
      setStatus('speaking');
      synth.speak(speech);
    }
    next(0);
  }
  function listen(receive: (transcript: string) => void) {
    if (!Recognition) return;
    const alreadyListening = microphone.current !== null;
    stop();
    if (alreadyListening) return;
    setFailed(false);
    const current = new Recognition();
    microphone.current = current;
    current.lang = lang === 'ar' ? 'ar-AE' : 'en-US';
    current.onresult = event => {
      if (microphone.current === current) receive(event.results[0][0].transcript);
    };
    current.onerror = () => {
      if (microphone.current !== current) return;
      setFailed(true);
      setStatus('idle');
      microphone.current = null;
    };
    current.onend = () => {
      if (microphone.current !== current) return;
      microphone.current = null;
      setStatus('idle');
    };
    try {
      current.start();
      setStatus('listening');
    } catch {
      microphone.current = null;
      setStatus('idle');
      setFailed(true);
    }
  }
  function pause() {
    if (status === 'paused') {
      synth?.resume();
      setStatus('speaking');
    } else if (status === 'speaking') {
      synth?.pause();
      setStatus('paused');
    }
  }
  return {
    speak, listen, stop, pause, status, failed, recognition: Boolean(Recognition),
    synthesis: Boolean(synth && window.SpeechSynthesisUtterance),
    clear: () => { stop(); last.current = undefined; },
    replay: () => { if (last.current) speak(last.current.parts, last.current.done, last.current.highlight); }
  };
}
