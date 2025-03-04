import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLogin, setIsLogin] = useState("")
    const navigate = useNavigate();
    async function handleLogin() {
        await axios.post("https://carefree-empathy-production.up.railway.app/login", {username: username, password: password}).then((res) => 
        {if(res.data.message == "bdskfkfjdskflkfmlkdfkdsnfksdfkadsfdkvfdkjgnfgjka"){
            localStorage.setItem("authorization", res.data.message)
            navigate("/")  
        }else{
            alert(res.data.message)
        }})
    }
    
    return (
        <div className="p-4 sm:ml-64">
            <div className="p-4 rounded-lg "></div>
            <div className='flex items-center justify-center h-[100vh]'>
                <form className="bg-gray-400 max-w-sm p-8 rounded-lg w-[30rem]">
                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                        <input onChange={(event) => setUsername(event.target.value)} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="username" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input onKeyDown={(event) => event.key == "Enter" && handleLogin()} onChange={(event) => setPassword(event.target.value)} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className='flex items-center justify-center'>
                        <button onClick={handleLogin} type="button" className="mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </div>
                </form>

            </div>
        </div>

    )
}

export default Login