import { useState } from "react";
import { BrowserRouter, Link, Route, Routes, useNavigate } from "react-router-dom";
import EditBook from "./routes/EditBook";
import InsertBook from "./routes/InsertBook";
import Login from "./routes/Login";

function App() {
  const [sidebar, setSidebar] = useState(false)
  
  function handleSignOut(){
    localStorage.removeItem("authorization");
    }
  return (
    <BrowserRouter>
      <div>

        <button onClick={() => setSidebar(!sidebar)}  type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg md:hidden max-md:block hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 ">
          <span className="sr-only">Open sidebar</span>
          <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
          </svg>
        </button>
        <div className={`fixed w-full h-full bg-transparent top-0 z-20 ${sidebar ? "block" : "hidden"}`} onClick={() => setSidebar(!sidebar)}></div>
        <aside id="default-sidebar" className={`fixed top-0 left-0 z-40 w-64 h-screen ${sidebar ? "max-md:translate-x-0" : "max-md:-translate-x-full"} duration-200 `}>
          <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 ">
            <ul className="space-y-2 font-medium">
             <Link to='/'> 
             <li>
                <p className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100">
                  <img className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 " src={`https://raw.githubusercontent.com/PisethPanha/ebook_photos/refs/heads/main/drawing.png`} alt="" />
                  <span className="ms-3">Edit Book</span>
                </p>
              </li>
              </Link>
              
              <Link onClick={handleSignOut} to="/login">
              <li >
                <a href="" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                  <img src={`https://raw.githubusercontent.com/PisethPanha/ebook_photos/refs/heads/main/logout.png`} className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" alt="" />
                  <span className="flex-1 ms-3 whitespace-nowrap">Sign Out</span>
                </a>
              </li>
              </Link>
            </ul>
          </div>
        </aside>

        

      </div>
      <Routes>

        <Route path="/" element={<EditBook />} />
        <Route path="/insert" element={<InsertBook />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
