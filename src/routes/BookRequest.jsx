import axios from 'axios';
import React, { useEffect, useState } from 'react'
import BookCardHorizental from '../component/BookCardHorizental';
import NumRequest from './AppContext';

function BookRequest() {
    const [data, setData] = useState([])
    useEffect(() => {
        axios.get("https://carefree-empathy-production.up.railway.app/getbook", { params: { offset: 0, limit: 1000000, language: '', status: 'false' } }).then((res) => {
            setData(res.data);
            console.log(res.data);
        localStorage.setItem("RequestLength", res.data.length)

        })
    }, [])

    useEffect(() => {
    },[data])

    return (
        
            <div className='relative mt-8 max-xmd:overflow-y-scroll w-full'>
                <BookCardHorizental data={data} />
            </div>
        
    )
}

export default BookRequest