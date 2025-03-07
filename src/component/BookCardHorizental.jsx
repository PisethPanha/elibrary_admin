
import React from 'react'
import BookX from './BookX'
function BookCardHorizental({ data }) {
    
    return (
        <div>
            <table className='relative'>
                <thead className=' bg-gray-200'>
                <tr className=''>
                    <th className='z-50 border-2 border-gray-900 p-2'>
                        រូបក្រប
                    </th>
                    <th className='z-50 border-2 border-gray-900 p-2'>
                        ចំណងជើង
                    </th>
                    <th className='z-50 border-2 border-gray-900 p-2'>
                        ប្រភេទ
                    </th>
                    <th className='z-50 border-2 border-gray-900 p-2'>
                        ភាសា
                    </th>
                    <th className='z-50 border-2 border-gray-900 p-2'>
                        ចំនួនអ្នកចូលអាន
                    </th>
                    <th className='z-50 border-2 border-gray-900 p-2'>
                        ចំនួនអ្នកទាញយក
                    </th>
                    <th className='z-50 border-2 border-gray-900 p-2'>
                        ACTION
                    </th>
                </tr>
                </thead>
                <tbody>
                {data.map((ele, i) =>
                    <BookX key={i} read={ele.read_link} view={ele.view} download={ele.download} language={ele.language} type={ele.type} author={ele.autor} publisher={ele.publisher} publish_date={ele.publish_date} id={ele.id} img={ele.img} title={ele.Title} describ={ele.describetion} link={ele.link_download} img1={ele.img_content1} img2={ele.img_content2} img3={ele.img_content3} />
                )}
                </tbody>
            </table>
        </div>
    )
}

export default BookCardHorizental