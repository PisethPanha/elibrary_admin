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
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadProgress1, setUploadProgress1] = useState(0)
  const [uploadProgress2, setUploadProgress2] = useState(0)
  const [uploadProgress3, setUploadProgress3] = useState(0)
  const [uploadProgress4, setUploadProgress4] = useState(0)
  const [reloadNoFile, setReloadNoFile] = useState(0)
  const [step1, setStep1] = useState(0)
  const [step2, setStep2] = useState(0)
  const [step3, setStep3] = useState(0)
  const [step4, setStep4] = useState(0)
  const [steps, setSteps] = useState(0)
  const [reading, setReading] = useState(false)
  const images = [BookImage1, BookImage2, BookImage3]
  const tokenTMP = "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AA"
  const GitToken = tokenTMP.slice(0, -2)
  const uploadStatus = [setIsUpload1, setIsUpload2, setIsUpload3]
  const navigate = useNavigate();
  function handleDelete() {
    axios.get("https://carefree-empathy-production.up.railway.app/delete", { params: { bookId: id } }).then((res) => { console.log(res); navigate(0); })

  }

  useEffect(() => {
    const sum = uploadProgress1 + uploadProgress2 + uploadProgress3 + uploadProgress4
    const multi = sum * 100
    setUploadProgress(multi / 400)
    

  }, [uploadProgress1, uploadProgress2, uploadProgress3, uploadProgress4])




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
      setLoading(true)
      if (BookNameImage1 == img1) {
        setIsUpload1("uploaded");
        setUploadProgress1(100)
      }
      else if (BookNameImage2 == img2) {
        setIsUpload2("uploaded");
        setUploadProgress2(100)
      }
      else if (BookNameImage2 == img2) {
        setIsUpload3("uploaded");
        setUploadProgress3(100)
      }

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
      },
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress4(percent); // Update progress state
          }
        }
      ).then((res) => {
        console.log(res.data);
        if (res.data == 'Book updated !!!') {
          setStep1(10)
          setupdated(true)
          for (let y = 0; y < 3; y++) {
            uploadToGitHub(images[y], uploadStatus[y], id, y)
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

  async function updateFile(owner, img, repo, filePath, sha, newContent, y) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    const data = {
      message: "Updating file.txt",
      content: newContent,
      sha: sha,
    };

    try {
      const response = await axios.put(url, data, {
        headers: { Authorization: `token ${GitToken}` },
      });
      console.log("✅ File updated successfully:", response.data);
      if (y == 0) {
        setStep2(10)
      }
      else if (y == 1) {
        setStep3(10)
      }
      else if (y == 2) {
        setStep4(10)
      }
      img("uploaded")
    } catch (error) {
      console.error("❌ Error updating file:", error.response ? error.response.data : error.message);
    }
  }

  const uploadToGitHub = async (file, img, id, y) => {

    if (!file) {
      if (y == 0) {
        setUploadProgress1(100)
        setStep2(10)
      }
      else if (y == 1) {
        setUploadProgress2(100)
        setStep3(10)
      }
      else if (y == 2) {
        setUploadProgress3(100)
        setStep4(10)
      }
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
      const token = GitToken;

      const url = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${filePath}`;

      const data = {
        message: `Upload ${filePath}`,
        content: base64String,
        branch: branch,
      };
      try {

        const response = await axios.get(`https://api.github.com/repos/${githubUsername}/${repoName}/contents/${filePath}`)

        updateFile(githubUsername, img, repoName, filePath, response.data.sha, base64String, y)


      } catch (error) {
        console.error("Error uploading file:", error.response?.data || error);
        try {
          const response = await axios.put(url, data, {
            headers: {
              Authorization: `Bearer ${GitToken}`,
              Accept: "application/vnd.github.v3+json",
            },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              if (y == 0) {
                setUploadProgress1(percent); // Update progress state
              }
              else if (y == 1) {
                setUploadProgress2(percent); // Update progress state
              }
              else if (y == 2) {
                setUploadProgress3(percent); // Update progress state
              }

            },
          });
          if (y == 0) {
            setStep2(10)
          }
          else if (y == 1) {
            setStep3(10)
          }
          else if (y == 2) {
            setStep4(10)
          }
          img("uploaded")

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
  useEffect(() => {
    const sumLoading = step1 + step2 + step3 + step4
    if (sumLoading == 40) {
      setLoading(false)
      alert("edited")
      navigate(0)
    }
  }, [step1, step2, step3, step4])

  return (
    <div>
      <div style={{ boxShadow: "0px 0px 20px gray" }} className="   mt-4 max-md:mx-auto bg-white border border-gray-200 rounded-lg shadow ">
        <p >
          <img className="rounded-t-lg mx-auto w-full h-[20rem]" src={`https://raw.githubusercontent.com/PisethPanha/ebook_photos/refs/heads/main/${img}`} alt="" />
        </p>
        <div className="p-5 gap-2 grid text-center">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{title}</h5>
          <p className="mb-3 font-normal text-gray-700 ">view: {view} <br /> download: {download}</p>
          <p onClick={() => setDialog(!dialog)}
            className=" text-center cursor-pointer w-[10rem] mx-auto items-center px-3 py-2 text-sm font-medium  text-white bg-blue-700 rounded-lg hover:bg-blue-800 outline-none">
            Preview

          </p>
          <p onClick={() => setEdit(!edit)}
            className="w-[10rem] mx-auto cursor-pointer items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 ">
            Edit

          </p>

          <p onClick={handleDelete}
            className="w-[10rem] mx-auto cursor-pointer items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 ">
            Delete

          </p>

        </div>

      </div>

      <div className={`  overflow-y-auto overflow-x-hidden fixed top-0  right-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${dialog ? "block" : "hidden"}`}>
        <div className="relative h-full mx-auto p-4">

          <div className="relative overflow-y-scroll border-2 border-gray-900 h-full bg-white rounded-lg shadow-sm ">

            <div className=" flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
              <h3 className=" text-xl font-semibold text-gray-900">
                Book details
              </h3>
              <button type="button" onClick={() => setDialog(!dialog)} className="fixed right-16 text-gray-400  bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="default-modal">
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
              <div className=" flex justify-center gap-4 items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
                <button data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Download</button>
                {/* <button onClick={() => setReading(true)} data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Read</button> */}
                <a target='blank' href={`https://drive.google.com/viewerng/viewer?embedded=true&url=${link}`} onClick={() => setDialog(!dialog)} data-modal-hide="default-modal" type="a href=''" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-blue-600  bg-blue-700 "><button className=' text-white duration-150'>Read</button></a>
              </div>
            </div>
          </div>
        </div>
        <div className={`w-full h-full absolute top-0 flex justify-center items-center z-50 ${imgZoom ? "block" : "hidden"}`}>
          <img src={`https://raw.githubusercontent.com/PisethPanha/ebook_photos/refs/heads/main/${imgWillZoom}`} alt="" className='border-4 border-gray-600 max-w-[50rem] max-h-[30rem]' />
          <div onClick={() => setImgZoom(!imgZoom)} className='w-full -z-10 h-full absolute top-0 flex justify-center items-center '></div>
        </div>

      </div>

      <div className={`  overflow-y-auto overflow-x-hidden fixed top-0  right-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${reading ? "block" : "hidden"}`}>
        <div className="relative h-full mx-auto p-4">

          <div className="relative overflow-y-scroll border-2 border-gray-900 h-full bg-white rounded-lg shadow-sm ">
            <button type="button" onClick={() => setReading(!reading)} className="fixed top-24 max-md:top-10 max-md:right-8 bg-slate-200 bg-opacity-50 right-16 text-gray-900  bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-hide="default-modal">
              <svg className="w-6 h-6 max-md:w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className='w-full h-full'>
            <iframe src={`https://drive.google.com/viewerng/viewer?embedded=true&url=https://raw.githubusercontent.com/PisethPanha/ebook_photos/refs/heads/main/${read}`} width="100%" height="100%"></iframe>

            </div>
          </div>
        </div>
        <div className={`w-full h-full absolute top-0 flex justify-center items-center z-50 ${imgZoom ? "block" : "hidden"}`}>
          <img src={`https://raw.githubusercontent.com/PisethPanha/ebook_photos/refs/heads/main/${imgWillZoom}`} alt="" className='border-4 border-gray-600 max-w-[50rem] max-h-[30rem]' />
          <div onClick={() => setImgZoom(!imgZoom)} className='w-full -z-10 h-full absolute top-0 flex justify-center items-center '></div>
        </div>

      </div>

      <div className={`  overflow-y-auto overflow-x-hidden fixed top-0  right-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${edit ? "block" : "hidden"}`}>

        <div role="status" className={`w-full fixed z-50 h-[100%] top-0 left-0 backdrop-blur-md justify-center ${loading ? "grid" : "hidden"} items-center `}>


          <div className="w-[10rem] bg-violet-700 h-[1.5rem] relative rounded-full overflow-hidden">
            <div className={`bg-blue-600 duration-200 h-[1.5rem] rounded-full w-full absolute right-full`} style={{
              transform: `translateX(${uploadProgress}%)`
            }} >

            </div>
            <div className='absolute z-40 flex items-center justify-center w-full'>
              <h1 className='text-center text-white font-[800]'>{Math.round(uploadProgress)}%</h1>
            </div>
          </div>


        </div>

        <div className="relative h-full mx-auto p-4">
          <div className="relative overflow-y-scroll border-2 border-gray-900 h-full bg-white rounded-lg shadow-sm ">
            <div className=" flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
              <h3 className=" text-xl  font-semibold text-gray-900 ">
                Edit Book
              </h3>
              <button type="button" onClick={() => { setEdit(!edit); navigate(0) }} className="fixed right-16 text-gray-400  bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-hide="default-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className=" grid items-center justify-center p-4 md:p-5 border-b rounded-t border-gray-200">
              <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900 ">
                Title
              </h3>
              <br />


              <input type="text" className={`mb-6 font-[700] text-[20px] ${isUpdated ? "border-4 border-blue-700" : "border-4 border-gray-900"} outline-none mx-auto bg-gray-300  text-gray-900 text-sm rounded-lg block max-lg:w-auto w-[30rem] p-4 `} value={BookTitle} onChange={(event) => setBookTitle(event.target.value)} />

              <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900">
                Link To downlod
              </h3>
              <br />
              <input type="text" disabled className={`mb-6 font-[700] text-[20px] outline-none mx-auto bg-gray-300 ${isUpdated ? "border-4 border-blue-700" : "border-4 border-gray-900"} text-gray-900 text-sm rounded-lg block max-lg:w-auto w-[30rem] p-4`} value={BookLink} onChange={(event) => setBookLink(event.target.value)} />
              <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900">
                Author
              </h3>
              <br />
              <input type="text" className={`mb-6 font-[700] text-[20px] outline-none mx-auto bg-gray-300 ${isUpdated ? "border-4 border-blue-700" : "border-4 border-gray-900"} text-gray-900 text-sm rounded-lg block max-lg:w-auto w-[30rem] p-4 `} value={BookAuthor} onChange={(event) => setBookAuthor(event.target.value)} />
              <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900">
                Publisher
              </h3>
              <br />
              <input type="text" className={`mb-6 font-[700] text-[20px] outline-none mx-auto bg-gray-300 ${isUpdated ? "border-4 border-blue-700" : "border-4 border-gray-900"} text-gray-900 text-sm rounded-lg block max-lg:w-auto w-[30rem] p-4 `} value={BookPublisher} onChange={(event) => setBookPublisher(event.target.value)} />


              <br />

              <form className="max-w-sm grid items-center justify-center mx-auto">
                <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900">Select an option</label>
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
                <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900">Select an option</label>
                <select onChange={(event) => {
                  setBookLanguage(event.target.value); console.log(BookLanguage);
                }} id="countries" className={`mb-6 max-lg:w-auto font-[700] text-[20px] outline-none mx-auto bg-gray-300 ${isUpdated ? "border-4 border-blue-700" : "border-4 border-gray-900"} text-gray-900 text-sm rounded-lg block w-[30rem] p-4 `}>
                  <option defaultValue={language}>Choose a book language</option>
                  <option value="foriegn">Foriegn</option>
                  <option value="khmer">Khmer</option>

                </select>
              </form>

              <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900">
                Description
              </h3>
              <textarea rows="4" className={`${isUpdated ? "border-4 border-blue-700" : "border-4 border-gray-900"} block font-[700] text-[20px] p-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg outline-none`} placeholder="Write your thoughts here..." value={BookDescrib} onChange={(event) => setBookDescrib(event.target.value)}></textarea>
              <br />
              <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900">
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
