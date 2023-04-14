import { FormEvent, ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Modal from './modals/SongUploadModal';
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlayedSong, useSongs } from '@/context/SongsContext';
import Player from './Player';

export default function Layout({ children }: { children: ReactNode }) {

    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [uploadModalOpened, setUploadModalOpened] = useState<boolean>(false);
    const [canAdd, setCanAdd] = useState<boolean>(false);

    const { playedSong, songs, fetchSongs } = useSongs();

    const onSearchSubmit = (e: FormEvent) => {
        router.push(`/search?q=${searchQuery}`);
        e.preventDefault();
    }

    const onUploadModalClose = (response: any) => {
        setUploadModalOpened(false);
        if (response && response.message) {
            toast.success(response.message);
            fetchSongs();
        } else if (response && response.error) {
            toast.error(response.error);
        }
    }

    useEffect(() => {
        const check = localStorage.getItem('addKey');
        if (check === process.env.NEXT_PUBLIC_AUTH_TOKEN) {
            setCanAdd(true);
        }
    }, [])

    return (
        <>
            <main className="flex flex-1 flex-col h-full">
                <header className="flex w-full">
                    <nav className="flex-1 border-gray-200 px-4 lg:px-6 py-2.5 bg-gray-800">
                        <div className="flex flex-1 justify-between items-center mx-auto max-w-screen-xl">
                            <Link href="/" className="flex items-center">
                                <Image src="/logo.png" width="30" height="30" className="mr-6" alt="Muzik Logo" />
                                <span className="hidden sm:block self-center text-xl font-semibold whitespace-nowrap text-white">Muzik</span>
                            </Link>
                            {canAdd &&
                                <div className="flex items-center lg:order-2">
                                        <form className="flex items-center" onSubmit={onSearchSubmit}>   
                                            <label className="sr-only">Search Youtube</label>
                                            <div className="relative w-full">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FontAwesomeIcon
                                                        icon={faSearch}
                                                        style={{ fontSize: 12, color: "white" }}
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    className="text-xs sm:text-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full pl-8 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                                    placeholder="Search Youtube"
                                                    value={searchQuery}
                                                    onChange={e => setSearchQuery(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            {/* <button type="submit" className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                                <span className="sr-only">Search</span>
                                            </button> */}
                                        </form>
                                    <a
                                        href="#"
                                        className="hidden sm:block text-white font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 hover:bg-gray-700 focus:outline-none focus:ring-gray-800"
                                    >
                                        Log in
                                    </a>
                                    <a
                                        href="#"
                                        className="hidden sm:block text-white font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 hover:bg-gray-700 focus:outline-none focus:ring-gray-800"
                                        onClick={() => setUploadModalOpened(true)}
                                    >
                                        Upload
                                    </a>
                                </div>
                            }
                        </div>
                    </nav>
                </header>
                <div className="flex flex-1 w-full flex-col bg-darkblue overflow-auto pb-20">
                    {children}
                </div>
                <div className="fixed bottom-0 w-full flex bg-darkblue">
                    <Player />
                </div>
            </main>
            <Modal opened={uploadModalOpened} onClose={onUploadModalClose} />
            <ToastContainer />
        </>
    )
}