import React from 'react'

function InsertBook() {
    const [BookTitle, setBookTitle] = useState(title)
      const [BookDescrib, setBookDescrib] = useState(describ)
      const [BookLink, setBookLink] = useState(link)
      const [BookAuthor, setBookAuthor] = useState(author)
      const [BookPublisher, setBookPublisher] = useState(publisher)
      const [BookImage1, setBookImage1] = useState(img1)
      const [BookImage2, setBookImage2] = useState(img2)
      const [BookImage3, setBookImage3] = useState(img3)
      const [BookNameImage1, setBookNameImage1] = useState("")
      const [BookNameImage2, setBookNameImage2] = useState("")
      const [BookNameImage3, setBookNameImage3] = useState("")
    return (
        <div className="p-4 sm:ml-64">
            <div className="p-4 rounded-lg ">
                <div className=" grid items-center justify-center p-4 md:p-5 border-b rounded-t border-gray-200">
              <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900 dark:text-white">
                Title
              </h3>
              <br />
              <input type="text" className="mb-6 font-[700] text-[20px] outline-none mx-auto bg-gray-300 border-4 border-gray-900 text-gray-900 text-sm rounded-lg block w-[30rem] p-4 " value={BookTitle} onChange={(event) => setBookTitle(event.target.value)} />

              <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900 dark:text-white">
                Link To downlod
              </h3>
              <br />
              <input type="text" className="mb-6 font-[700] text-[20px] outline-none mx-auto bg-gray-300 border-4 border-gray-900 text-gray-900 text-sm rounded-lg block w-[30rem] p-4 " value={BookLink} onChange={(event) => setBookLink(event.target.value)} />
              <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900 dark:text-white">
                Author
              </h3>
              <br />
              <input type="text" className="mb-6 font-[700] text-[20px] outline-none mx-auto bg-gray-300 border-4 border-gray-900 text-gray-900 text-sm rounded-lg block w-[30rem] p-4 " value={BookAuthor} onChange={(event) => setBookAuthor(event.target.value)} />
              <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900 dark:text-white">
                Publisher
              </h3>
              <br />
              <input type="text" className="mb-6 font-[700] text-[20px] outline-none mx-auto bg-gray-300 border-4 border-gray-900 text-gray-900 text-sm rounded-lg block w-[30rem] p-4 " value={BookPublisher} onChange={(event) => setBookPublisher(event.target.value)} />
              <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900 dark:text-white">
                Language
              </h3>
              <br />

              <form class="max-w-sm grid items-center justify-center mx-auto">
                <label for="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
                <select id="countries" className="mb-6 font-[700] text-[20px] outline-none mx-auto bg-gray-300 border-4 border-gray-900 text-gray-900 text-sm rounded-lg block w-[30rem] p-4 ">
                  <option selected>Choose a book language</option>
                  <option value="US">Foriegn</option>
                  <option value="CA">Khmer</option>
                  
                </select>
              </form>

              <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900 dark:text-white">
                Publisher
              </h3>
              <br />
              <input type="text" className="mb-6 font-[700] text-[20px] outline-none mx-auto bg-gray-300 border-4 border-gray-900 text-gray-900 text-sm rounded-lg block w-[30rem] p-4 " value={BookPublisher} onChange={(event) => setBookPublisher(event.target.value)} />

              <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900 dark:text-white">
                Description
              </h3>
              <textarea rows="4" className="block font-[700] text-[20px] p-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..." value={BookDescrib} onChange={(event) => setBookDescrib(event.target.value)}></textarea>
              <br />
              <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900 dark:text-white">
                preview images
              </h3>
              <br />
              <div className="grid md:grid-cols-3 gap-4 items-center justify-center">

                <label
                  htmlFor="file-upload"
                  className=" relative flex items-center justify-center w-64 h-64 cursor-pointer rounded-xl bg-cover bg-center shadow-md"
                  style={{
                    background: `url(https://raw.githubusercontent.com/PisethPanha/ebook_photos/refs/heads/main/${BookNameImage1 == "" ? img1 : BookNameImage1})`, // Replace with your image URL
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  <input
                    id="file-upload"
                    type="file" accept=".jpg, .png"
                    onChange={(event) => { setBookImage1(event.target.files[0]); setBookNameImage1(event.target.files[0].name) }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <span className="text-white font-bold bg-black bg-opacity-50 px-4 py-2 rounded-md">
                    Edit
                  </span>
                </label>
                <label
                  htmlFor="file-upload"
                  className="relative flex items-center justify-center w-64 h-64 cursor-pointer rounded-xl bg-cover bg-center shadow-md"
                  style={{
                    background: `url(https://raw.githubusercontent.com/PisethPanha/ebook_photos/refs/heads/main/${BookNameImage2 == "" ? img2 : BookNameImage2})`, // Replace with your image URL
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  <input
                    id="file-upload"
                    type="file" accept=".jpg, .png"
                    onChange={(event) => { setBookImage2(event.target.files[0]); setBookNameImage2(event.target.files[0].name) }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <span className="text-white font-bold bg-black bg-opacity-50 px-4 py-2 rounded-md">
                    Edit
                  </span>
                </label>
                <label
                  htmlFor="file-upload"
                  className="relative flex items-center justify-center w-64 h-64 cursor-pointer rounded-xl bg-cover bg-center shadow-md"
                  style={{
                    background: `url(https://raw.githubusercontent.com/PisethPanha/ebook_photos/refs/heads/main/${BookNameImage3 == "" ? img3 : BookNameImage3})`, // Replace with your image URL
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  <input
                    id="file-upload"
                    type="file" accept=".jpg, .png"
                    onChange={(event) => { setBookImage3(event.target.files[0]); setBookNameImage3(event.target.files[0].name) }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <span className="text-white font-bold bg-black bg-opacity-50 px-4 py-2 rounded-md">
                    Edit
                  </span>
                </label>
              </div>
            </div>
            </div>
        </div>
    )
}

export default InsertBook