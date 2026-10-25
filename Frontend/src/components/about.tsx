
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function About() {
  const aboutRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = aboutRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(".reveal");

    // Keep content visible when reduced motion is preferred
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    // Fallback for browsers without IntersectionObserver
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px 0px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Navbar — unchanged */}
      <nav className="mx-8 mt-4 flex items-center justify-between rounded-2xl bg-[#292524] px-8 py-4 shadow-lg">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img
            className="h-8 w-8 shrink-0 object-contain hidden md:block"
            src="./artificial-intelligence.webp"
            alt="logo.png"
          />
          <h3 className="text-[#F5E6CC] transition-colors duration-200 hover:text-[#D9A17A] hidden md:block">
            Ease In
          </h3>
        </Link>

        <ul className="flex items-center gap-5">
          <li>
            <Link
              to="/"
              className="text-[#F5E6CC] transition-colors duration-200 hover:text-[#D9A17A]"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/feedback"
              className="text-[#F5E6CC] transition-colors duration-200 hover:text-[#D9A17A]"
              onClick={() => {
                setTimeout(() => {
                  document.getElementById("Feedback")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }, 100);
              }}
            >
              Feedback
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              className="text-[#F5E6CC] transition-colors duration-200 hover:text-[#D9A17A]"
              onClick={() => {
                setTimeout(() => {
                  document.getElementById("About")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }, 100);
              }}
            >
              About
            </Link>
          </li>

          <li>
            <Link
              to="/questions"
              className="inline-block rounded-xl border-2 border-[#D9A17A] px-5 py-2 font-semibold text-[#F5E6CC] transition-all duration-300 hover:bg-[#D9A17A] hover:text-[#292524] hover:shadow-md hover:-translate-y-0.5"
              onClick={() => {
                setTimeout(() => {
                  document.getElementById("Login")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }, 100);
              }}
            >
              Start
            </Link>
          </li>

          <li>
            <Link
              to="/donate"
              className="hidden md:inline-block rounded-xl bg-[#C47752] px-5 py-2 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#AD6342] hover:shadow-lg hover:-translate-y-0.5"
              onClick={() => {
                setTimeout(() => {
                  document.getElementById("Register")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }, 100);
              }}
            >
              Donate
            </Link>
          </li>
        </ul>
      </nav>

      {/* Animated About content */}
      <main ref={aboutRef} className="about-animation-page">
        {/* About Ease-In */}
        <section
          id="About"
          className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14"
        >
          <div className="about-content-card reveal">
            <p className="text-sm font-bold uppercase tracking-widest text-[#C47752]">
              About Ease-In
            </p>

            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              A simple first step toward understanding yourself.
            </h2>

            <p className="mt-5 leading-7 text-[#6B625A]">
              College life can bring academic pressure, personal
              challenges, uncertainty, and changes in everyday routines.
              Sometimes it can be difficult to understand what you are
              feeling or where to begin seeking support.
            </p>

            <p className="mt-4 leading-7 text-[#6B625A]">
              Ease-In offers a guided, conversational self-assessment
              experience using standardized screening questionnaires.
              It helps users reflect on their responses and understand
              possible next steps, from self-care resources to
              professional support.
            </p>

            <p className="mt-4 leading-7 text-[#6B625A]">
              Our goal is to make mental well-being information more
              approachable and encourage people to seek help when they
              need it.
            </p>
          </div>
        </section>

        {/* PHQ-9 and GAD-7 */}
        <section className="bg-[#EED5BD]/50 px-4 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="reveal mx-auto mb-10 max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-[#8D4D35]">
                Our Screening Tools
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Understanding PHQ-9 and GAD-7
              </h2>

              <p className="mt-4 leading-7 text-[#6B625A]">
                These established questionnaires help screen for
                symptoms. They can help identify when further assessment
                or support may be useful.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* PHQ-9 */}
              <article className="about-tool-card reveal">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EED5BD] text-3xl text-[#8D4D35]">
                  ♡
                </div>

                <p className="text-sm font-bold uppercase tracking-wider text-[#A85F3F]">
                  Screening Tool 01
                </p>

                <h3 className="mt-2 text-2xl font-bold">PHQ-9</h3>

                <p className="mt-1 font-semibold text-[#8D4D35]">
                  Patient Health Questionnaire-9
                </p>

                <p className="mt-4 leading-7 text-[#6B625A]">
                  PHQ-9 is a nine-item questionnaire used to screen for
                  depressive symptoms and assess their frequency over
                  the previous two weeks.
                </p>

                <h4 className="mt-5 font-bold">
                  What does it explore?
                </h4>

                <ul className="mt-3 space-y-2 text-sm leading-6 text-[#6B625A]">
                  <li>• Interest or enjoyment in everyday activities</li>
                  <li>• Mood and feelings of hopelessness</li>
                  <li>• Sleep, energy, and appetite changes</li>
                  <li>• Concentration and other depressive symptoms</li>
                </ul>

                <div className="mt-6 rounded-xl bg-[#F5E6CC] p-4">
                  <p className="text-sm leading-6 text-[#6B625A]">
                    <strong className="text-[#292524]">Purpose:</strong>{" "}
                    Help identify depressive symptoms that may benefit
                    from further evaluation.
                  </p>
                </div>
              </article>

              {/* GAD-7 */}
              <article className="about-tool-card reveal">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EED5BD] text-3xl text-[#8D4D35]">
                  〰
                </div>

                <p className="text-sm font-bold uppercase tracking-wider text-[#A85F3F]">
                  Screening Tool 02
                </p>

                <h3 className="mt-2 text-2xl font-bold">GAD-7</h3>

                <p className="mt-1 font-semibold text-[#8D4D35]">
                  Generalized Anxiety Disorder-7
                </p>

                <p className="mt-4 leading-7 text-[#6B625A]">
                  GAD-7 is a seven-item questionnaire used to screen
                  for anxiety symptoms and assess their frequency over
                  the previous two weeks.
                </p>

                <h4 className="mt-5 font-bold">
                  What does it explore?
                </h4>

                <ul className="mt-3 space-y-2 text-sm leading-6 text-[#6B625A]">
                  <li>• Feeling nervous or on edge</li>
                  <li>• Difficulty controlling worry</li>
                  <li>• Worrying about different things</li>
                  <li>• Restlessness, irritability, and fear</li>
                </ul>

                <div className="mt-6 rounded-xl bg-[#F5E6CC] p-4">
                  <p className="text-sm leading-6 text-[#6B625A]">
                    <strong className="text-[#292524]">Purpose:</strong>{" "}
                    Help identify anxiety symptoms that may benefit
                    from further evaluation.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
          <div className="reveal text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-[#C47752]">
              How It Works
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Your journey with Ease-In
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <article className="about-step-card reveal">
              <span className="about-step-number">01</span>
              <h3 className="mt-4 text-lg font-bold">Begin</h3>
              <p className="mt-2 text-sm leading-6 text-[#6B625A]">
                Open the assessment and follow the guided questions.
              </p>
            </article>

            <article className="about-step-card reveal">
              <span className="about-step-number">02</span>
              <h3 className="mt-4 text-lg font-bold">Reflect</h3>
              <p className="mt-2 text-sm leading-6 text-[#6B625A]">
                Answer based on your experiences over the specified period.
              </p>
            </article>

            <article className="about-step-card reveal">
              <span className="about-step-number">03</span>
              <h3 className="mt-4 text-lg font-bold">Understand</h3>
              <p className="mt-2 text-sm leading-6 text-[#6B625A]">
                Review the screening result and what it may indicate.
              </p>
            </article>

            <article className="about-step-card reveal">
              <span className="about-step-number">04</span>
              <h3 className="mt-4 text-lg font-bold">Find Support</h3>
              <p className="mt-2 text-sm leading-6 text-[#6B625A]">
                Explore appropriate self-help or professional resources.
              </p>
            </article>
          </div>
        </section>

        {/* Privacy and Disclaimer */}
        <section className="px-4 pb-14 sm:px-8 sm:pb-20">
          <div className="about-content-card reveal mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Your well-being comes first
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-bold">Privacy matters</h3>
                <p className="mt-2 text-sm leading-6 text-[#6B625A]">
                  Ease-In is designed to support anonymous use without
                  requiring a personal login. Actual privacy depends on
                  how the application, hosting, and backend are configured.
                </p>
              </div>

              <div>
                <h3 className="font-bold">Not a diagnosis</h3>
                <p className="mt-2 text-sm leading-6 text-[#6B625A]">
                  PHQ-9 and GAD-7 are screening tools, not diagnostic
                  tests. Results cannot confirm a mental health condition
                  or replace an evaluation by a qualified professional.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-[#D9A17A]/50 bg-[#EED5BD]/60 p-4">
              <p className="text-sm leading-6 text-[#6B625A]">
                <strong className="text-[#292524]">Important:</strong>{" "}
                If you are struggling or symptoms are affecting everyday
                life, consider speaking with a qualified mental health
                professional. If you may be in immediate danger, contact
                local emergency services or a trusted person who can help
                you get urgent support.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default About;
