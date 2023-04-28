import { FormEvent, ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Modal from './modals/SongUploadModal';
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faEllipsisVertical
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSongs } from '@/context/SongsContext';
import Player from './Player';
import { useUser } from '@/context/UserContext';

export default function Layout({ children }: { children: ReactNode }) {

    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [uploadModalOpened, setUploadModalOpened] = useState<boolean>(false);
    const [canAdd, setCanAdd] = useState<boolean>(false);
    const [userActionsOpened, setUserActionsOpened] = useState<boolean>(false);

    const { fetchSongs } = useSongs();
    const { user, setUser } = useUser();

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
        if (user === 'matija' || user === 'mojca') {
            setCanAdd(true);
        }
    }, [user])

    const logout = () => {
        setUser(undefined);
        localStorage.removeItem('user');
        setUserActionsOpened(false);
    }

    return (
        <>
            <main className="flex flex-1 flex-col h-full">
                <header className="flex w-full">
                    <nav className="flex-1 border-gray-200 px-4 lg:px-6 py-2.5 bg-gray-800">
                        <div className="flex flex-1 justify-between items-center">
                            <Link href="/" className="flex items-center">
                                <Image className="mr-0 sm:mr-4" src="/logo.png" width="30" height="30" alt="Muzik Logo" />
                                <span className="hidden sm:block self-center text-xl font-semibold whitespace-nowrap text-white">Muzik</span>
                            </Link>
                            {/* {canAdd &&
                                <form className="flex items-center ml-auto" onSubmit={onSearchSubmit}>   
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
                                            className="text-md bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full pl-8 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                            placeholder="Search Youtube"
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            required
                                        />
                                    </div>
                                </form>
                            } */}
                            {canAdd &&
                                <a
                                    href="#"
                                    className="text-white font-medium rounded-lg text-sm px-4 ml-auto lg:px-5 py-2 lg:py-2.5 mr-2 hover:bg-gray-700 focus:outline-none focus:ring-gray-800"
                                    onClick={() => setUploadModalOpened(true)}
                                >
                                    Upload
                                </a>
                            }
                            <button
                                id="dropdownDefaultButton"
                                data-dropdown-toggle="dropdown"
                                className="text-white focus:ring-2 focus:outline-none rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                                type="button"
                                onClick={() => setUserActionsOpened(!userActionsOpened)}
                            >
                                <FontAwesomeIcon
                                    icon={faEllipsisVertical}
                                    style={{ fontSize: 18, color: "white" }}
                                />
                            </button>
                            <div className={`${userActionsOpened ? 'flex' : 'hidden'} absolute top-16 right-0 z-10 divide-y divide-gray-100 rounded-lg shadow bg-gray-700`}>
                                <ul className="py-2 text-sm text-gray-200" aria-labelledby="dropdownDefaultButton">
                                    <li onClick={() => logout()}>
                                        <span className="block px-4 py-2 hover:bg-gray-600 hover:text-white">Logout</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </header>
                <div className="flex flex-1 w-full flex-col bg-darkblue overflow-auto pb-20">
                    {children}
                </div>
            </main>
            <Modal opened={uploadModalOpened} onClose={onUploadModalClose} />
            <ToastContainer />
        </>
    )
}