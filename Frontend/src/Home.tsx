import { Link } from "react-router-dom";

function Home(){
    return(
     <>
        <nav className="mx-8 mt-4 flex items-center justify-between rounded-2xl bg-[#292524] px-8 py-4 shadow-lg">

        <Link to="/" className="flex shrink-0 items-center gap-2">
            <img className="h-8 w-8 shrink-0 object-contain" src="./artificial-intelligence.webp" alt="logo.png"></img>
            <h3 className="text-[#F5E6CC] transition-colors duration-200 hover:text-[#D9A17A]">Ease In</h3>
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
                    <Link to="/login"
                    className="inline-block rounded-xl border-2 border-[#D9A17A] px-5 py-2 font-semibold text-[#F5E6CC] transition-all duration-300 hover:bg-[#D9A17A] hover:text-[#292524] hover:shadow-md hover:-translate-y-0.5"
                    onClick={()=>{
                        

                        setTimeout(()=>{
                            document.getElementById("Login")?.scrollIntoView({behavior:"smooth"});
                        },100)
                    }}>Login</Link>
                </li>
                <li>
                    <Link to="/register"
                    className="inline-block rounded-xl bg-[#C47752] px-5 py-2 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#AD6342] hover:shadow-lg hover:-translate-y-0.5"
                    onClick={()=>{
                        

                        setTimeout(()=>{
                            document.getElementById("Register")?.scrollIntoView({behavior:"smooth"});
                        },100)
                    }}>Register</Link>
                </li>
            </ul>
        </nav>
     </>
    );
}

export default Home;