import "./editLecture.css"
import React, { useState, useContext, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import LMScontext from "../../context/LMScontext";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import axios from "axios";
import { toast } from "react-toastify";

export default function EditLecture() {
    const [lectureTitle, setLectureTitle] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [isPreviewFree, setIsPreviewFree] = useState(false);
    const { backendURL } = useContext(LMScontext);
    const { lectureId } = useParams();
    const { courseId } = useParams();
    const [singleLecture, setSingleLecture] = useState("");
    const navigate = useNavigate();

    const updateLecture = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("lectureTitle", lectureTitle);
            formData.append("videoUrl", videoUrl);
            formData.append("isPreviewFree", isPreviewFree);
            const response = await axios.post(`${backendURL}/api/lecture/edit/${lectureId}`, formData);
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }


    const removeLecture = async () => {
        try {
            const response = await axios.post(`${backendURL}/api/lecture/remove/${courseId}/${lectureId}`);
            if (response.data.success) {
                toast.success(response.data.message);
                navigate(`/admin/course/${courseId}/lecture`);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const getSingleLecture = async () => {
        try {
            let response = await axios.get(`${backendURL}/api/lecture/single/${lectureId}`);
            if (response.data.success) {
                const lecture = response.data.findedLecture;
                setSingleLecture(lecture);
                setLectureTitle(lecture.lectureTitle);
                setVideoUrl(lecture.videoUrl);
                setIsPreviewFree(lecture.isPreviewFree);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getSingleLecture();
    }, []);

    return (
        <div className="editLecturePage">
            <div className="editLecturePageHead">
                <button onClick={() => navigate(`/admin/course/${courseId}/lecture`)} className="backBtn">
                    <ArrowBackIcon />
                </button>
                <div>
                    <h1>Edit Lecture</h1>
                    <p>Update lecture details and content</p>
                </div>
            </div>

            <div className="editLectureContainer">
                <div className="remLectDiv">
                    <div className="editBasicInfo">
                        <h3>Lecture Information</h3>
                        <p>Make changes and click save when you done</p>
                    </div>
                    <button onClick={removeLecture} className="btnType2 deleteBtn">Remove Lecture</button>
                </div>

                <form onSubmit={updateLecture} className="editlectureForm">
                    <div className="formGroup">
                        <label>Title</label>
                        <input onChange={(e) => setLectureTitle(e.target.value)} type="text" placeholder="Your lecture title" value={lectureTitle} />
                    </div>
                    <div className="formGroup">
                        <label>Video <StarIcon className="starIcon" /></label>
                        <div className="thumbnailUpload">
                            <label className="fileChoosen" htmlFor="upVid">
                                {
                                    !videoUrl ?
                                        <p>No file chosen</p>
                                        :
                                        <p>{typeof videoUrl === 'string' ? 'Existing video' : videoUrl?.name}</p>
                                }
                            </label>
                            <input onChange={(e) => setVideoUrl(e.target.files[0])} id="upVid" type="file" hidden />
                        </div>
                    </div>
                    <div className="formGroup checkboxGroup">
                        <input onChange={() => setIsPreviewFree(!isPreviewFree)} type="checkbox" checked={isPreviewFree} id="freePreview" />
                        <label htmlFor="freePreview">Is this video FREE?</label>
                    </div>
                    <div className="formActions">
                        <button type="button" onClick={() => navigate(`/admin/course/${courseId}/lecture`)} className="btnType2">Cancel</button>
                        <button type="submit" className="btnType1">Update Lecture</button>
                    </div>
                </form>
            </div>
        </div>
    )
}