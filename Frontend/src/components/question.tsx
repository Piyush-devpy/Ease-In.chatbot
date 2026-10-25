import { useState } from "react";
import { Link } from "react-router-dom";

type Assessment = "PHQ-9" | "GAD-7";

type Question = {
  id: string;
  assessment: Assessment;
  text: string;
};

const questions: Question[] = [
  // PHQ-9: Depression symptom screening
  {
    id: "phq1",
    assessment: "PHQ-9",
    text: "Little interest or pleasure in doing things",
  },
  {
    id: "phq2",
    assessment: "PHQ-9",
    text: "Feeling down, depressed, or hopeless",
  },
  {
    id: "phq3",
    assessment: "PHQ-9",
    text: "Trouble falling or staying asleep, or sleeping too much",
  },
  {
    id: "phq4",
    assessment: "PHQ-9",
    text: "Feeling tired or having little energy",
  },
  {
    id: "phq5",
    assessment: "PHQ-9",
    text: "Poor appetite or overeating",
  },
  {
    id: "phq6",
    assessment: "PHQ-9",
    text: "Feeling bad about yourself, or that you are a failure or have let yourself or your family down",
  },
  {
    id: "phq7",
    assessment: "PHQ-9",
    text: "Trouble concentrating on things, such as reading or watching television",
  },
  {
    id: "phq8",
    assessment: "PHQ-9",
    text: "Moving or speaking so slowly that other people could have noticed, or being unusually restless",
  },
  {
    id: "phq9",
    assessment: "PHQ-9",
    text: "Thoughts that you would be better off dead or of hurting yourself in some way",
  },

  // GAD-7: Anxiety symptom screening
  {
    id: "gad1",
    assessment: "GAD-7",
    text: "Feeling nervous, anxious, or on edge",
  },
  {
    id: "gad2",
    assessment: "GAD-7",
    text: "Not being able to stop or control worrying",
  },
  {
    id: "gad3",
    assessment: "GAD-7",
    text: "Worrying too much about different things",
  },
  {
    id: "gad4",
    assessment: "GAD-7",
    text: "Trouble relaxing",
  },
  {
    id: "gad5",
    assessment: "GAD-7",
    text: "Being so restless that it is hard to sit still",
  },
  {
    id: "gad6",
    assessment: "GAD-7",
    text: "Becoming easily annoyed or irritable",
  },
  {
    id: "gad7",
    assessment: "GAD-7",
    text: "Feeling afraid, as if something awful might happen",
  },
];

const options = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

function getSeverity(
  score: number,
  assessment: Assessment
): string {
  if (score < 5) return "Minimal";
  if (score < 10) return "Mild";
  if (score < 15) return "Moderate";

  if (assessment === "PHQ-9" && score < 20) {
    return "Moderately severe";
  }

  return "Severe";
}

function getRecommendation(score: number): string {
  if (score >= 10) {
    return "Consider arranging a consultation with a qualified mental health professional.";
  }

  if (score >= 5) {
    return "If these symptoms persist, affect daily life, or concern you, consider speaking with a professional.";
  }

  return "This score is in the minimal symptom range. It does not rule out a mental health concern. Seek support if you are worried or struggling.";
}

function Questions() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  const question = questions[currentIndex];
  const isPHQ = question.assessment === "PHQ-9";
  const sectionQuestions = questions.filter(
    (q) => q.assessment === question.assessment
  );

  const sectionIndex = sectionQuestions.findIndex(
    (q) => q.id === question.id
  );

  const progress = ((currentIndex + 1) / questions.length) * 100;

  const phqScore = questions
    .filter((q) => q.assessment === "PHQ-9")
    .reduce((total, q) => total + (answers[q.id] ?? 0), 0);

  const gadScore = questions
    .filter((q) => q.assessment === "GAD-7")
    .reduce((total, q) => total + (answers[q.id] ?? 0), 0);

  const selfHarmFlag = (answers.phq9 ?? 0) > 0;

  function handleNext() {
    if (answers[question.id] === undefined) return;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
    } else {
      setFinished(true);
    }
  }

  function handlePrevious() {
    if (currentIndex > 0) {
      setCurrentIndex((index) => index - 1);
    }
  }

  if (finished) {
    return (
      <main className="min-h-screen w-full overflow-x-clip bg-[#F5E6CC] px-3 py-6 [padding-bottom:env(safe-area-inset-bottom)] xs:px-4 sm:px-6 sm:py-10 lg:py-12">
        <div className="mx-auto w-full min-w-0 max-w-4xl">
          <header className="result-enter mb-6 text-center sm:mb-8">
            <p className="break-words text-xs font-bold uppercase tracking-[0.14em] text-[#C47752] sm:text-sm sm:tracking-[0.2em]">
              Ease-In · Your results
            </p>
            <h1 className="mt-3 break-words text-2xl font-extrabold leading-tight text-[#292524] sm:text-3xl md:text-4xl">
              Your wellbeing summary
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#6B625A] sm:text-base">
              Thank you for checking in with yourself. These screening
              results are not a diagnosis.
            </p>
          </header>

          <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
            <article className="result-card min-w-0 break-words rounded-2xl border border-[#E2D4C4] bg-white p-4 shadow-lg sm:rounded-3xl sm:p-6 md:p-8">
              <p className="break-words text-xs font-bold uppercase tracking-wider text-[#C47752] sm:text-sm sm:tracking-widest">
                Depression screening
              </p>
              <h2 className="mt-2 text-xl font-extrabold text-[#292524] sm:text-2xl">
                PHQ-9
              </h2>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-[#292524] sm:text-5xl">
                  {phqScore}
                </span>
                <span className="text-[#6B625A]">/ 27</span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E8DDD0]">
                <div
                  className="score-fill h-full rounded-full bg-[#C47752]"
                  style={{ width: `${(phqScore / 27) * 100}%` }}
                />
              </div>

              <p className="mt-4 inline-flex rounded-full bg-[#F8E9DC] px-3 py-1 text-sm font-semibold text-[#854A30]">
                {getSeverity(phqScore, "PHQ-9")}
              </p>

              <p className="mt-4 text-sm leading-6 text-[#6B625A]">
                {getRecommendation(phqScore)}
              </p>
            </article>

            <article className="result-card min-w-0 break-words rounded-2xl border border-[#E2D4C4] bg-white p-4 shadow-lg sm:rounded-3xl sm:p-6 md:p-8">
              <p className="break-words text-xs font-bold uppercase tracking-wider text-[#C47752] sm:text-sm sm:tracking-widest">
                Anxiety screening
              </p>
              <h2 className="mt-2 text-xl font-extrabold text-[#292524] sm:text-2xl">
                GAD-7
              </h2>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-[#292524] sm:text-5xl">
                  {gadScore}
                </span>
                <span className="text-[#6B625A]">/ 21</span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E8DDD0]">
                <div
                  className="score-fill h-full rounded-full bg-[#C47752]"
                  style={{ width: `${(gadScore / 21) * 100}%` }}
                />
              </div>

              <p className="mt-4 inline-flex rounded-full bg-[#F8E9DC] px-3 py-1 text-sm font-semibold text-[#854A30]">
                {getSeverity(gadScore, "GAD-7")}
              </p>

              <p className="mt-4 text-sm leading-6 text-[#6B625A]">
                {getRecommendation(gadScore)}
              </p>
            </article>
          </div>

          <section className="result-card mt-4 min-w-0 break-words rounded-2xl border border-[#E2D4C4] bg-white p-4 shadow-lg sm:mt-5 sm:rounded-3xl sm:p-6 md:p-8">
            <h2 className="break-words text-lg font-bold text-[#292524] sm:text-xl md:text-2xl">
              What should you do next?
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#6B625A]">
              A score alone cannot determine whether you need a doctor.
              Your symptoms, daily functioning, personal circumstances,
              and concerns also matter. You can speak with a qualified
              healthcare professional whenever you feel you need support.
            </p>

            {selfHarmFlag && (
              <div
                role="alert"
                className="mt-5 rounded-2xl border border-[#B45309] bg-[#FFF7ED] p-4"
              >
                <h3 className="font-bold text-[#9A3412]">
                  Please take this answer seriously
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#7C2D12]">
                  You indicated thoughts of being better off dead or
                  hurting yourself. Please reach out promptly to a
                  qualified mental health professional or a trusted
                  person. This answer does not by itself establish
                  immediate danger, but it deserves follow-up.
                </p>
                <p className="mt-3 text-sm leading-6 text-[#7C2D12]">
                  In India, you can call Tele-MANAS at{" "}
                  <a
                    className="font-bold underline"
                    href="tel:14416"
                  >
                    14416
                  </a>{" "}
                  for mental health support. If you are in immediate
                  danger or may act on these thoughts, call{" "}
                  <a
                    className="font-bold underline"
                    href="tel:112"
                  >
                    112
                  </a>{" "}
                  or go to the nearest emergency department.
                </p>
              </div>
            )}

            <div className="mt-6 rounded-2xl bg-[#F8F1E7] p-4">
              <h3 className="font-semibold text-[#292524]">
                Remember
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#6B625A]">
                This tool is intended for self-reflection and screening.
                It cannot diagnose depression or an anxiety disorder,
                and a low score does not mean that support is unnecessary.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:flex sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                to="/feedback"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#C47752] px-6 py-3 text-center font-semibold text-white transition hover:bg-[#A85F3D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#292524] sm:w-auto"
              >
                Give Feedback
              </Link>

              <Link
                to="/"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[#D6C5B3] bg-[#F5E6CC] px-6 py-3 text-center font-semibold text-[#292524] transition hover:bg-[#EED5BD] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#292524] sm:w-auto"
              >
                Move to Home
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-clip bg-[#F5E6CC] px-3 py-5 [padding-bottom:env(safe-area-inset-bottom)] xs:px-4 sm:px-6 sm:py-10 lg:py-12">
      <div className="mx-auto w-full min-w-0 max-w-3xl">
        <header className="question-enter mb-6 min-w-0 text-center sm:mb-9">
          <p className="break-words text-[11px] font-bold uppercase tracking-[0.12em] text-[#C47752] sm:text-sm sm:tracking-[0.2em]">
            Ease-In · Mental Wellbeing
          </p>
          <h1 className="mt-3 break-words text-2xl font-extrabold leading-tight text-[#292524] sm:text-4xl md:text-5xl">
            Check in with yourself
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#6B625A] sm:text-base">
            Answer based on how you have been feeling over the last
            two weeks. Choose the response that fits best.
          </p>
        </header>

        <section
          key={question.id}
          aria-labelledby="question-title"
          className="question-card question-enter w-full min-w-0 rounded-2xl border border-[#E2D4C4] bg-white p-4 shadow-xl sm:rounded-3xl sm:p-7 md:p-10"
        >
          <div className="mb-7 sm:mb-8">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-[11px] sm:text-sm">
              <span className="font-bold tracking-wide text-[#292524]">
                {question.assessment} · QUESTION {sectionIndex + 1} OF{" "}
                {sectionQuestions.length}
              </span>
              <span className="font-medium text-[#6B625A]">
                Overall {currentIndex + 1} of {questions.length}
              </span>
            </div>

            <div
              className="h-2 overflow-hidden rounded-full bg-[#E8DDD0]"
              role="progressbar"
              aria-label="Overall assessment progress"
              aria-valuemin={0}
              aria-valuemax={questions.length}
              aria-valuenow={currentIndex + 1}
            >
              <div
                className="progress-fill h-full rounded-full bg-[#C47752]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isPHQ
                    ? "bg-[#C47752] text-white"
                    : "bg-[#F5E6CC] text-[#6B625A]"
                }`}
              >
                PHQ-9
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  !isPHQ
                    ? "bg-[#C47752] text-white"
                    : "bg-[#F5E6CC] text-[#6B625A]"
                }`}
              >
                GAD-7
              </span>
            </div>
          </div>

          <h2
            id="question-title"
            className="break-words text-lg font-bold leading-relaxed text-[#292524] sm:text-2xl"
          >
            {question.text}
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#6B625A]">
            Over the last two weeks, how often have you been bothered
            by this?
          </p>

          <div className="mt-6 space-y-3 sm:mt-7">
            {options.map((option, index) => {
              const selected = answers[question.id] === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    setAnswers((previous) => ({
                      ...previous,
                      [question.id]: option.value,
                    }))
                  }
                  className={`answer-option flex min-h-14 w-full items-center gap-3 rounded-xl border p-3 text-left sm:gap-4 sm:rounded-2xl sm:p-4 ${
                    selected
                      ? "answer-selected border-[#C47752] bg-[#F8E9DC] ring-1 ring-[#C47752]"
                      : "border-[#E2D4C4] bg-[#FFFDFA] hover:border-[#C47752] hover:bg-[#FFF7F0]"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold sm:h-8 sm:w-8 ${
                      selected
                        ? "border-[#C47752] bg-[#C47752] text-white"
                        : "border-[#B8A99A] text-[#6B625A]"
                    }`}
                  >
                    {selected ? "✓" : String.fromCharCode(65 + index)}
                  </span>

                  <span className="text-sm font-medium leading-5 text-[#292524] sm:text-base sm:leading-6">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#EEE4D8] pt-5 min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-between sm:mt-8 sm:pt-6">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="min-h-11 w-full rounded-xl border border-[#D6C5B3] px-3 py-2.5 text-sm font-semibold text-[#292524] transition hover:bg-[#F5E6CC] disabled:cursor-not-allowed disabled:opacity-40 min-[360px]:w-auto sm:px-5 sm:text-base"
            >
              ← Previous
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={answers[question.id] === undefined}
              className="min-h-11 w-full rounded-xl bg-[#C47752] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#A85F3D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#292524] disabled:cursor-not-allowed disabled:opacity-40 min-[360px]:w-auto sm:px-7 sm:text-base"
            >
              {currentIndex === questions.length - 1
                ? "View results"
                : "Next →"}
            </button>
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-[#85766A]">
            Your responses are used for this on-screen demo only.
            This assessment is not a medical diagnosis.
          </p>
        </section>
      </div>
    </main>
  );
}

export default Questions;
