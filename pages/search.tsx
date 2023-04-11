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
                        <div className="flex w-full justify-center p-16" role="status">
                            <svg aria-hidden="true" className="w-16 h-16 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
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