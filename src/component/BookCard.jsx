import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
function BookCard({ read, view, download, language, type, id, img, title, describ, link, img1, img2, img3, author, publisher, publish_date }) {
  const [dialog, setDialog] = useState(false)
  const [edit, setEdit] = useState(false)
  const [imgZoom, setImgZoom] = useState()
  const [imgWillZoom, setImgWillZoom] = useState()
  const [BookTitle, setBookTitle] = useState(title)
  const [BookDescrib, setBookDescrib] = useState(describ)
  const [BookLink, setBookLink] = useState(link)
  const [BookAuthor, setBookAuthor] = useState(author)
  const [BookPublisher, setBookPublisher] = useState(publisher)
  const [BookImage1, setBookImage1] = useState()
  const [BookImage2, setBookImage2] = useState()
  const [BookImage3, setBookImage3] = useState()
  const [BookLanguage, setBookLanguage] = useState(language)
  const [BookType, setBookType] = useState(type)
  const [style1, setStyle1] = useState(null)
  const [style2, setStyle2] = useState(null)
  const [style3, setStyle3] = useState(null)
  const [BookNameImage1, setBookNameImage1] = useState(img1)
  const [BookNameImage2, setBookNameImage2] = useState(img2)
  const [BookNameImage3, setBookNameImage3] = useState(img3)
  const [isUpload1, setIsUpload1] = useState('EDIT');
  const [isUpload2, setIsUpload2] = useState('EDIT');
  const [isUpload3, setIsUpload3] = useState('EDIT');
  const [loading, setLoading] = useState(false)
  const [isUpdated, setupdated] = useState(false)
  const [reloadNoFile, setReloadNoFile] = useState(0)
  const images = [BookImage1, BookImage2, BookImage3]
  const uploadStatus = [setIsUpload1, setIsUpload2, setIsUpload3]
  const navigate = useNavigate();
  function handleDelete() {
    axios.get("https://carefree-empathy-production.up.railway.app/delete", { params: { bookId: id } }).then((res) => { console.log(res); navigate(0); })

  }

  useEffect(() => {
    if (isUpload1 == "uploaded" && isUpload2 == "uploaded" && isUpload3 == "uploaded" || reloadNoFile == 3) {
      navigate(0)
      setLoading(false)
    }


  }, [isUpload1, isUpload2, isUpload3, reloadNoFile, loading])

  async function handleSubmit() {
    setLoading(true)
    if (
      BookTitle == "" ||
      BookDescrib == "" ||
      BookLink == "" ||
      BookAuthor == "" ||
      BookPublisher == "" ||
      BookLanguage == "" ||
      BookType == ""
    ) {
      alert("All field can not empty");
    } else {
      BookNameImage1 == img1 && setIsUpload1("uploaded")
      console.log(isUpload1);
      BookNameImage2 == img2 && setIsUpload2("uploaded")
      console.log(isUpload2);
      BookNameImage3 == img3 && setIsUpload3("uploaded")
      console.log(isUpload3);
      await axios.post("https://carefree-empathy-production.up.railway.app/edit", {
        BookId: id,
        title: BookTitle,
        description: BookDescrib,
        link: BookLink,
        author: BookAuthor,
        publisher: BookPublisher,
        image1: BookNameImage1 == img1 || BookNameImage1 == "" ? img1 : id + BookNameImage1,
        image2: BookNameImage2 == img2 || BookNameImage2 == "" ? img2 : id + BookNameImage2,
        image3: BookNameImage3 == img3 || BookNameImage3 == "" ? img3 : id + BookNameImage3,
        language: BookLanguage,
        type: BookType
      }).then((res) => {
        console.log(res.data);
        if (res.data == 'Book updated !!!') {
          setupdated(true)
          for (let y = 0; y < 3; y++) {
            uploadToGitHub(images[y], uploadStatus[y], id)
          }

        }
      }
      )
    }
  }

  const handleImageChange = (file, setStyle) => {

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setStyle(`url(${imageUrl}) no-repeat center/contain `);
    }
  };

  async function updateFile(owner, img, repo, filePath, sha, newContent, githubToken) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    const data = {
      message: "Updating file.txt",
      content: newContent,
      sha: sha,
    };

    try {
      const response = await axios.put(url, data, {
        headers: { Authorization: `token ${githubToken}` },
      });
      console.log("✅ File updated successfully:", response.data);
      img("uploaded")
    } catch (error) {
      console.error("❌ Error updating file:", error.response ? error.response.data : error.message);
    }
  }

  const uploadToGitHub = async (file, img, id) => {

    if (!file) {
      setReloadNoFile(reloadNoFile + 1)
      return;
    }


    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64String = reader.result.split(",")[1];

      const githubUsername = "PisethPanha";
      const repoName = "ebook_photos";
      const filePath = `${id + file.name}`; // Upload directly to the root directory
      const branch = "main"; // Change branch if needed
      const token = "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";

      const url = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${filePath}`;

      const data = {
        message: `Upload ${filePath}`,
        content: base64String,
        branch: branch,
      };
      try {

        const response = await axios.get(`https://api.github.com/repos/${githubUsername}/${repoName}/contents/${filePath}`)

        updateFile(githubUsername, img, repoName, filePath, response.data.sha, base64String, token)


      } catch (error) {
        console.error("Error uploading file:", error.response?.data || error);
        try {
          const response = await axios.put(url, data, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github.v3+json",
            },
          });

          img("uploaded")
          alert("updated !!!")
          console.log("File uploaded:", response.data);
          console.log(filePath);




        } catch (error) {
          console.error("Error uploading file:", error.response?.data || error);

          img("fail upload, we'll upload again !!!")
          uploadToGitHub(file, img, id);

        }
      }


    };
  }


  return (
    <div>
      <div style={{ boxShadow: "0px 0px 20px gray" }} className="   mt-4 max-md:mx-auto bg-white border border-gray-200 rounded-lg shadow ">
        <p >
          <img className="rounded-t-lg mx-auto w-full h-[20rem]" src={`https://raw.githubusercontent.com/PisethPanha/ebook_photos/refs/heads/main/${img}`} alt="" />
        </p>
        <div className="p-5 gap-2 grid text-center">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
          <p className="mb-3 font-normal text-gray-700 ">view: {view} <br /> download: {download}</p>
          <p onClick={() => setDialog(!dialog)}
            className=" text-center cursor-pointer w-[10rem] mx-auto items-center px-3 py-2 text-sm font-medium  text-white bg-blue-700 rounded-lg hover:bg-blue-800 outline-none">
            Preview

          </p>
          <p onClick={() => setEdit(!edit)}
            className="w-[10rem] mx-auto cursor-pointer items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Edit

          </p>

          <p onClick={handleDelete}
            className="w-[10rem] mx-auto cursor-pointer items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Delete

          </p>

        </div>

      </div>

      <div className={`  overflow-y-auto overflow-x-hidden fixed top-0  right-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${dialog ? "block" : "hidden"}`}>
        <div className="relative h-full mx-auto p-4">

          <div className="relative overflow-y-scroll border-2 border-gray-900 h-full bg-white rounded-lg shadow-sm ">

            <div className=" flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
              <h3 className=" text-xl font-semibold text-gray-900 dark:text-white">
                Book details
              </h3>
              <button type="button" onClick={() => setDialog(!dialog)} className="fixed right-16 text-gray-400  bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className=" grid  text-center justify-center items-center p-4 md:p-5 border-2 border-gray-200 rounded-b">
              <h1 className='text-[30px] uppercase font-[600]'>{title}</h1>
              <br />
              <h1 className='text-[18px] uppercase text-justify font-[500]'>Author: {author}  <br />  Publisher: {publisher}  <br /> Publish date: {publish_date}</h1>

            </div>
            <div className='grid grid-cols-2'>
              <div className="p-4 md:p-5 space-y-4 w-[500px] max-md:w-[250px]">
                <div className='text-center'>
                  <h1>Preview</h1>
                  <div className='overflow-y-scroll h-56   grid items-center justify-center gap-4'>
                    <img onClick={() => { setImgZoom(!imgZoom); setImgWillZoom(img1) }} src={`https://raw.githubusercontent.com/PisethPanha/ebook_photos/refs/heads/main/${img1}`} alt="" className='w-[300px] border-4 border-gray-600' />
                    <img onClick={() => { setImgZoom(!imgZoom); setImgWillZoom(img2) }} src={`https://raw.githubusercontent.com/PisethPanha/ebook_photos/refs/heads/main/${img2}`} alt="" className='w-[300px] border-4 border-gray-600' />
                    <img onClick={() => { setImgZoom(!imgZoom); setImgWillZoom(img3) }} src={`https://raw.githubusercontent.com/PisethPanha/ebook_photos/refs/heads/main/${img3}`} alt="" className='w-[300px] border-4 border-gray-600' />
                  </div>
                </div>
              </div>
              <div className="p-4 md:p-5 space-y-4 ">
                <div className='text-center'>
                  <h1>Description</h1>
                  <div className='overflow-y-scroll p-4 h-56 text-center  grid items-center justify-center gap-4'>
                    <p className='break-all break-words'>{describ}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className=" flex justify-center items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
                <button data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Download</button>
                <a target='blank' href={`https://carefree-empathy-production.up.railway.app/pdf/${read}`} onClick={() => setDialog(!dialog)} data-modal-hide="default-modal" type="a href=''" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-blue-600  dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 bg-blue-700 dark:hover:text-white dark:hover:bg-gray-700"><button className=' text-white duration-150'>Read</button></a>
              </div>
            </div>
          </div>
        </div>
        <div className={`w-full h-full absolute top-0 flex justify-center items-center z-50 ${imgZoom ? "block" : "hidden"}`}>
          <img src={`https://raw.githubusercontent.com/PisethPanha/ebook_photos/refs/heads/main/${imgWillZoom}`} alt="" className='border-4 border-gray-600 max-w-[50rem] max-h-[30rem]' />
          <div onClick={() => setImgZoom(!imgZoom)} className='w-full -z-10 h-full absolute top-0 flex justify-center items-center '></div>
        </div>

      </div>

      <div className={`  overflow-y-auto overflow-x-hidden fixed top-0  right-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${edit ? "block" : "hidden"}`}>

        <div role="status" className={`w-full ${loading ? "block" : "hidden "} fixed z-50 h-[100vh] justify-center flex items-center `}>
          <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>

        <div className="relative h-full mx-auto p-4">
          <div className="relative overflow-y-scroll border-2 border-gray-900 h-full bg-white rounded-lg shadow-sm ">
            <div className=" flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
              <h3 className=" text-xl  font-semibold text-gray-900 dark:text-white">
                Edit Book
              </h3>
              <button type="button" onClick={() => { setEdit(!edit); navigate(0) }} className="fixed right-16 text-gray-400  bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className=" grid items-center justify-center p-4 md:p-5 border-b rounded-t border-gray-200">
              <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900 dark:text-white">
                Title
              </h3>
              <br />


              <input type="text" className={`mb-6 font-[700] text-[20px] ${isUpdated ? "border-4 border-blue-700" : "border-4 border-gray-900"} outline-none mx-auto bg-gray-300  text-gray-900 text-sm rounded-lg block max-lg:w-auto w-[30rem] p-4 `} value={BookTitle} onChange={(event) => setBookTitle(event.target.value)} />

              <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900 dark:text-white">
                Link To downlod
              </h3>
              <br />
              <input type="text" disabled className={`mb-6 font-[700] text-[20px] outline-none mx-auto bg-gray-300 ${isUpdated ? "border-4 border-blue-700" : "border-4 border-gray-900"} text-gray-900 text-sm rounded-lg block max-lg:w-auto w-[30rem] p-4`} value={BookLink} onChange={(event) => setBookLink(event.target.value)} />
              <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900 dark:text-white">
                Author
              </h3>
              <br />
              <input type="text" className={`mb-6 font-[700] text-[20px] outline-none mx-auto bg-gray-300 ${isUpdated ? "border-4 border-blue-700" : "border-4 border-gray-900"} text-gray-900 text-sm rounded-lg block max-lg:w-auto w-[30rem] p-4 `} value={BookAuthor} onChange={(event) => setBookAuthor(event.target.value)} />
              <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900 dark:text-white">
                Publisher
              </h3>
              <br />
              <input type="text" className={`mb-6 font-[700] text-[20px] outline-none mx-auto bg-gray-300 ${isUpdated ? "border-4 border-blue-700" : "border-4 border-gray-900"} text-gray-900 text-sm rounded-lg block max-lg:w-auto w-[30rem] p-4 `} value={BookPublisher} onChange={(event) => setBookPublisher(event.target.value)} />

              
              <br />

              <form className="max-w-sm grid items-center justify-center mx-auto">
                <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
                <select id="type" className="max-lg:w-auto mb-6 font-[700] text-[20px] outline-none mx-auto bg-gray-300 border-4 border-gray-900 text-gray-900 text-sm rounded-lg block w-[30rem] p-4 " onChange={(event) => setBookType(event.target.value)}>
                  <option defaultValue={BookType}>Choose a book type</option>
                  <option value="IT">Information Technology</option>
                  <option value="constructure">Constructure</option>
                  <option value="accounting">Accounting</option>
                  <option value="agreculture">Agreculture</option>
                  <option value="law">Law</option>
                  <option value="chinese">Chinese</option>
                  <option value="english">English</option>
                  <option value="ganeral">General Knowledg</option>
                  <option value="electric">Electric</option>
                  <option value="electronic">Electronic</option>
                  <option value="animal">Animal husbandry</option>
                  <option value="other">Other</option>

                </select>
              </form>
              <form className="max-w-sm grid items-center justify-center mx-auto">
                <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
                <select onChange={(event) => {
                  setBookLanguage(event.target.value); console.log(BookLanguage);
                }} id="countries" className={`mb-6 max-lg:w-auto font-[700] text-[20px] outline-none mx-auto bg-gray-300 ${isUpdated ? "border-4 border-blue-700" : "border-4 border-gray-900"} text-gray-900 text-sm rounded-lg block w-[30rem] p-4 `}>
                  <option defaultValue={language}>Choose a book language</option>
                  <option value="foriegn">Foriegn</option>
                  <option value="khmer">Khmer</option>

                </select>
              </form>

              <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900 dark:text-white">
                Description
              </h3>
              <textarea rows="4" className={`${isUpdated ? "border-4 border-blue-700" : "border-4 border-gray-900"} block font-[700] text-[20px] p-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg outline-none`} placeholder="Write your thoughts here..." value={BookDescrib} onChange={(event) => setBookDescrib(event.target.value)}></textarea>
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
                    background: style1 != null ? style1 : `url(https://raw.githubusercontent.com/PisethPanha/ebook_photos/refs/heads/main/${img1}) no-repeat center/contain`
                  }}
                >
                  <input
                    id="file-upload"
                    type="file" accept=".jpg, .png"
                    onChange={(event) => { setBookImage1(event.target.files[0]); setBookNameImage1(event.target.files[0].name); handleImageChange(event.target.files[0], setStyle1) }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <span className="text-white font-bold bg-black bg-opacity-50 px-4 py-2 rounded-md">
                    {isUpload1}
                  </span>
                </label>
                <label
                  htmlFor="file-upload"
                  className="relative flex items-center justify-center w-64 h-64 cursor-pointer rounded-xl bg-cover bg-center shadow-md"
                  style={{
                    background: style2 != null ? style2 : `url(https://raw.githubusercontent.com/PisethPanha/ebook_photos/refs/heads/main/${img2}) no-repeat center/contain`
                  }}
                >
                  <input
                    id="file-upload"
                    type="file" accept=".jpg, .png"
                    onChange={(event) => { setBookImage2(event.target.files[0]); setBookNameImage2(event.target.files[0].name); handleImageChange(event.target.files[0], setStyle2) }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <span className="text-white font-bold bg-black bg-opacity-50 px-4 py-2 rounded-md">
                    {isUpload2}
                  </span>
                </label>
                <label
                  htmlFor="file-upload"
                  className="relative flex items-center justify-center w-64 h-64 cursor-pointer rounded-xl bg-cover bg-center shadow-md"
                  style={{
                    background: style3 != null ? style3 : `url(https://raw.githubusercontent.com/PisethPanha/ebook_photos/refs/heads/main/${img3}) no-repeat center/contain`
                  }}
                >
                  <input
                    id="file-upload"
                    type="file" accept=".jpg, .png"
                    onChange={(event) => { setBookImage3(event.target.files[0]); setBookNameImage3(event.target.files[0].name); handleImageChange(event.target.files[0], setStyle3) }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <span className="text-white font-bold bg-black bg-opacity-50 px-4 py-2 rounded-md">
                    {isUpload3}
                  </span>
                </label>
              </div>
            </div>
            <div className='flex justify-center items-center p-4'>
              <button onClick={handleSubmit} type="button" className="duration-200 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Submit</button>
              <button onClick={() => setEdit(!edit)} type="button" className="duration-200 text-white bg-gray-400 hover:bg-blue-300 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Discard</button>
            </div>
          </div>
        </div>
      </div>


    </div>

  )
}
export default BookCard