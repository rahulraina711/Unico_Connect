/* eslint-disable react-hooks/exhaustive-deps */
import React  , {useState , useEffect} from "react";
import { useParams , useNavigate } from "react-router-dom"
import axios from "axios";
import "./profileUpdate.scss";
import Error from "../Error/Error";
import placeholder from "../../Assets/images/placeholder.png"


export default function ProfileUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [selectedImage, setSelectedImage] = useState(null);
  let [ full_name , setFullName ] = useState("");
  let [ profile , setProfile ] = useState("");
  let [ error , setError ] = useState("");
 

  const getUser = async (userId) => {
    let user = await axios.get("http://localhost:4000"+`/user/${userId}`)
    console.log(user.data);
    setFullName(user.data.full_name);
    user.data.image_url ? setProfile(user.data.image_url) : setProfile(placeholder);
  }

  useEffect(()=>{
    getUser(id)
  },[])

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => resolve((reader.result), false);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
      
    });
  }

  const readFile = async (file) => {
      let base64string = await getBase64(file);
      if(typeof base64string === "string" & base64string !== ""){
        let request = {
            base64string : base64string.split("base64,")[1],
            fileName : Date.now(),
            contentType : file.type
        }

        console.log(request);
        return await axios.post("http://localhost:4000/image/profile", request)
      }
  }

  const update = async (file) => {
    let payload = {
      full_name : full_name,
    }
    if(!full_name){
      setError("Name cannot be empty !");
      return
    }
    if(file){
      let response = await readFile(file);
      console.log("image api response data: ",response.data)
      if(response.data.success){
        payload["image_url"] =  response.data.image_url;
      }
    }
    let tkn_detalis = JSON.parse(localStorage.getItem("accessToken"));

    let updateResp = await axios.patch(`http://localhost:4000/user/${id}`,payload,{headers : {
      Authorization : `Bearer ${tkn_detalis.accessToken}`
    }});

    console.log("user update resp: ",updateResp.data);
    navigate("/");

  }

  return (
    <div className="update-main">
      {error && <Error message={error} />}
      {<img src={!selectedImage ? profile : URL.createObjectURL(selectedImage)} alt="profile" />}
      <div className="name-change">
        <p className="label">Profile : </p>
        <input
          type="file"
          name="myImage"
          onChange={async(event) => {   
            console.log("files: ",event.target.files[0]);
            setSelectedImage(event.target.files[0]);
          }}
        />
      </div>
      <div className="name-change">
        <p className="label">Name : </p>
        <input value={full_name} onChange={e=>setFullName(e.target.value)} />
      </div>
      <p className="update" onClick={()=>update(selectedImage)}>Update</p>
      <p className="cancel" onClick={()=>navigate("/")}>Cancel</p>
    </div>
  );
};
