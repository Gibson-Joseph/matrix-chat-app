import logo from "./logo.svg";
import "./App.css";
import ChatApp from "./ChatApp/ChatApp";
import Login from "./Login/Login";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="w-full h-full p-3">
      <Suspense fallback={null}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ChatApp />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
