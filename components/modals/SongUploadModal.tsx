import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export default function SongUploadModal({ opened, onClose }: { opened: boolean, onClose: (res: any) => void }) {

    const [open, setOpen] = useState<boolean>(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [artist, setArtist] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [releaseYear, setReleaseYear] = useState<string>('');
    // const [cover, setCover] = useState<string>('');
    const [artistError, setArtistError] = useState<boolean>(false);
    const [titleError, setTitleError] = useState<boolean>(false);
    const [releaseYearError, setReleaseYearError] = useState<boolean>(false);
    // const [coverError, setCoverError] = useState<boolean>(false);
    const [fileError, setFileError] = useState<boolean>(false);

    const closeModal = (res?: any) => {
        setUploadedFile(null);
        setArtist('');
        setTitle('');
        setReleaseYear('');
        // setCover('');
        setArtistError(false);
        setTitleError(false);
        setReleaseYearError(false);
        // setCoverError(false);
        setFileError(false);
        setOpen(false);
        onClose(res);
    }

    const uploadToClient = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            setFileError(false);
            const i = event.target.files[0];
            setUploadedFile(i);

            // Fill artist and title from file name
            const arr = i.name.split(/-(.*)/s);
            if (arr.length > 1) {
                setArtist(arr[0].trim());
                setTitle(arr[1].split('.')[0].trim());
            }
        }
    };
    
    const uploadToServer = async (event: any) => {

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
        // if (cover === '') {
        //     setCoverError(true);
        //     return;
        // } else {
        //     setCoverError(false);
        // }
        if (uploadedFile === null) {
            setFileError(true);
            return;
        } else {
            setFileError(false);
        }

        const formData = new FormData();
        // formData.append('artist', artist);
        // formData.append('title', title);
        // formData.append('releaseYear', releaseYear);
        // body.append('cover', cover);
        formData.append('file', uploadedFile);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
            method: "POST",
            body: formData
        });
        const response = await res.json();
        closeModal(response);
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

    // const coverChange = (e: any) => {
    //     setCover(e.target.value);
    //     setCoverError(false);
    // }

    useEffect(() => {
        setOpen(opened);
    }, [opened, onClose])

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
                            Upload song
                        </h3>
                        <button
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
                            Upload a song to add it to the list of songs.
                        </p>
                        <input
                            type="text"
                            className={`p-3 rounded-lg outline-0 border-2 ${artistError ? 'border-red-500' : 'border-transparent'}`}
                            placeholder="Artist"
                            value={artist}
                            onChange={artistChange}
                        />
                        <input
                            type="text"
                            className={`p-3 rounded-lg outline-0 border-2 ${titleError ? 'border-red-500' : 'border-transparent'}`}
                            placeholder="Title"
                            value={title}
                            onChange={titleChange}
                        />
                        <input
                            type="number"
                            className={`p-3 rounded-lg outline-0 border-2 ${releaseYearError ? 'border-red-500' : 'border-transparent'}`}
                            placeholder="Release Year"
                            value={releaseYear}
                            onChange={releaseYearChange}
                        />
                        {/* <input
                            type="string"
                            className={`p-3 rounded-lg outline-0 border-2 ${coverError ? 'border-red-500' : 'border-transparent'}`}
                            placeholder="Art Cover"
                            value={cover}
                            onChange={coverChange}
                        /> */}
                        <input
                            className={`text-white border-2 ${fileError ? 'border-red-500' : 'border-transparent'}`}
                            type="file" 
                            name="myImage"
                            onChange={uploadToClient}
                        />
                    </div>
                    <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button
                            type="button"
                            onClick={uploadToServer}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}