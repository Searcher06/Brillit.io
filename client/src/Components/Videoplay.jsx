import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"
import { useNavigate, useParams } from "react-router-dom"
import ReactPlayer from "react-player"
import { GetNew } from "./GetNew"
import { useContext, useEffect, useState } from "react"
import { Loader } from "./Loader"
import { VideoplayError } from "./VideoplayError"
import { SearchContext } from "../Context/SearchContext"
export default function Videoplay() {
    const { id } = useParams()
    const [videos, setVideos] = useState()
    const [loading, setLoading] = useState(true)
    const { search } = useContext(SearchContext)
    const [error, setError] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`http://localhost:8000/api/v1/videos/${id}?q=${search}`)
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                setVideos(data)
                console.log(data)
                setLoading(false)
            })
            .catch((error) => {
                setError(error)
                setLoading(false)
                console.log(error)
            })
    }, [id])





    return <>
        <Navbar />
        <Sidebar />
        <section id="main_content" className=" ml-18 mt-18 flex justify-center flex-col">
            <section id="video-container" className="w-[98%] h-[400px] flex items-center">
                {
                    loading ? <Loader /> : error ? <VideoplayError error={error} /> : <>
                        <div className="w-[950px] h-[400px]">
                            {/* <video src="/src/assets/video.mp4" className="w-full h-full" controls={true}></video> */}

                            <ReactPlayer
                                url={`https://www.youtube.com/watch?v=${id}`}
                                width={"100%"}
                                height={"100%"}
                                controls={true}
                                config={{
                                    youtube: {
                                        playerVars: {
                                            modestbranding: 1,
                                            rel: 0,
                                            showinfo: 0,
                                            controls: 1
                                        }
                                    }
                                }}
                                style={{
                                    all: "unset"
                                }}
                            />
                        </div>
                        <div className="flex flex-wrap overflow-x-hidden overflow-y-auto h-[400px] w-2xl justify-center">
                            {
                                loading ? <Loader /> : videos.error ? null : videos.channelVideos.items.map((current, index) => {
                                    const date = new Date(current.snippet.publishedAt)
                                    return <div key={index} onClick={() => { navigate(`/videos/${current.id.videoId}`) }}
                                        className="font-[calibri] m-3">
                                        <div style={{ backgroundImage: `url(${current.snippet.thumbnails.medium.url})` }}
                                            className={`bg-center rounded-sm bg-cover h-39 w-60 flex items-end justify-end`}>
                                            <span className="text-sm  text-white font-[calibri] bg-black/80 rounded-xs px-1 py-0 mb-1 mr-1">{current.time}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-[15px]">{current.snippet.title.slice(0, 30) + '...'}</p>
                                            <div className="flex justify-between text-[13px] text-gray-700">
                                                <p>{current.snippet.channelTitle}</p>
                                                <p>{<GetNew date={date} />}</p>
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </>
                }
            </section>
            <section className={`w-full mt-5 ${error || loading ? 'hidden' : 'block'} ${videos?.error ? 'hidden' : 'block'}`}>
                <h1 className="font-[calibri] text-2xl font-medium">Recommended videos</h1>
                <div className="w-full flex flex-wrap justify-start">
                    {
                        loading ? <Loader /> : error ? <VideoplayError error={error} /> : videos.error ? null :
                            videos.recommendedVideos.map((current, index) => {
                                const date = new Date(current.publishedAt)
                                return <div key={index} className="font-[calibri] m-3">
                                    <div className={`bg-center rounded-sm bg-cover h-40 w-68 flex items-end justify-end`}
                                        style={{ backgroundImage: `url(${current.thumbnails.medium})` }}
                                    >
                                        <span className="text-sm  text-white font-[calibri] bg-black/80 rounded-xs px-1 py-0 mb-1 mr-1">{current.time}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-[15.5px]">{current.title.slice(0, 30) + '...'}</p>
                                        <div className="flex justify-between text-[13px] text-gray-700">
                                            <p>{current.channelTitle}</p>
                                            <p>{<GetNew date={date} />}</p>
                                        </div>
                                    </div>
                                </div>
                            })
                    }

                </div>
            </section>
        </section>
    </>
}