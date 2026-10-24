import { Routes,Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./Home";

function App(){
  return(
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
  );
}

export default App;