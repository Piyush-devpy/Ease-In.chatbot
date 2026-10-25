import { useState } from "react";
import {Link} from "react-router-dom"

interface FormProp {
  email: string;
  name: string;
  text: string;
}

function Feedback() {
  const [formData, setFormData] = useState<FormProp>({
    email: "",
    name: "",
    text: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <>

        <nav className="mx-8 mt-4 flex items-center justify-between rounded-2xl bg-[#292524] px-8 py-4 shadow-lg">

            <Link to="/" className="flex shrink-0 items-center gap-2">
            <img className="h-8 w-8 shrink-0 object-contain hidden md:block" src="./artificial-intelligence.webp" alt="logo.png"></img>
            <h3 className="text-[#F5E6CC] transition-colors duration-200 hover:text-[#D9A17A] hidden md:block">Ease In</h3>
        </Link>

            <ul className="flex items-center gap-5">
                <li>
                    <Link to="/" className="text-[#F5E6CC] transition-colors duration-200 hover:text-[#D9A17A]">Home</Link>
                </li>
                <li>
                    <Link to="/feedback"
                      className="text-[#F5E6CC] transition-colors duration-200 hover:text-[#D9A17A]"
                      onClick={()=>{

                        setTimeout(()=>{
                            document.getElementById("Feedback")?.scrollIntoView({behavior:"smooth",});
                        },100)
                      }}>Feedback</Link>
                </li>
                <li>
                    <Link to="/about"
                      className="text-[#F5E6CC] transition-colors duration-200 hover:text-[#D9A17A]"
                      onClick={()=>{
                        

                        setTimeout(()=>{
                            document.getElementById("About")?.scrollIntoView({behavior:"smooth"});
                        },100)
                      }}>About</Link>
                </li>
                <li>
                    <Link to="/questions"
                    className="inline-block rounded-xl border-2 border-[#D9A17A] px-5 py-2 font-semibold text-[#F5E6CC] transition-all duration-300 hover:bg-[#D9A17A] hover:text-[#292524] hover:shadow-md hover:-translate-y-0.5"
                    onClick={()=>{
                        

                        setTimeout(()=>{
                            document.getElementById("Login")?.scrollIntoView({behavior:"smooth"});
                        },100)
                    }}>Start</Link>
                </li>
                <li>
                    <Link to="/donate"
                    className="hidden md:inline-block rounded-xl bg-[#C47752] px-5 py-2 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#AD6342] hover:shadow-lg hover:-translate-y-0.5"
                    onClick={()=>{
                        

                        setTimeout(()=>{
                            document.getElementById("Register")?.scrollIntoView({behavior:"smooth"});
                        },100)
                    }}>Donate</Link>
                </li>
            </ul>
        </nav>
            
    <div className="min-h-screen bg-[#F5E6CC] text-[#292524]">
      {/* Feedback Section */}
      <section className="feedback-section flex min-h-[80vh] items-center justify-center px-5 py-16">
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

            <button
              type="submit"
              className="feedback-button w-full rounded-xl bg-[#C47752] px-6 py-3.5 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#A85F3F] hover:shadow-lg active:translate-y-0"
            >
              Send Feedback
            </button>
          </form>

          <p className="mt-5 text-center text-xs leading-5 text-[#786D62]">
            Thank you for helping us make Ease-In better.
          </p>
        </div>
      </section>
    </div>
    </>
  );
}

export default Feedback;