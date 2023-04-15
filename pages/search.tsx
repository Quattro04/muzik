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
import { Song, useSongs } from "@/context/SongsContext";
import { useApi } from "@/hooks/useApi";

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
    const [query, setQuery] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedYtVideo, setSelectedYtVideo] = useState<YtVideo | undefined>(undefined);
    const [ytVideos, setYtVideos] = useState<YtVideo[]>([]);
    const [ytModalOpened, setYtModalOpened] = useState<boolean>(false);

    const { songs, fetchSongs } = useSongs();
    const { addUserToSong, getYtVideos } = useApi();

    useEffect(() => {
        fetchSongs();
    }, [])

    const fetchYtData = async () => {
        if (!query) {
            return
        }
        setLoading(true);
        const videos = await getYtVideos(query)
        setYtVideos(videos)
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
        if (query) {
            fetchYtData();
        }
    }, [query])

    useEffect(() => {
        setQuery(router.asPath.split('?q=').pop());
    }, [router.asPath])

    const compareToQuery = (file: string) => {
        return query ? file.toLowerCase().includes(decodeURI(query).toLowerCase()) : false;
    }

    const addFromServer = async (song: Song) => {
        const res = await addUserToSong(song);
        if (res.message) {
            toast.success(res.message);
        }
    }

    return (
        <>
            <Head>
                <title>Muzik | Search</title>
                <meta name="description" content="Personal muzik storage and player" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                <div className="flex flex-col p-6 items-start w-full mx-auto max-w-screen-xl">
                    <Link
                        href="/"
                        className="text-white font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 bg-lightblue hover:bg-lighterblue focus:outline-none mb-4"
                    >
                        Back to library
                    </Link>
                    <div className="flex flex-col w-full mb-4">
                        <h2 className="text-white text-lg mb-3">On server:</h2>
                        <ul className="flex w-full flex-col mb-auto divide-y divide-lightblue mx-auto max-w-screen-xl">
                            {songs.filter(s => compareToQuery(s.file)).map(song =>
                                <li
                                    key={song.id}
                                    className="relative basis-12 flex items-center flex-1 pr-4 rounded"
                                >
                                    <img className="mr-4 sm:mr-8 rounded" src={song.image} width={55} height={40} alt="Art cover" />
                                    <span className="text-white flex-1 text-xs sm:text-sm mr-4">{song.title}</span>
                                    <span className="text-white flex-1 text-xs sm:text-sm opacity-80 mr-4">{song.artist}</span>
                                    <span className="text-white text-xs sm:text-sm opacity-80 mr-4">
                                        By: {song.users}
                                    </span>
                                    <button
                                        className="text-white bg-lightblue font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 hover:bg-gray-700 focus:outline-none focus:ring-gray-800"
                                        onClick={() => addFromServer(song)}
                                    >
                                        Add
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-white text-lg mb-3">On Youtube:</h2>
                        {loading &&
                            <LoadingSpinner width={16} height={16}/>
                        }
                        {!loading &&
                            <ul className="flex flex-wrap justify-between">
                                {ytVideos.map(video => 
                                    <li className="flex flex-col my-4" key={video.videoId}>
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