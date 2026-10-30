
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface FormProp {
  email: string;
  name: string;
  text: string;
}

interface FeedbackItem {
  id: number;
  name: string;
  text: string;
  created_at?: string;
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const API_URL = `${API_BASE_URL}/api/feedback`;

function Feedback() {
  const [formData, setFormData] = useState<FormProp>({
    email: "",
    name: "",
    text: "",
  });

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch feedback stored in the database
  const loadFeedbacks = async () => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Could not load feedback.");
      }

      setFeedbacks(result.feedbacks);
      setErrorMessage("");
    } catch {
      setErrorMessage(
        "Feedback could not be loaded. Please check your connection and try again."
      );
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  // Initial fetch when the page opens
  useEffect(() => {
    const controller = new AbortController();

    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error("Could not load feedback.");
        }

        setFeedbacks(result.feedbacks);
        setErrorMessage("");
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        setErrorMessage(
          "Feedback could not be loaded. Please check your connection and try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoadingFeedbacks(false);
        }
      }
    };

    void fetchFeedbacks();

    return () => {
      controller.abort();
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setSuccessMessage("");
    setErrorMessage("");
  };

  // Submit feedback to Flask backend
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Feedback submission failed."
        );
      }

      setSuccessMessage(
        "Thank you! Your feedback has been saved successfully."
      );

      setFormData({
        email: "",
        name: "",
        text: "",
      });

      // Refresh feedback cards after submission
      await loadFeedbacks();
    } catch {
      setErrorMessage(
        "Unable to send feedback. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <nav className="mx-3 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#292524] px-4 py-4 shadow-lg sm:mx-8 sm:flex-nowrap sm:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img
            className="hidden h-8 w-8 shrink-0 object-contain md:block"
            src="./artificial-intelligence.webp"
            alt="Ease In logo"
          />

          <h3 className="hidden text-[#F5E6CC] transition-colors duration-200 hover:text-[#D9A17A] md:block">
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
                  document
                    .getElementById("Feedback")
                    ?.scrollIntoView({ behavior: "smooth" });
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
                  document
                    .getElementById("About")
                    ?.scrollIntoView({ behavior: "smooth" });
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
                  document
                    .getElementById("Login")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            >
              Start
            </Link>
          </li>

          <li>
            <Link
              to="/donate"
              className="hidden rounded-xl bg-[#C47752] px-5 py-2 font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#AD6342] hover:shadow-lg md:inline-block"
              onClick={() => {
                setTimeout(() => {
                  document
                    .getElementById("Register")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            >
              Donate
            </Link>
          </li>
        </ul>
      </nav>

      <div className="min-h-screen bg-[#F5E6CC] text-[#292524]">
        {/* Feedback Form Section */}
        <section
          id="Feedback"
          className="feedback-section flex min-h-[80vh] items-center justify-center px-5 py-16"
        >
          <div className="feedback-card w-full max-w-xl rounded-3xl border border-[#D9A17A]/40 bg-white/70 p-6 shadow-xl backdrop-blur-sm sm:p-10">
            <div className="mb-8 text-center">
              <p className="mb-3 inline-block rounded-full bg-[#EED5BD] px-4 py-2 text-sm font-semibold text-[#8D4D35]">
                Your voice matters
              </p>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Share Your Feedback
                <span className="text-[#C47752]">!</span>
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#6B625A] sm:text-base">
                Help us make Ease-In a more supportive space for everyone.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="feedback-input w-full rounded-xl border border-[#D6C3AE] bg-[#FFFCF7] px-4 py-3 outline-none transition-all duration-300 placeholder:text-[#A59A8D] focus:border-[#C47752] focus:ring-4 focus:ring-[#C47752]/15"
                />
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="feedback-input w-full rounded-xl border border-[#D6C3AE] bg-[#FFFCF7] px-4 py-3 outline-none transition-all duration-300 placeholder:text-[#A59A8D] focus:border-[#C47752] focus:ring-4 focus:ring-[#C47752]/15"
                />
              </div>

              {/* Feedback */}
              <div>
                <label
                  htmlFor="text"
                  className="mb-2 block text-sm font-semibold"
                >
                  Feedback
                </label>

                <textarea
                  id="text"
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  placeholder="Tell us what you think..."
                  rows={5}
                  required
                  className="feedback-input w-full resize-y rounded-xl border border-[#D6C3AE] bg-[#FFFCF7] px-4 py-3 outline-none transition-all duration-300 placeholder:text-[#A59A8D] focus:border-[#C47752] focus:ring-4 focus:ring-[#C47752]/15"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="feedback-button w-full rounded-xl bg-[#C47752] px-6 py-3.5 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#A85F3F] hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send Feedback"}
              </button>
            </form>

            {/* Success Message */}
            {successMessage && (
              <p
                role="status"
                className="mt-4 text-center text-sm font-semibold text-green-800"
              >
                {successMessage}
              </p>
            )}

            {/* Error Message */}
            {errorMessage && (
              <p
                role="alert"
                className="mt-4 wrap-break-words text-center text-sm font-semibold text-red-700"
              >
                {errorMessage}
              </p>
            )}

            <p className="mt-5 text-center text-xs leading-5 text-[#786D62]">
              Thank you for helping us make Ease-In better.
            </p>
          </div>
        </section>

        {/* Community Feedback */}
        <section
          id="feedback-list"
          className="mx-auto w-full max-w-6xl overflow-hidden px-4 pb-16 pt-8 sm:px-6 lg:px-8"
        >
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#A85F3F]">
              Community voices
            </p>

            <h2 className="text-2xl font-bold sm:text-3xl">
              What People Are Saying
            </h2>

            <p className="mt-2 text-sm text-[#6B625A] sm:text-base">
              Every suggestion helps us make Ease-In better.
            </p>
          </div>

          {/* Loading */}
          {loadingFeedbacks ? (
            <div
              className="py-10 text-center text-[#6B625A]"
              role="status"
            >
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#D9A17A]/30 border-t-[#C47752]" />
              Loading feedback...
            </div>
          ) : feedbacks.length === 0 ? (
            /* Empty State */
            <div className="rounded-2xl border border-[#D9A17A]/50 bg-white/60 p-8 text-center">
              <h3 className="font-semibold">No feedback yet.</h3>

              <p className="mt-2 text-sm text-[#6B625A]">
                Be the first to share your experience!
              </p>
            </div>
          ) : (
            /* Automatic Sideways Marquee */
            <div
              className="feedback-marquee"
              aria-label="Community feedback"
            >
              <div
                className={`feedback-marquee-track ${
                  feedbacks.length > 1 ? "is-animated" : ""
                }`}
              >
                {/* FIX: Duplicate group only when multiple feedbacks exist */}
                {(feedbacks.length > 1 ? [0, 1] : [0]).map((copy) => (
                  <div
                    key={copy}
                    className="feedback-marquee-group"
                    aria-hidden={copy === 1 ? true : undefined}
                  >
                    {feedbacks.map((item) => (
                      <article
                        key={`${copy}-${item.id}`}
                        className="feedback-display-card"
                      >
                        <div className="mb-3 flex items-center gap-3">
                          {/* Initial Avatar */}
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#292524] text-lg font-bold text-[#F5E6CC]">
                            {item.name.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="wrap-break-words font-bold text-[#292524]">
                              {item.name}
                            </h3>

                            {item.created_at && (
                              <p className="text-xs text-[#786D62]">
                                {new Date(
                                  item.created_at
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Feedback Text */}
                        <p className="whitespace-pre-wrap wrap-break-words text-sm leading-7 text-[#51483F]">
                          {item.text}
                        </p>
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default Feedback;
