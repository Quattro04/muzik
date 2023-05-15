import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import jsmediatags from 'jsmediatags';
import { TagType } from "jsmediatags/types";
import { useUser } from "@/context/UserContext";
import LoadingSpinner from "../LoadingSpinner";

export default function SongUploadModal({ opened, onClose }: { opened: boolean, onClose: (res: any) => void }) {

    const [open, setOpen] = useState<boolean>(false);
    const [uploadedFile, setUploadedFile] = useState<File | undefined>(undefined);
    const [releaseYear, setReleaseYear] = useState<string>('');
    const [releaseYearError, setReleaseYearError] = useState<boolean>(false);
    const [fileError, setFileError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const { user } = useUser();

    const closeModal = (res?: any) => {
        setUploadedFile(undefined);
        setReleaseYear('');
        setReleaseYearError(false);
        setFileError(false);
        setOpen(false);
        onClose(res);
    }

    const uploadToClient = async (event: any) => {
        if (event.target.files && event.target.files[0]) {
            setFileError(false);
            const i = event.target.files[0];
            setUploadedFile(i);
        }
    };
    
    const uploadToServer = async (event: any) => {

        // Check if file and realeaseDate are not empty
        if (releaseYear.length !== 4) {
            setReleaseYearError(true);
            return;
        } else {
            setReleaseYearError(false);
        }
        if (uploadedFile === undefined) {
            setFileError(true);
            return;
        } else {
            setFileError(false);
        }

        setLoading(true);

        try {
            // Get metadata from selected mp3 file
            const data: TagType = await new Promise((resolve, reject) => {
                jsmediatags.read(uploadedFile, {
                    onSuccess: tag => {
                        resolve(tag);
                    },
                    onError: error => {
                        reject(error);
                    }
                });
            });

            // Save data to db and get id of the song
            const body = {
                artist: data.tags.artist,
                title: data.tags.title,
                releaseYear,
                user
            }
            const res = await fetch(`/api/audio/add`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            const response = await res.json();
            if (response.error) {
                setLoading(false);
                closeModal(response);
                return;
            }

            const songId = response.song.id;

            // Make mp3 file with id as name and upload it to server
            const songFile = new File([uploadedFile], songId + '.mp3', { type: 'audio/mpeg' })
            const formData = new FormData();
            formData.append('file', songFile);
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
                method: "POST",
                body: formData
            });

            // If there is a thumbnail, upload that also to the server
            if (data.tags.picture) {
                const base64Data = Buffer.from(data.tags.picture.data);
                const blob = new Blob([base64Data as BlobPart], {
                    type: data.tags.picture.format,
                });
                const imageFile = new File([blob], songId + '.jpg', { type: data.tags.picture.format })

                const formData = new FormData();
                formData.append('file', imageFile);
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/img-upload`, {
                    method: "POST",
                    body: formData
                });
            }
            setLoading(false);
            closeModal(response);
        } catch (e) {
            console.log('ERROR: ', e);
            setLoading(false);
            closeModal({ error: e });
        }
    };

    const releaseYearChange = (e: any) => {
        setReleaseYear(e.target.value);
        setReleaseYearError(false);
    }

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
                            type="number"
                            className={`p-3 rounded-lg outline-0 border-2 ${releaseYearError ? 'border-red-500' : 'border-transparent'}`}
                            placeholder="Release Year"
                            value={releaseYear}
                            onChange={releaseYearChange}
                        />
                        <input
                            className={`text-white border-2 ${fileError ? 'border-red-500' : 'border-transparent'}`}
                            type="file" 
                            name="myImage"
                            onChange={uploadToClient}
                        />
                    </div>
                    <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                        {!loading &&
                            <button
                                type="button"
                                onClick={uploadToServer}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Upload
                            </button>
                        }
                        {loading &&
                            <LoadingSpinner width={20} height={20} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}