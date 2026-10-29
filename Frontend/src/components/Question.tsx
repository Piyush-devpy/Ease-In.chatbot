import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import brainLogo from "../assets/brainlogo.png";

type Language = "en" | "hi" | "es";
type Scale = "PHQ-9" | "GAD-7";

type Question = {
  id: number;
  scale: Scale;
  text: string;
};

type FrequencyOption = {
  value: number;
  label: string;
};

type QuestionPayload = {
  intro: string;
  help_text: string;
  sections: Record<Scale, string>;
  frequency_options: FrequencyOption[];
  questions: Question[];
  notice: string;
};

type ScaleResult = {
  score: number;
  max_score: number;
  severity: string;
  label: string;
};

type ScoreResult = {
  phq9: ScaleResult;
  gad7: ScaleResult;
  self_harm_flag: boolean;
  support_notice: string | null;
  disclaimer: string;
  next_step: string;
};

const API =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:5000";

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "es", label: "Español" },
];

const ui = {
  en: {
    title: "Ease-In",
    subtitle: "Your personal wellbeing companion",
    online: "Here for you",
    language: "Language",
    home: "Home",
    feedback: "Feedback",
    loading: "Getting things ready...",
    error: "Something went wrong.",
    retry: "Try again",
    previous: "Previous",
    next: "Send answer",
    finish: "View my results",
    question: "Question",
    of: "of",
    result: "Your wellbeing summary",
    mood: "Mood and interest",
    anxiety: "Worry and anxiety",
    retake: "Start again",
    choose: "Choose the answer that feels closest to your experience.",
    answerAll: "Please answer every question before viewing your results.",
    supportTitle: "You deserve support.",
    supportFallback:
      "If you are having thoughts of harming yourself, contact a local crisis line or someone you trust right now.",
    screeningOnly: "Screening score only — not a diagnosis.",
    footer: "Ease-In is a screening tool, not a diagnostic service.",
    welcome: "Hi there! 👋 I'm glad you're here.",
    welcome2:
      "This is a private wellbeing check-in. I'll ask a few questions, one at a time. There are no right or wrong answers.",
    start: "Let's get started",
    botName: "Ease-In assistant",
    you: "You",
    selected: "Selected answer",
    changeAnswer: "You can go back to change your answer.",
    privacy: "Your wellbeing matters. Take your time.",
    sectionMood: "Mood & interest",
    sectionAnxiety: "Worry & anxiety",
    restartChat: "Retake check-in",
  },
  hi: {
    title: "Ease-In",
    subtitle: "आपका मानसिक सेहत साथी",
    online: "आपकी सहायता के लिए",
    language: "भाषा",
    home: "होम",
    feedback: "फ़ीडबैक",
    loading: "तैयारी हो रही है...",
    error: "कुछ गलत हुआ।",
    retry: "फिर कोशिश करें",
    previous: "पिछला",
    next: "जवाब भेजें",
    finish: "मेरे परिणाम देखें",
    question: "सवाल",
    of: "में से",
    result: "आपकी मानसिक सेहत का सारांश",
    mood: "मूड और रुचि",
    anxiety: "चिंता और बेचैनी",
    retake: "फिर से शुरू करें",
    choose: "वह जवाब चुनें जो आपके अनुभव के सबसे करीब हो।",
    answerAll: "परिणाम देखने से पहले सभी सवालों के जवाब दें।",
    supportTitle: "आप सहायता पाने के हकदार हैं।",
    supportFallback:
      "अगर आपके मन में खुद को नुकसान पहुँचाने के विचार आ रहे हैं, तो अभी किसी स्थानीय हेल्पलाइन या भरोसेमंद व्यक्ति से संपर्क करें।",
    screeningOnly: "यह केवल स्क्रीनिंग स्कोर है, निदान नहीं।",
    footer: "Ease-In एक स्क्रीनिंग टूल है, निदान सेवा नहीं।",
    welcome: "नमस्ते! 👋 अच्छा लगा कि आप यहाँ आए।",
    welcome2:
      "यह आपकी मानसिक सेहत की एक निजी जाँच है। मैं आपसे एक-एक करके कुछ सवाल पूछूँगा। यहाँ कोई सही या गलत जवाब नहीं है।",
    start: "शुरू करें",
    botName: "Ease-In सहायक",
    you: "आप",
    selected: "चुना गया जवाब",
    changeAnswer: "आप पिछले सवाल पर जाकर जवाब बदल सकते हैं।",
    privacy: "आपकी सेहत महत्वपूर्ण है। आराम से जवाब दें।",
    sectionMood: "मूड और रुचि",
    sectionAnxiety: "चिंता और बेचैनी",
    restartChat: "जाँच दोबारा करें",
  },
  es: {
    title: "Ease-In",
    subtitle: "Tu compañero de bienestar",
    online: "Aquí para ayudarte",
    language: "Idioma",
    home: "Inicio",
    feedback: "Comentarios",
    loading: "Preparando todo...",
    error: "Algo salió mal.",
    retry: "Intentar de nuevo",
    previous: "Anterior",
    next: "Enviar respuesta",
    finish: "Ver mis resultados",
    question: "Pregunta",
    of: "de",
    result: "Resumen de tu bienestar",
    mood: "Estado de ánimo e interés",
    anxiety: "Preocupación y ansiedad",
    retake: "Empezar de nuevo",
    choose: "Elige la respuesta más cercana a tu experiencia.",
    answerAll: "Responde todas las preguntas antes de ver tus resultados.",
    supportTitle: "Mereces recibir apoyo.",
    supportFallback:
      "Si tienes pensamientos de hacerte daño, contacta ahora con una línea de crisis local o con alguien de confianza.",
    screeningOnly: "Solo una puntuación de detección, no un diagnóstico.",
    footer: "Ease-In es una herramienta de detección, no un servicio de diagnóstico.",
    welcome: "¡Hola! 👋 Me alegra que estés aquí.",
    welcome2:
      "Esta es una revisión privada de bienestar. Te haré algunas preguntas, una a la vez. No hay respuestas correctas o incorrectas.",
    start: "Empezar",
    botName: "Asistente Ease-In",
    you: "Tú",
    selected: "Respuesta seleccionada",
    changeAnswer: "Puedes volver atrás para cambiar tu respuesta.",
    privacy: "Tu bienestar importa. Tómate tu tiempo.",
    sectionMood: "Estado de ánimo e interés",
    sectionAnxiety: "Preocupación y ansiedad",
    restartChat: "Repetir evaluación",
  },
} as const;

type Strings = (typeof ui)[Language];

async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function getSectionName(scale: Scale, t: Strings) {
  return scale === "PHQ-9" ? t.sectionMood : t.sectionAnxiety;
}

export default function Questions() {
  const [language, setLanguage] = useState<Language>("en");
  const [payload, setPayload] = useState<QuestionPayload | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [index, setIndex] = useState(-1);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const autoAdvanceRef = useRef<number | null>(null);

  const t: Strings = ui[language];
  const current = payload?.questions[index];
  const total = payload?.questions.length ?? 0;
  const answered = Object.keys(answers).length;

  // Clean up any pending auto-advance timer when the component unmounts.
  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current !== null) {
        window.clearTimeout(autoAdvanceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function loadQuestions() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API}/api/chatbot/questions?language=${language}`,
          { signal: controller.signal },
        );

        const data = await readJson(response);

        if (!response.ok) {
          throw new Error(data.error || ui[language].error);
        }

        if (!Array.isArray(data.questions) || data.questions.length === 0) {
          throw new Error(ui[language].error);
        }

        setPayload(data as QuestionPayload);
      } catch (e) {
        if (!controller.signal.aborted) {
          setError(e instanceof Error ? e.message : ui[language].error);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadQuestions();
    return () => controller.abort();
  }, [language, reloadKey]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "end",
    });
  }, [index, answers, result]);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [index]);

  const selectLanguage = (next: Language) => {
    if (next === language) return;

    if (autoAdvanceRef.current !== null) {
      window.clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }

    setIsBotTyping(false);
    setLanguage(next);
    setAnswers({});
    setIndex(-1);
    setResult(null);
    setError("");
  };

  const go = useCallback(
    (delta: 1 | -1) => {
      if (autoAdvanceRef.current !== null) {
        window.clearTimeout(autoAdvanceRef.current);
        autoAdvanceRef.current = null;
      }

      setIsBotTyping(false);
      setDirection(delta === 1 ? "next" : "prev");
      setIndex((i) => Math.min(Math.max(0, i + delta), Math.max(0, total - 1)));
      setError("");
    },
    [total],
  );

  async function finish(
    answerState: Record<number, number> = answers,
  ) {
    if (
      !payload ||
      payload.questions.some((question) => answerState[question.id] === undefined)
    ) {
      setError(t.answerAll);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const ordered = payload.questions.map((question) => answerState[question.id]);

      const response = await fetch(`${API}/api/assessment/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: ordered, language }),
      });

      const data = await readJson(response);

      if (!response.ok) {
        throw new Error(data.error || t.error);
      }

      setResult(data as ScoreResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.error);
    } finally {
      setSubmitting(false);
    }
  }

  function handleAnswer(value: number) {
    if (!payload || !current || isBotTyping || submitting) return;

    if (autoAdvanceRef.current !== null) {
      window.clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }

    const updatedAnswers = {
      ...answers,
      [current.id]: value,
    };

    // Show the selected answer immediately, then let the bot respond automatically.
    setAnswers(updatedAnswers);
    setError("");
    setIsBotTyping(true);

    autoAdvanceRef.current = window.setTimeout(() => {
      autoAdvanceRef.current = null;
      setIsBotTyping(false);

      if (index < total - 1) {
        go(1);
      } else {
        void finish(updatedAnswers);
      }
    }, 700);
  }

  function restart() {
    if (autoAdvanceRef.current !== null) {
      window.clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }

    setIsBotTyping(false);
    setAnswers({});
    setIndex(-1);
    setDirection("next");
    setResult(null);
    setError("");
  }

  const showSupport =
    !!result && (result.self_harm_flag || !!result.support_notice);

  return (
    <main className="min-h-dvh bg-[linear-gradient(145deg,#FFF9F0_0%,#F5E6CC_100%)] px-3 py-4 text-[#292524] sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-4xl flex-col sm:min-h-[calc(100dvh-3.5rem)]">
        {/* Header */}
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur sm:mb-5 sm:px-5">
          <Link to="/" className="group flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C47752]">
            <img src={brainLogo} alt="brain-logo.png" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#292524] text-2xl shadow-sm transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105 motion-reduce:transform-none" aria-hidden="true"/>
            <span className="min-w-0">
              <span className="block truncate text-lg font-extrabold tracking-tight sm:text-xl">{t.title}</span>
              <span className="hidden text-xs text-stone-600 sm:block">{t.subtitle}</span>
            </span>
          </Link>
          <div className="flex max-w-full flex-wrap items-center gap-2 sm:gap-3">
            <span className="hidden text-xs font-medium text-stone-500 md:inline">{t.language}</span>
            <div role="group" aria-label={t.language} className="flex flex-wrap rounded-full bg-[#F5E6CC] p-1">
              {LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  aria-pressed={language === item.code}
                  onClick={() => selectLanguage(item.code)}
                  className={`min-h-9 rounded-full px-3 py-1.5 text-xs font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C47752] sm:px-3.5 sm:text-sm ${
                    language === item.code
                      ? "bg-[#292524] text-white shadow-sm"
                      : "text-stone-700 hover:bg-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Chat window */}
        <section className="flex min-h-120 flex-1 flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/75 shadow-[0_18px_60px_rgba(74,45,29,0.10)] backdrop-blur sm:min-h-140 sm:rounded-4xl">
          <div className="flex items-center gap-3 border-b border-[#EADCCB] bg-white/70 px-4 py-3 sm:px-6 sm:py-4">
            <div>
              < img src={brainLogo} alt="brain-logo.png"  className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5E6CC] text-xl"/>
              
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold sm:text-base">{t.botName}</p>
              <p className="text-xs text-stone-500">{t.online}</p>
            </div>
            {payload && !loading && !result && index >= 0 && (
              <div className="shrink-0 text-right">
                <p className="text-xs font-bold text-stone-600">
                  {index + 1}/{total}
                </p>
                <p className="text-[10px] text-stone-500 sm:text-xs">{t.question}</p>
              </div>
            )}
          </div>

          {loading ? (
            <div role="status" className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="flex gap-1.5 rounded-full bg-[#F5E6CC] px-5 py-4">
                <span className="typing-dot" />
                <span className="typing-dot animation-delay-150" />
                <span className="typing-dot animation-delay-300" />
              </div>
              <p className="text-sm text-stone-600">{t.loading}</p>
            </div>
          ) : error && !payload ? (
            <div role="alert" className="flex flex-1 flex-col items-center justify-center p-6 text-center sm:p-10">
              <span className="text-4xl" aria-hidden="true">💬</span>
              <p className="mt-4 max-w-md text-sm leading-6 text-stone-700">{error}</p>
              <button
                type="button"
                onClick={() => setReloadKey((key) => key + 1)}
                className="mt-5 min-h-11 rounded-xl bg-[#292524] px-5 py-3 font-bold text-white transition hover:bg-[#443A36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C47752] focus-visible:ring-offset-2"
              >
                {t.retry}
              </button>
            </div>
          ) : result ? (
            <div className="chat-scroll-area flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8" aria-live="polite">
              {showSupport && (
                <div role="alert" className="mb-5 animate-fade-up rounded-2xl border border-red-300 bg-red-50 p-4 text-sm leading-6 text-red-950 motion-reduce:animate-none sm:p-5">
                  <p className="font-extrabold">{t.supportTitle}</p>
                  <p className="mt-1">{result.support_notice ?? t.supportFallback}</p>
                </div>
              )}

              <div className="animate-fade-up">
                <div className="mb-2 flex items-center gap-2">
                  <img src={brainLogo} alt="brainlogo.png" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5E6CC]" aria-hidden="true"/>
                  <span className="text-xs font-bold text-stone-500">{t.botName}</span>
                </div>
                <div className="chat-bubble-bot max-w-2xl rounded-2xl rounded-tl-sm bg-[#F5E6CC] p-4 sm:p-5">
                  <p className="text-xl font-extrabold sm:text-2xl">{t.result}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-700">{result.disclaimer}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <ScoreCard title={t.mood} scale="PHQ-9" data={result.phq9} note={t.screeningOnly} delay={100} />
                <ScoreCard title={t.anxiety} scale="GAD-7" data={result.gad7} note={t.screeningOnly} delay={250} />
              </div>

              <div className="mt-5 animate-fade-up rounded-2xl border border-[#EADCCB] bg-white p-4 text-sm leading-6 sm:p-5 motion-reduce:animate-none" style={{ animationDelay: "350ms" }}>
                <p className="font-bold text-[#A95E3C]">{t.botName}</p>
                <p className="mt-2">{result.next_step}</p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={restart}
                  className="min-h-12 rounded-xl bg-[#292524] px-5 py-3 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#443A36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C47752] focus-visible:ring-offset-2 motion-reduce:transform-none"
                >
                  ↻ {t.retake}
                </button>
                <Link
                  to="/feedback"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#C47752] px-5 py-3 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#A95E3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C47752] focus-visible:ring-offset-2 motion-reduce:transform-none"
                >
                  {t.feedback}
                </Link>
                <Link
                  to="/"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#D8C9B8] bg-white px-5 py-3 text-sm font-bold transition-colors hover:bg-[#FFF9F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C47752] focus-visible:ring-offset-2"
                >
                  {t.home}
                </Link>
              </div>
            </div>
          ) : payload && index === -1 ? (
            <div className="chat-scroll-area flex flex-1 flex-col overflow-y-auto p-4 sm:p-6 lg:p-8">
              <div className="mb-6 flex items-start gap-2.5 animate-fade-up sm:gap-3">
                <img src={brainLogo} alt="brain-logo.png"  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5E6CC] text-xl" aria-hidden="true"/>
                <div className="max-w-[88%] sm:max-w-[80%]">
                  <p className="mb-1 ml-1 text-xs font-bold text-stone-500">{t.botName}</p>
                  <div className="chat-bubble-bot rounded-2xl rounded-tl-sm bg-[#F5E6CC] p-4 sm:p-5">
                    <h1 className="text-lg font-extrabold sm:text-xl">{t.welcome}</h1>
                    <p className="mt-2 text-sm leading-6 text-stone-700">{payload.intro || t.welcome2}</p>
                    <p className="mt-2 text-sm leading-6 text-stone-700">{payload.help_text}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 flex items-start gap-2.5 animate-fade-up sm:gap-3" style={{ animationDelay: "120ms" }}>
                <img src={brainLogo} alt="brain-logo.png"  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5E6CC] text-xl" aria-hidden="true"/>
                <div className="max-w-[88%] sm:max-w-[80%]">
                  <p className="mb-1 ml-1 text-xs font-bold text-stone-500">{t.botName}</p>
                  <div className="chat-bubble-bot rounded-2xl rounded-tl-sm border border-[#EADCCB] bg-white p-4">
                    <p className="text-sm leading-6 text-stone-700">{t.privacy}</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setDirection("next");
                    setIndex(0);
                  }}
                  className="min-h-12 rounded-2xl rounded-br-sm bg-[#292524] px-5 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#443A36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C47752] focus-visible:ring-offset-2 motion-reduce:transform-none sm:px-6"
                >
                  {t.start} →
                </button>
              </div>
              <div ref={chatEndRef} />
            </div>
          ) : payload && current ? (
            <>
              <div className="chat-scroll-area flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                {/* Intro message */}
                <div className="mb-5 flex items-start gap-2.5 sm:gap-3">
                  <img src={brainLogo} alt="brain-logo.png"  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5E6CC] text-lg" aria-hidden="true"/>
                  <div className="max-w-[88%] sm:max-w-[80%]">
                    <p className="mb-1 ml-1 text-xs font-bold text-stone-500">{t.botName}</p>
                    <div className="chat-bubble-bot rounded-2xl rounded-tl-sm bg-[#F5E6CC] px-4 py-3">
                      <p className="text-sm leading-6">{payload.intro}</p>
                    </div>
                  </div>
                </div>

                {/* Conversation history */}
                {payload.questions.slice(0, index).map((question, i) => {
                  const previousAnswer = payload.frequency_options.find(
                    (option) => option.value === answers[question.id],
                  );

                  return (
                    <div key={question.id} className="mb-5 space-y-3">
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <img src={brainLogo} alt="brain-logo.png"  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5E6CC] text-lg" aria-hidden="true"/>
                        <div className="max-w-[88%] sm:max-w-[80%]">
                          <p className="mb-1 ml-1 text-xs font-bold text-stone-500">{t.botName}</p>
                          <div className="chat-bubble-bot rounded-2xl rounded-tl-sm border border-[#EADCCB] bg-white px-4 py-3">
                            <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-[#A95E3C]">
                              {getSectionName(question.scale, t)} · {i + 1}/{total}
                            </p>
                            <p className="text-sm leading-6">{question.text}</p>
                          </div>
                        </div>
                      </div>

                      {previousAnswer && (
                        <div className="flex justify-end pl-8 sm:pl-12">
                          <div className="chat-bubble-user max-w-[88%] rounded-2xl rounded-br-sm bg-[#292524] px-4 py-3 text-sm leading-6 text-white sm:max-w-[80%]">
                            {previousAnswer.label}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Current bot question */}
                <div key={current.id} className={`mb-5 flex items-start gap-2.5 sm:gap-3 ${direction === "next" ? "animate-chat-in" : "animate-chat-back"} motion-reduce:animate-none`}>
                  <img src={brainLogo} alt="brain-logo.png"  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5E6CC] text-xl" aria-hidden="true"/>
                  <div className="max-w-[92%] sm:max-w-[85%]">
                    <p className="mb-1 ml-1 text-xs font-bold text-stone-500">{t.botName}</p>
                    <div className="chat-bubble-bot rounded-2xl rounded-tl-sm border border-[#EADCCB] bg-white p-4 shadow-sm sm:p-5">
                      <p className="mb-2 inline-flex rounded-full bg-[#F5E6CC] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#70442F] sm:text-xs">
                        {getSectionName(current.scale, t)}
                      </p>
                      <h2 ref={headingRef} tabIndex={-1} className="text-base font-bold leading-7 focus:outline-none sm:text-lg sm:leading-8">
                        {current.text}
                      </h2>
                      <p className="mt-2 text-xs leading-5 text-stone-500 sm:text-sm">{t.choose}</p>
                    </div>
                  </div>
                </div>

                {/* User's selected answer */}
                {answers[current.id] !== undefined && (
                  <div className="mb-5 flex justify-end pl-8 sm:pl-12">
                    <div className="chat-bubble-user max-w-[88%] animate-fade-up rounded-2xl rounded-br-sm bg-[#292524] px-4 py-3 text-sm leading-6 text-white motion-reduce:animate-none sm:max-w-[80%]">
                      {payload.frequency_options.find((option) => option.value === answers[current.id])?.label}
                    </div>
                  </div>
                )}

                {isBotTyping && (
                  <div
                    className="mb-5 flex items-start gap-2.5 animate-fade-up sm:gap-3"
                    role="status"
                    aria-live="polite"
                  >
                    <img src={brainLogo} alt="brain-logo.png" 
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5E6CC] text-lg"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="mb-1 ml-1 text-xs font-bold text-stone-500">
                        {t.botName}
                      </p>
                      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-[#F5E6CC] px-4 py-3">
                        <span className="typing-dot" />
                        <span className="typing-dot animation-delay-150" />
                        <span className="typing-dot animation-delay-300" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Chat composer / answer options */}
              <div className="border-t border-[#EADCCB] bg-white/85 p-3 sm:p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-stone-600 sm:text-sm">{t.choose}</p>
                  <span className="shrink-0 rounded-full bg-[#F5E6CC] px-2.5 py-1 text-[10px] font-bold text-stone-600 sm:text-xs">
                    {answered}/{total}
                  </span>
                </div>

                <div
                  role="radiogroup"
                  aria-label={current.text}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3"
                >
                  {payload.frequency_options.map((option, optionIndex) => {
                    const selected = answers[current.id] === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => handleAnswer(option.value)}
                        disabled={isBotTyping || submitting}
                        className={`answer-option flex min-h-12 items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C47752] focus-visible:ring-offset-1 sm:min-h-14 sm:px-4 ${
                          selected
                            ? "border-[#A95E3C] bg-[#F3D5C1] text-[#292524] shadow-sm"
                            : "border-[#EADCCB] bg-white text-stone-700 hover:border-[#C47752] hover:bg-[#FFF9F0]"
                        }`}
                        style={{ animationDelay: `${optionIndex * 45}ms` }}
                      >
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-extrabold ${
                          selected
                            ? "border-[#A95E3C] bg-[#A95E3C] text-white"
                            : "border-[#D8C9B8] bg-[#FFF9F0] text-stone-600"
                        }`}>
                          {selected ? "✓" : option.value}
                        </span>
                        <span className="min-w-0 flex-1 leading-5">{option.label}</span>
                      </button>
                    );
                  })}
                </div>

                {error && (
                  <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-800">
                    {error}
                  </p>
                )}

                <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    disabled={index === 0 || isBotTyping || submitting}
                    onClick={() => go(-1)}
                    className="min-h-11 rounded-xl border border-[#D8C9B8] bg-white px-4 py-2.5 text-sm font-bold transition-colors hover:bg-[#FFF9F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C47752] disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-28"
                  >
                    ← {t.previous}
                  </button>

                  <div
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#F5E6CC] px-4 py-3 text-center text-xs font-semibold text-stone-700 sm:text-sm"
                    role="status"
                    aria-live="polite"
                  >
                    {isBotTyping || submitting ? (
                      <>
                        <span className="typing-dot" />
                        <span className="typing-dot animation-delay-150" />
                        <span className="typing-dot animation-delay-300" />
                        <span className="ml-1">
                          {submitting ? t.loading : `${t.botName}...`}
                        </span>
                      </>
                    ) : answers[current.id] !== undefined ? (
                      <span>✓ Answer received — next question appears automatically</span>
                    ) : (
                      <span>{t.choose}</span>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-center text-[11px] leading-5 text-stone-500 sm:text-xs">
                  {payload.notice}
                </p>
              </div>
            </>
          ) : null}
        </section>

        <footer className="px-2 py-4 text-center text-[11px] leading-5 text-stone-600 sm:py-5 sm:text-xs">
          {t.footer}
        </footer>
      </div>
    </main>
  );
}

function useCountUp(target: number, delay: number) {
  const [value, setValue] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      setFinished(true);
      return;
    }

    setFinished(false);
    let frame = 0;
    let timeout = 0;
    let startTime = 0;

    const animate = (now: number) => {
      if (!startTime) startTime = now;

      const progress = Math.min(1, (now - startTime) / 850);
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setFinished(true);
      }
    };

    timeout = window.setTimeout(() => {
      frame = requestAnimationFrame(animate);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [target, delay]);

  return { value, finished };
}

function ScoreCard({
  title,
  scale,
  data,
  note,
  delay,
}: {
  title: string;
  scale: string;
  data: ScaleResult;
  note: string;
  delay: number;
}) {
  const { value, finished } = useCountUp(data.score, delay);
  const width = Math.min(100, Math.max(0, (data.score / data.max_score) * 100));

  return (
    <article
      className="animate-fade-up min-w-0 rounded-2xl border border-[#D9A17A]/60 bg-white p-4 shadow-sm motion-reduce:animate-none"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-xs font-extrabold uppercase tracking-wider text-[#A95E3C]">{scale}</p>
      <h3 className="mt-1 text-base font-bold leading-6 sm:text-lg">{title}</h3>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-extrabold tabular-nums" aria-label={`${data.score} / ${data.max_score}`}>
          {value}
        </span>
        <span className="text-sm text-stone-500">/ {data.max_score}</span>
      </div>

      <div
        className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#F5E6CC]"
        role="progressbar"
        aria-label={title}
        aria-valuemin={0}
        aria-valuemax={data.max_score}
        aria-valuenow={finished ? data.score : value}
      >
        <div
          className="h-full rounded-full bg-[#C47752] transition-[width] duration-700 ease-out motion-reduce:transition-none"
          style={{ width: `${finished ? width : (value / data.max_score) * 100}%` }}
        />
      </div>

      <p className="mt-3 wrap-break-words font-bold leading-6">{data.label}</p>
      <p className="mt-2 text-xs leading-5 text-stone-500">{note}</p>
    </article>
  );
}