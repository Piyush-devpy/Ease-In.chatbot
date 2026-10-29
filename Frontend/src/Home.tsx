import { Link } from "react-router-dom";
import CursorBrain from "./components/Cursorbrain";


function Home(){
    return(
     <>
        <nav className="mx-3 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#292524] px-4 py-4 shadow-lg sm:mx-8 sm:px-8">

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

        <section className="mx-auto flex min-h-[35vh] max-w-5xl flex-col items-center justify-center px-6 py-16 text-center animate-[fadeSlideUp_0.8s_ease-out_both]">
            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-[#292524] sm:text-5xl md:text-6xl">Feeling Mentally-ill??</h1>
            <br></br>
            <h4 className="mb-4 rounded-full border border-[#D9A17A] bg-[#EED5BD] px-5 py-2 text-sm font-semibold tracking-wide text-[#8B4A32]">Check Your Mental Well-Being Score.</h4>
        </section>

        <main className="mt-1 w-full">           
            <CursorBrain/>            
            <svg
             className="pointer-events-none absolute inset-0 z-20 h-full w-full hidden md:block animate-[fadeSlideUp_0.8s_ease-out_both]k"
             viewBox="0 0 1000 500"
             preserveAspectRatio="none"
             aria-hidden="true">
                <defs>
                    <marker
                    id="arrow-head"
                    markerWidth="10"
                    markerHeight="10"
                    refX="8"
                    refY="5"
                    orient="auto">
                        <path  d="M0,2 L9,5 L0,10 Z" fill="#C47752" />
                    </marker>
                </defs>
                <path
                 d= "M 590 200 C 730 250, 760 100, 850 65"
                 fill="none"
                 stroke="#C47752"
                 strokeWidth="3"
                 strokeLinecap="round"
                 markerEnd="url(#arrow-head)"/>
             </svg>

             <section className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-8 px-5 py-12 md:grid-cols-2 md:gap-6 lg:grid-cols-[1fr_0.85fr_1fr] lg:gap-8 lg:px-8">
                    <article className="animate-[fadeSlideUp_0.7s_ease-out_0.2s_both] rounded-[28px_16px_28px_16px] border border-[#D9A17A] bg-[#EED5BD]/60 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8">
                    <span className="mb-3 inline-block text-xs font-bold tracking-[0.15em] text-[#A65E3F]"></span>
                    <h2 className="mb-4 text-2xl font-extrabold leading-tight text-[#292524] sm:text-3x">What is Mental-Wellbeing?</h2>
                    <p className="text-base leading-7 text-[#65564B]">Mental well-being is a state in which a person feels emotionally balanced, can handle everyday stress, maintains healthy relationships, and is able to learn, work, and enjoy life.</p>

                    <h2 className="mb-4 text-2xl font-extrabold leading-tight text-[#292524] sm:text-3xl">How to maintain  mental-wellbeing?</h2>
                    <p className="text-base leading-7 text-[#65564B]">Maintaining mental well-being means taking care of your mind and emotions through healthy daily habits. You don't need to change your entire lifestyle at once—even small, consistent steps can make a difference such as enough sleep,regular excercise,eating a balanced diet,praticing mindfulness etc.</p>
                    </article>

                    <article className="animate-[fadeSlideUp_0.7s_ease-out_0.2s_both] rounded-[28px_16px_28px_16px] border border-[#D9A17A] bg-[#EED5BD]/60 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8">
                    <span className="mb-3 inline-block text-xs font-bold tracking-[0.15em] text-[#A65E3F]"></span>
                    <h2 className="mb-4 text-2xl font-extrabold leading-tight text-[#292524] sm:text-3x">What are the signs of good mental well-being?</h2>
                    <p className="text-base leading-7 text-[#65564B]">Some signs include managing emotions, maintaining healthy relationships, adapting to change, handling stress, and finding enjoyment or meaning in daily activities.</p>

                    <h2 className="mb-4 text-2xl font-extrabold leading-tight text-[#292524] sm:text-3xl">What are the signs of bad mental well-being?</h2>
                    <p className="text-base leading-7 text-[#65564B]">Poor mental well-being can be identified through signs such as persistent sadness, excessive stress, frequent anxiety, mood swings, low self-esteem, difficulty concentrating, changes in sleep or appetite, loss of interest in daily activities, social withdrawal, and feelings of hopelessness.</p>
                    </article>

                    <article className="animate-[fadeSlideUp_0.7s_ease-out_0.2s_both] rounded-[28px_16px_28px_16px] border border-[#D9A17A] bg-[#EED5BD]/60 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8">
                    <span className="mb-3 inline-block text-xs font-bold tracking-[0.15em] text-[#A65E3F]"></span>
                    <h2 className="mb-4 text-2xl font-extrabold leading-tight text-[#292524] sm:text-3x">Is mental well-being the same as mental health?</h2>
                    <p className="text-base leading-7 text-[#65564B]">They are closely related. Mental health is a broader concept that includes emotional, psychological, and social functioning, while mental well-being emphasizes how we feel and function in everyday life.</p>

                    <h2 className="mb-4 text-2xl font-extrabold leading-tight text-[#292524] sm:text-3xl">What to do when you feel stressed?</h2>
                    <p className="text-base leading-7 text-[#65564B]">Talking to someone, gentle movement, journaling, or taking a break may help. If you tend to keep everything inside, consider sharing a little with someone you trust.</p>
                    </article>
            </section> 

                            <li className="mt-6 flex justify-center md:hidden">
                    <Link to="/donate"
                    className="rounded-xl bg-[#C47752] px-6 py-3 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#AD6342] hover:shadow-lg"
                    onClick={()=>{
                        

                        setTimeout(()=>{
                            document.getElementById("Register")?.scrollIntoView({behavior:"smooth"});
                        },100)
                    }}>Donate</Link>                    
                </li> 
                <br></br>       
        </main>
     </>
    );
}

export default Home;