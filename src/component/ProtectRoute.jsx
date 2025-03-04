import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function ProtectRoute() {
  const token = localStorage.getItem("authorization");
  const navigate = useNavigate();
  async function handleProtect(){
    await axios.post("https://carefree-empathy-production.up.railway.app/protect_route", {token: token}).then((res) => {res.data.message != "alkdsaldlsakdslkadlksadksandlsad" && navigate("/login");
    })
  }

  useEffect(() => {
    handleProtect();
  },[])
  return (
    <div></div>
  )
}

export default ProtectRoute