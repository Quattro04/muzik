import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { YtVideo } from "@/pages/search";
import { useApi } from "@/hooks/useApi";

export const YtUploadModal = (
    {
        opened,
        selectedYtVideo,
        onClose,
        onSuccess,
        onFail
    }: {
        opened: boolean;
        selectedYtVideo: YtVideo | undefined;
        onClose: () => void;
        onSuccess: (res: any) => void;
        onFail: (e: any) => void;
    }
) => {

    const [open, setOpen] = useState<boolean>(false);

    const [artist, setArtist] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [releaseYear, setReleaseYear] = useState<string>('');
    const [image, setImage] = useState<string>('');

    const [artistError, setArtistError] = useState<boolean>(false);
    const [titleError, setTitleError] = useState<boolean>(false);
    const [releaseYearError, setReleaseYearError] = useState<boolean>(false);
    const [imageError, setImageError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const { addSongFromYt } = useApi();

    const closeModal = () => {
        setArtist('');
        setTitle('');
        setArtistError(false);
        setTitleError(false);
        setOpen(false);
        onClose();
    }

    const checkFields = async (event: any) => {

        if (artist === '') {
            setArtistError(true);
            return;
        } else {
            setArtistError(false);
        }
        if (title === '') {
            setTitleError(true);
            return;
        } else {
            setTitleError(false);
        }
        if (releaseYear.length !== 4) {
            setReleaseYearError(true);
            return;
        } else {
            setReleaseYearError(false);
        }
        if (image === '') {
            setImageError(true);
            return;
        } else {
            setImageError(false);
        }

        postYtUrl();
    };

    const artistChange = (e: any) => {
        setArtist(e.target.value);
        setArtistError(false);
    }

    const titleChange = (e: any) => {
        setTitle(e.target.value);
        setTitleError(false);
    }

    const releaseYearChange = (e: any) => {
        setReleaseYear(e.target.value);
        setReleaseYearError(false);
    }

    const imageChange = (e: any) => {
        setImage(e.target.value);
        setImageError(false);
    }

    useEffect(() => {
        setOpen(opened);
        if (selectedYtVideo !== undefined) {
            if (selectedYtVideo.title !== '') {
                const arr = selectedYtVideo.title.split('-');
                if (arr.length > 1) {
                    setArtist(arr[0].trim());
                    arr.shift();
                    setTitle(arr.join('-').trim());
                }
            }
            if (selectedYtVideo.ago !== undefined && selectedYtVideo.ago !== '') {
                setReleaseYear(agoToYear(selectedYtVideo.ago))
            }
            if (selectedYtVideo.image !== undefined && selectedYtVideo.image !== '') {
                setImage(selectedYtVideo.image);
            }
        }
    }, [opened, onClose])

    const agoToYear = (ago: string): string => {
        const currentYear = new Date().getFullYear();
        if (!ago.includes('year')) return currentYear.toString();

        const yearsAgo = ago.slice(0, 2).trim();
        const year = currentYear - Number(yearsAgo);
        return year.toString()
    }

    const postYtUrl = async () => {

        if (!selectedYtVideo) return;

        setLoading(true);

        try {
            const res = await addSongFromYt(selectedYtVideo, image, releaseYear, artist, title);
            onSuccess(res)
        } catch(e) {
            onFail(e)
        }

        setLoading(false);

    }

    return (
        <div
            className={`fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full ${open ? '' : 'hidden'}`}
            tabIndex={-1}
            aria-hidden="true"
        >
            <div className="relative w-full h-full max-w-2xl md:h-auto">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Artist and title
                        </h3>
                        <button
                            disabled={loading}
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => closeModal()}
                        >
                            <FontAwesomeIcon
                                icon={faClose}
                                style={{ fontSize: 16, color: "white" }}
                            />
                        </button>
                    </div>
                    <div className="flex flex-col p-6 space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            The artist and title info you enter here will appear when listing this song in your library.
                        </p>
                        <input
                            disabled={loading}
                            type="text"
                            className={`p-3 rounded-lg outline-0 border-2 ${artistError ? 'border-red-500' : 'border-transparent'}`}
                            placeholder="Artist"
                            value={artist}
                            onChange={artistChange}
                        />
                        <input
                            disabled={loading}
                            type="text"
                            className={`p-3 rounded-lg outline-0 border-2 ${titleError ? 'border-red-500' : 'border-transparent'}`}
                            placeholder="Title"
                            value={title}
                            onChange={titleChange}
                        />
                        <input
                            disabled={loading}
                            type="number"
                            className={`p-3 rounded-lg outline-0 border-2 ${releaseYearError ? 'border-red-500' : 'border-transparent'}`}
                            placeholder="Release year"
                            value={releaseYear}
                            onChange={releaseYearChange}
                        />
                        <input
                            disabled={loading}
                            type="text"
                            className={`p-3 rounded-lg outline-0 border-2 ${imageError ? 'border-red-500' : 'border-transparent'}`}
                            placeholder="Image"
                            value={image}
                            onChange={imageChange}
                        />
                    </div>
                    <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                        {!loading &&
                            <button
                                type="button"
                                onClick={checkFields}
                                className="text-white focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                            >
                                Add to library
                            </button>
                        }
                        {loading &&
                            <button
                                disabled
                                type="button"
                                className="text-white bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center"
                            >
                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                </svg>
                                Loading...
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}