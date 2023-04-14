import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import Head from "next/head";
import Layout from '@/components/Layout'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { YtUploadModal } from "@/components/modals/YtUploadModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from "@/components/LoadingSpinner";

export interface YtVideo {
    ago: string;
    author: {
        name: string,
        url: string
    };
    description: string;
    duration: {
        seconds: number;
        timestamp: string;
    };
    image: string;
    seconds: number;
    thumbnail: string;
    timestamp: string;
    title: string;
    type: string;
    url: string;
    videoId: string;
    views: number;
}

export default function Search() {

    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedYtVideo, setSelectedYtVideo] = useState<YtVideo | undefined>(undefined);
    const [ytVideos, setYtVideos] = useState<YtVideo[]>([]);
    const [ytModalOpened, setYtModalOpened] = useState<boolean>(false);

    const fetchYtData = async () => {
        setLoading(true);
        const q = router.asPath.split('?q=').pop();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/yt-search?q=${q}`, {
            headers: {
                'Authentication': process.env.NEXT_PUBLIC_AUTH_TOKEN as string
            }
        });
        const songsRes = await res.json();
        setYtVideos(songsRes.videos)
        setLoading(false);
    }

    const addToLibrary = (video: YtVideo) => {
        setSelectedYtVideo(video);
        setYtModalOpened(true);
    }

    const onYtModalSuccess = (res: any) => {
        toast.success(res.message);
        setYtModalOpened(false);
    }

    const onYtModalError = (e: any) => {
        toast.error(e.error);
        console.error(e);
        setYtModalOpened(false);
    }

    useEffect(() => {
        fetchYtData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        fetchYtData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.asPath])

    return (
        <>
            <Head>
                <title>Muzik | Search</title>
                <meta name="description" content="Personal muzik storage and player" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                <div className="flex flex-col items-start p-6 w-full mx-auto max-w-screen-xl">
                    <Link
                        href="/"
                        className="text-white font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 bg-lightblue hover:bg-lighterblue focus:outline-none ml-6"
                    >
                        Back to library
                    </Link>
                    {loading &&
                        <LoadingSpinner width={16} height={16}/>
                    }
                    {!loading &&
                        <ul className="flex flex-wrap justify-between">
                            {ytVideos.map(video => 
                                <li className="flex flex-col p-6" key={video.videoId}>
                                    <div className="flex">
                                        <iframe
                                            className="rounded-t-lg"
                                            width="360"
                                            height="220"
                                            src={`https://www.youtube.com/embed/${video.videoId}`}
                                            title={video.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        />
                                    </div>
                                    <button
                                        className="flex items-center justify-center p-3 text-sm rounded-b-lg bg-lightblue hover:bg-lighterblue"
                                        onClick={() => addToLibrary(video)}
                                    >
                                        <FontAwesomeIcon
                                            icon={faPlus}
                                            style={{ fontSize: 16, color: "white" }}
                                        />
                                        <span className="text-white ml-2">Add to library</span>
                                    </button>
                                </li>
                            )}
                        </ul>
                    }
                </div>
            </Layout>
            <YtUploadModal
                opened={ytModalOpened}
                selectedYtVideo={selectedYtVideo}
                onClose={() => setYtModalOpened(false)}
                onSuccess={onYtModalSuccess}
                onFail={onYtModalError}
            />
            <ToastContainer />
        </>
    )
}