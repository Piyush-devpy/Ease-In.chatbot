import { Routes,Route } from "react-router-dom";
import Home from "./Home";
import Feedback from "./components/feedback";
import About from "./components/about";
import Donate from "./components/donate";
import Questions from "./components/Question";

function App(){
  return(
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/feedback" element={<Feedback/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/donate" element={<Donate/>}/>
      <Route path="/questions" element={<Questions/>}/>
    </Routes>
  );
}

export default App;