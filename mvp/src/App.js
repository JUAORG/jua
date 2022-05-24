import { useState, useEffect } from "react";
import "./App.css";
import Form from "./components/common/Form";
import Home from "./components/Home";
import { Routes, Route, useNavigate } from "react-router-dom";
import { app } from "./firebase-config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import handleEmailLogin from "./actions/auth";
function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    let authToken = sessionStorage.getItem("Auth Token");

    if (authToken) {
      navigate("/home");
    }
  }, []);
  
  return (
    <div className="App">
      <>
        <ToastContainer />
        <Routes>
          <Route
            path="/login"
            element={
              <Form
                title="Login"
                setEmail={setEmail}
                setPassword={setPassword}
                handleAction={() => handleEmailLogin(email, password)}
              />
            }
          />
          <Route path="/home" element={<Home />} />
        </Routes>
      </>
    </div>
  );
}

export default App;
