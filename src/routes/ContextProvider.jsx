import React, { useEffect, useState } from 'react'
import NumRequest from './AppContext'
import axios from 'axios'


function ContextProvider({ Children }) {
    const [dataLen, setDataLen] = useState()
    useEffect(() => {
        axios.get("https://carefree-empathy-production.up.railway.app/getbook", { params: { offset: 0, limit: 10, language: '', status: 'false' } })
            .then((res) => setDataLen(res.data.length))
    }, [])

    return (
        <NumRequest.Provider value={{ dataLen }} >
            {Children}
        </NumRequest.Provider>
    )
}

export default ContextProvider