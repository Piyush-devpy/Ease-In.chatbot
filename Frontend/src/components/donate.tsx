import { Link } from "react-router-dom";

function Donate(){
    return(
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

        <section className="donation-coming-soon relative isolate mx-auto my-8
                flex min-h-[220px] w-[calc(100%-2rem)] max-w-6xl
                items-center justify-center overflow-hidden rounded-3xl
                border border-[#C47752]/50 bg-gradient-to-br
                from-[#292524] via-[#49352E] to-[#292524]
                px-4 py-12 text-center shadow-xl
                sm:my-12 sm:min-h-[280px] sm:px-8
                md:min-h-[320px] md:px-12">
            <h1 className="donation-title relative max-w-full
                text-2xl font-extrabold leading-tight tracking-wide
                text-[#F5E6CC] sm:text-3xl md:text-4xl
                lg:text-5xl [overflow-wrap:anywhere]">DONATION ON PAUSE.</h1>
        </section>        
        </>
    )
}

export default Donate;