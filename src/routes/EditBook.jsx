import axios from 'axios'
import React, { useEffect, useState } from 'react'
import BookCard from '../component/BookCard'
import { useNavigate } from 'react-router-dom';
import ProtectRoute from '../component/ProtectRoute';


function EditBook() {
  const [data, setData] = useState([])
  const [idd, setID] = useState(null)
  const [result, setResult] = useState([])
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(10)
  const [more, setMore] = useState(true)
  const [dropdown, setDropdown] = useState();
  const [catagory, setGatagory] = useState("")
  const [language, setLanguage] = useState("")
  const [insertForm, setInsertForm] = useState(false)
  const [BookTitle, setBookTitle] = useState("")
  const [BookType, setBookType] = useState("")
  const [BookDescrib, setBookDescrib] = useState("")
  const [BookLink, setBookLink] = useState(null)
  const [BookAuthor, setBookAuthor] = useState("")
  const [BookPublisher, setBookPublisher] = useState("")
  const [BookImage1, setBookImage1] = useState("")
  const [BookImage2, setBookImage2] = useState("")
  const [BookImage3, setBookImage3] = useState("")
  const [BookNameImage1, setBookNameImage1] = useState("")
  const [BookNameImage2, setBookNameImage2] = useState("")
  const [BookNameImage3, setBookNameImage3] = useState("")
  const [BookLanguage, setBookLanguage] = useState("")
  const [keyword, setKeyword] = useState("")
  const [style1, setStyle1] = useState(null)
  const [style2, setStyle2] = useState(null)
  const [style3, setStyle3] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isUpload1, setIsUpload1] = useState("ADD")
  const [isUpload2, setIsUpload2] = useState("ADD")
  const [isUpload3, setIsUpload3] = useState("ADD")
  const [maxTimeUpload, setMaxTimeUpload] = useState(0)
  const [uploadProgress1, setUploadProgress1] = useState(0)
  const [uploadProgress2, setUploadProgress2] = useState(0)
  const [uploadProgress3, setUploadProgress3] = useState(0)
  const [uploadProgress4, setUploadProgress4] = useState(0)
  const [uploadProgress5, setUploadProgress5] = useState(0)
  const [uploadProgress6, setUploadProgress6] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileReady1, setFileReady1] = useState(0)
  const [fileReady2, setFileReady2] = useState(0)
  const [fileReady3, setFileReady3] = useState(0)
  const [fileReady4, setFileReady4] = useState(0)
  const [fileReady5, setFileReady5] = useState(0)

  let fileReady = [setFileReady1, setFileReady2, setFileReady3, setFileReady4, setFileReady5]
  let images = [BookImage1, BookImage2, BookImage3]
  let upStatus = [setIsUpload1, setIsUpload2, setIsUpload3]
  const navigate = useNavigate();



  async function handleSubmit() {
    if (
      BookTitle == "" ||
      BookDescrib == "" ||
      BookLink == "" ||
      BookAuthor == "" ||
      BookPublisher == "" ||
      BookNameImage1 == "" ||
      BookNameImage2 == "" ||
      BookNameImage3 == "" ||
      BookLanguage == "" ||
      BookType == ""
    ) {
      alert("All field can not empty !!!")

    } else {

      const today = new Date();
      const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const dd = String(today.getDate()).padStart(2, '0');
      const yyyy = today.getFullYear();
      const formattedDate = `${mm}/${dd}/${yyyy}`;
      setLoading(!loading)
      axios.post("https://carefree-empathy-production.up.railway.app/add", {
        title: BookTitle,
        description: BookDescrib,
        link: BookLink.name,
        author: BookAuthor,
        publisher: BookPublisher,
        image1: BookNameImage1,
        image2: BookNameImage2,
        image3: BookNameImage3,
        language: BookLanguage,
        date: formattedDate,
        type: BookType
      },
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress4(percent); // Update progress state
          },
        }).then((res) => {

          console.log(res.data);

          res.data.id && setFileReady1(1);
          setID(res.data.id);
          for (let y = 0; y < 3; y++) {
            uploadToGitHub(images[y], upStatus[y], res.data.id, y)
          }
          uploadPDFToGitHub(BookLink, (link) => {
            console.log(link);
          }, res.data.id + 1)



        })
    }

  }

  const handleImageChange = (file, setStyle) => {

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setStyle(`url(${imageUrl}) no-repeat center/contain `);
    }
  };
  const uploadToGitHub = async (file, img, id, increment) => {

    if (!file) {
      alert("Please select a file first.");
      return;
    }


    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64String = reader.result.split(",")[1];

      const githubUsername = "PisethPanha";
      const repoName = "ebook_photos";
      const filePath = `${id + 1 + file.name}`; // Upload directly to the root directory
      const branch = "main"; // Change branch if needed
      const token = "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";

      const url = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${filePath}`;

      const data = {
        message: `Upload ${filePath}`,
        content: base64String,
        branch: branch,
      };

      try {
        const response = await axios.put(url, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            if (increment == 0) {
              setUploadProgress1(percent); // Update progress state
            } else if (increment == 1) {
              setUploadProgress2(percent);
            } else if (increment == 2) {
              setUploadProgress3(percent);
            }
          },
        });

        console.log("File uploaded:", response.data);
        if (increment == 0) {
          setFileReady2(1)
          console.log(fileReady1 + fileReady2 + fileReady3 + fileReady4 + fileReady5);
        } else if (increment == 1) {
          setFileReady3(1)
          console.log(fileReady1 + fileReady2 + fileReady3 + fileReady4 + fileReady5);
        } else if (increment == 2) {
          setFileReady4(1)
          console.log(fileReady1 + fileReady2 + fileReady3 + fileReady4 + fileReady5);
        }
        img("uploaded")
        console.log(filePath);


      } catch (error) {
        console.error("Error uploading file:", error.response?.data || error);

        img("fail upload, we'll upload again !!!")
        uploadToGitHub(file, img, id, increment);

      }
    };
  };

  function handleSearch(key) {

    axios.get('https://carefree-empathy-production.up.railway.app/admin_search', { params: { keyword: key, catagory: catagory, language: language } }).then((res) => { setResult(res.data); }
    )

  }
  function handleKeyClick(key) {
    setLoading(true)
    axios.get('https://carefree-empathy-production.up.railway.app/admin_search', { params: { keyword: key, catagory: catagory, language: language } }).then((res) => { setData(res.data); setLoading(false) }
    )
    setMore(false)
  }
  function handleSearchButton() {
    setLoading(true)
    if (catagory == "" && language == "" && keyword == "") {
      setOffset(0);
      setLimit(10)
      axios.get("https://carefree-empathy-production.up.railway.app/getbook", { params: { offset: 0, limit: 10, language: '' } }).then((res) => {
        setData(res.data.reverse());
        setLoading(false)
        setMore(true)
      })
      setMore(false)
    } else {
      axios.get('https://carefree-empathy-production.up.railway.app/admin_search', { params: { keyword: keyword, catagory: catagory, language: language } }).then((res) => { setData(res.data); setLoading(false) }
      )
      setMore(false)
    }
  }

  useEffect(() => {
    const sumFileReady1 = fileReady1 + fileReady2 + fileReady3 + fileReady4 + fileReady5
    if (sumFileReady1 == 5) {
      alert("All Done")
      navigate(0)
      setLoading(false)
    }


    console.log("file ready1:", sumFileReady1);
  }, [fileReady1, fileReady2, fileReady3, fileReady4, fileReady5])

  const uploadPDFToGitHub = async (file, img, id) => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    // Ensure only PDF files are uploaded
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }
    setLoading(true)
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64String = reader.result.split(",")[1];

      const githubUsername = "PisethPanha";
      const repoName = "ebook_photos";
      const filePath = `${id + file.name}`; // Store PDFs in a separate folder
      const branch = "main"; // Change branch if needed
      const token = "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";

      const url = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${filePath}`;

      const data = {
        message: `Upload ${file.name}`,
        content: base64String,
        branch: branch,
      };

      try {
        console.log("uploading please wait....");

        const response = await axios.put(url, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress5(percent); // Update progress state
          },
        });

        console.log("File uploaded:", response.data);




        const downloadUrl = `https://raw.githubusercontent.com/${githubUsername}/${repoName}/${branch}/${filePath}`;


        img(downloadUrl);

        console.log("Download Link:", downloadUrl);
        axios.get("https://carefree-empathy-production.up.railway.app/changeDownloadLink", { params: { id: id, link: downloadUrl } }).then((res) => {
          console.log(res.data);
          ; res.data.message == "updated" && handleUpload(file, id)
        })
      } catch (error) {
        console.error("Error uploading file:", error.response?.data || error);

        img("Failed to upload. Retrying...");

        uploadPDFToGitHub(file, img, id);


      }
    };
  };

  useEffect(() => {
    setLoading(true)
    axios.get("https://carefree-empathy-production.up.railway.app/getbook", { params: { offset: offset, limit: limit, language: '' } }).then((res) => {
      setData(res.data); console.log(res); setLoading(false)
    })
  }, [])


  function fetchMoreData() {
    axios.get("https://carefree-empathy-production.up.railway.app/getbook", { params: { offset: offset + 10, limit: limit, language: '' } }).then((res) => {
      if (res.data.length == 0) {
        setMore(false)
      } else {
        setData([...data, ...res.data]); console.log(res.data);
      }
    })
    setOffset(offset + 10)
  }

  const handleUpload = async (file, id) => {
    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }
    console.log(id);

    const formData = new FormData();
    formData.append("pdf", BookLink); // Must match 'pdf' in backend
    formData.append("id", id); // Must match 'pdf' in backend

    console.log(BookLink);

    await axios.post("https://carefree-empathy-production.up.railway.app/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }, responseType: "blob",
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress6(percent); // Update progress state
      },
    },).then((res) => {
      const blob = new Blob([res.data], { type: "application/pdf" });
      console.log("Received PDF File:", blob);
      setFileReady5(1)
    }
    );
  };
  useEffect(() => {
    const sum = uploadProgress1 + uploadProgress2 + uploadProgress3 + uploadProgress4 + uploadProgress5 + uploadProgress6
    const percent = sum * 100
    setUploadProgress(percent / 600)
    console.log(uploadProgress);
    
    
  },[uploadProgress1, uploadProgress2, uploadProgress3, uploadProgress4, uploadProgress5, uploadProgress6])

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 rounded-lg ">
        <div className='flex items-center justify-center'>
          <form className="max-w-lg mx-auto flex gap-4  ">
            <div className="flex h-[3rem]">
              <div className='relative'>
                <ProtectRoute />
                <label htmlFor="dropdown" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Your Email</label>
                <button onClick={() => setDropdown(1)} id="dropdown-button" data-dropdown-toggle="dropdown" className=" h-[3rem] flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 outline-none" type="button">{catagory == "" ? "All Catagory" : catagory} <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>

                </button>
                <div id="dropdown" className={`z-40 ${dropdown == 1 ? "block" : "hidden"} bg-white left-0 top-0 h-[3rem] divide-y absolute mt-11 divide-gray-100 rounded-lg shadow w-auto dark:bg-gray-700`}>
                  <ul className="py-2 shadow-lg shadow-black overflow-y-scroll h-[40vh] text-sm text-gray-700 w-[10rem] bg-white dark:text-gray-200" >
                    <li>
                      <button type="button" onClick={() => { setDropdown(0); setGatagory("") }}
                        className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">All</button>
                    </li>
                    <li>
                      <button type="button" onClick={() => { setGatagory("IT"); setDropdown(0) }} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">IT</button>
                    </li>
                    <li>
                      <button type="button" onClick={() => { setGatagory("constructor"); setDropdown(0) }} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Constructor</button>
                    </li>
                    <li>
                      <button type="button" onClick={() => { setGatagory("agreculture"); setDropdown(0) }} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Agreculture</button>
                    </li>
                    <li>
                      <button type="button" onClick={() => { setGatagory("accounting"); setDropdown(0) }} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Accounting</button>
                    </li>
                    <li>
                      <button type="button" onClick={() => { setGatagory("law"); setDropdown(0) }} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Law</button>
                    </li>
                    <li>
                      <button type="button" onClick={() => { setGatagory("chinese"); setDropdown(0) }} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Chinese</button>
                    </li>
                    <li>
                      <button type="button" onClick={() => { setGatagory("english"); setDropdown(0) }} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">English</button>
                    </li>
                    <li>
                      <button type="button" onClick={() => { setGatagory("general"); setDropdown(0) }} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">General Knowledg</button>
                    </li>
                    <li>
                      <button type="button" onClick={() => { setGatagory("electric"); setDropdown(false) }} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Electric</button>
                    </li>
                    <li>
                      <button type="button" onClick={() => { setGatagory("electronic"); setDropdown(false) }} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Electronic</button>
                    </li>
                    <li>
                      <button type="button" onClick={() => { setGatagory("animal"); setDropdown(false) }} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Animal husbandry</button>
                    </li>
                    <li>
                      <button type="button" onClick={() => { setGatagory("other"); setDropdown(0) }} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Other</button>
                    </li>
                  </ul>
                </div>

              </div>
              <div className='relative'>
                <label htmlFor="search-dropdown" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Your Email</label>
                <button onClick={() => setDropdown(2)} id="dropdown-button" data-dropdown-toggle="dropdown" className="h-[3rem] flex-shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 hover:bg-gray-200 outline-none" type="button">{language == "" ? "All Language" : language} <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>

                </button>
                <div id="dropdown" className={`z-40 ${dropdown == 2 ? "block" : "hidden"} left-0 top-0 bg-white h-[3rem] divide-y absolute mt-11 divide-gray-100 rounded-lg shadow w-auto dark:bg-gray-700`}>
                  <ul className="py-2 shadow-lg shadow-black text-sm text-gray-700 bg-white dark:text-gray-200" >
                    <li>
                      <button type="button" onClick={() => { setLanguage(""); setDropdown(0) }} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">All</button>
                    </li>
                    <li>
                      <button type="button" onClick={() => { setLanguage("foriegn"); setDropdown(0) }} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Foriegn</button>
                    </li>
                    <li>
                      <button type="button" onClick={() => { setLanguage("khmer"); setDropdown(0) }} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Khmer</button>
                    </li>

                  </ul>
                </div>

              </div>
              <div className="relative w-full">
                <input onChange={(event) => { setKeyword(event.target.value); handleSearch(event.target.value); event.target.value != "" ? setDropdown(3) : setDropdown(0) }} autoComplete='off' type="search" id="search-dropdown" className="block p-2.5 md:w-full z-20 h-[3rem] text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300  outline-none" placeholder="Search ..." />
                <button type='button' onClick={handleSearchButton} className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                  <span className="sr-only">Search</span>
                </button>
                <div id="dropdown" className={`z-40 ${dropdown == 3 ? "block" : "hidden"} left-0 top-0 bg-white h-[3rem] divide-y absolute mt-11 divide-gray-100 rounded-lg shadow w-[10rem] dark:bg-gray-700`}>
                  <ul className="py-2 text-sm text-gray-700 bg-white dark:text-gray-200" >

                    {result.map((ele, i) =>
                      <li key={i}>
                        <button type="button" onClick={() => { setDropdown(0); handleKeyClick(ele.Title) }} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{ele.Title}</button>
                      </li>)}

                  </ul>
                </div>
                <div className={`fixed w-full h-full top-0 left-0 z-10 ${dropdown == 3 ? "block" : "hidden"}`} onClick={() => setDropdown(0)}></div>
              </div>
            </div>
            <button type='button' onClick={() => setInsertForm(!insertForm)} className='bg-blue-700 h-[3rem] hover:bg-blue-600 duration-100 max-md:text-[15px] outline-none px-2 rounded-lg text-white font-[700]'>ADD BOOK</button>
          </form>
          <br />
          <br />
          <br />
          <br />

          <div className={`  overflow-y-auto overflow-x-hidden fixed top-0  right-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${insertForm ? "block" : "hidden"}`}>
            <div role="status" className={`${loading ? "block" : "block"} h-full fixed w-full justify-center items-center flex`}>
              <svg aria-hidden="true" className="w-8 mx-auto h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
            <div className="relative h-full mx-auto p-4">
              <div className="relative overflow-y-scroll border-2 border-gray-900 h-full  bg-white rounded-lg shadow-sm ">
                
                <div role="status" className={`w-full fixed z-50 h-[100vh] top-0 left-0 backdrop-blur-md justify-center ${loading ? "grid" : "hidden"} items-center `}>
                  

                  <div className="w-[10rem] bg-violet-700 h-[1.5rem] relative rounded-full overflow-hidden  dark:bg-gray-700">
                    <div className={`bg-blue-600 h-[1.5rem] rounded-full w-full absolute right-full`} style={{
                      transform: `translateX(${uploadProgress}%)`
                    }} >
                    
                    </div>
                    <div className='absolute z-40 flex items-center justify-center w-full'>
                    <h1 className='text-center text-white font-[800]'>{Math.round(uploadProgress)}%</h1>
                  </div>
                  </div>
                  
                  
                </div>
                <div className=" flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                  <h3 className=" text-xl  font-semibold text-gray-900 dark:text-white">
                    Add Book
                  </h3>
                  <button type="button" onClick={() => setInsertForm(!insertForm)} className="fixed right-16 text-gray-400  bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
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
                  <input
                    type="text" className="mb-6 font-[700] text-[20px] outline-none mx-auto bg-gray-300 border-4 border-gray-900 text-gray-900 text-sm rounded-lg block  max-md:w-auto  w-[30rem] p-4 " onChange={(event) => setBookTitle(event.target.value)} />

                  <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900 dark:text-white">
                    PDF file
                  </h3>
                  <br />
                  <input type="file" accept='.pdf' className="mb-6 font-[700] text-[20px] outline-none mx-auto bg-gray-300 border-4 border-gray-900 text-gray-900 text-sm rounded-lg block max-md:w-auto w-[30rem] p-4 " onChange={(event) => { setBookLink(event.target.files[0]); }} />
                  <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900 dark:text-white">
                    Author
                  </h3>
                  <br />
                  <input type="text" className="mb-6 font-[700] text-[20px] outline-none mx-auto bg-gray-300 border-4 border-gray-900 text-gray-900 text-sm rounded-lg block max-md:w-auto w-[30rem] p-4 " onChange={(event) => setBookAuthor(event.target.value)} />
                  <h3 className="uppercase mx-auto text-xl font-semibold text-gray-900 dark:text-white">
                    Publisher
                  </h3>
                  <br />
                  <input type="text" className="mb-6 font-[700] text-[20px] outline-none mx-auto bg-gray-300 border-4 border-gray-900 text-gray-900 text-sm rounded-lg block max-md:w-auto w-[30rem] p-4 " onChange={(event) => setBookPublisher(event.target.value)} />

                  <br />

                  <form className="max-w-sm grid items-center justify-center mx-auto">
                    <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
                    <select id="type" className="mb-6 font-[700] text-[20px] outline-none mx-auto bg-gray-300 border-4 border-gray-900 text-gray-900 text-sm rounded-lg block max-md:w-auto w-[30rem] p-4 " onChange={(event) => setBookType(event.target.value)}>
                      <option defaultValue="">Choose a book type</option>
                      <option value="IT">Information Technology</option>
                      <option value="constructor">Constructor</option>
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
                    <select id="countries" className="mb-6 font-[700] text-[20px] outline-none mx-auto bg-gray-300 border-4 border-gray-900 text-gray-900 text-sm rounded-lg block max-md:w-auto w-[30rem] p-4 " onChange={(event) => setBookLanguage(event.target.value)}>
                      <option defaultValue="">Choose a book language</option>
                      <option value="foriegn">Foriegn</option>
                      <option value="khmer">Khmer</option>

                    </select>
                  </form>


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
                        background: style1, // Replace with your image URL


                      }}
                    >
                      <input
                        id="file-upload"
                        type="file" accept=".jpg, .png"
                        onChange={(event) => { setBookImage1(event.target.files[0]); handleImageChange(event.target.files[0], setStyle1); setBookNameImage1(event.target.files[0].name) }}
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
                        background: style2, // Replace with your image URL

                      }}
                    >
                      <input
                        id="file-upload"
                        type="file" accept=".jpg, .png"
                        onChange={(event) => { setBookImage2(event.target.files[0]); handleImageChange(event.target.files[0], setStyle2); setBookNameImage2(event.target.files[0].name) }}
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
                        background: style3, // Replace with your image URL

                      }}
                    >
                      <input
                        id="file-upload"
                        type="file" accept=".jpg, .png"
                        onChange={(event) => { setBookImage3(event.target.files[0]); handleImageChange(event.target.files[0], setStyle3); setBookNameImage3(event.target.files[0].name) }}
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
        <div className='grid relative justify-center items-center'>

          <div className='grid grid-cols-3 max-md:grid-cols-1 gap-4 max-md:items-center max-md:justify-center'>
            {
              loading ?
                <div role="status" className={`left-0 h-[100vh] top-0 fixed w-full justify-center items-center flex`}>
                  <svg aria-hidden="true" className="w-8 mx-auto h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
                :
                data.map((ele, i) => <BookCard key={i} read={ele.read_link} view={ele.view} download={ele.download} language={ele.language} type={ele.type} author={ele.autor} publisher={ele.publisher} publish_date={ele.publish_date} id={ele.id} img={ele.img} title={ele.Title} describ={ele.describetion} link={ele.link_download} img1={ele.img_content1} img2={ele.img_content2} img3={ele.img_content3} />)}
          </div>
          <br />
          <button onClick={fetchMoreData} className={` font-[700] text-[20px] text-white bg-blue-700 hover:bg-pink-700 duration-100 hover:shadow-xl hover:shadow-pink-400 w-[10rem] mx-auto rounded-lg ${more ? "block" : "hidden"}`}>More</button>
          <button className={` font-[700] text-[20px] text-white bg-blue-700 duration-100  w-[10rem] mx-auto rounded-lg ${more ? "hidden" : "block"}`}>No More</button>
        </div>
      </div>
    </div>

  )
}

export default EditBook