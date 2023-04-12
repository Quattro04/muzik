
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faVolumeHigh
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function VolumeSlider({ volume, onChange }: { volume: number, onChange: (v: number) => void }) {

    const [changingSongVolume, setChangingSongVolume] = useState<boolean>(false);

    const onVolumeMouseMove = (event: any) => {
        if (!changingSongVolume) return;
        const desiredVolume = event.pageX - event.target.getBoundingClientRect().left;
        const vol = desiredVolume / event.target.getBoundingClientRect().width;
        onChange(vol);
    }

    const onVolumeMouseUp = (event: any) => {
        onVolumeMouseMove(event);
        setChangingSongVolume(false);
    }

    return (
        <>
            <div
                className="flex items-center w-32 h-4 mr-3 cursor-pointer"
                onMouseDown={() => setChangingSongVolume(true)}
                onMouseMove={onVolumeMouseMove}
                onMouseUp={onVolumeMouseUp}
            >
                <div className="w-full bg-lightblue rounded pointer-events-none" style={{ height: '4px' }}>
                    <div className="bg-blue rounded pointer-events-none" style={{ width: `${volume * 100}%`, height: '4px' }} />
                </div>
            </div>
            <FontAwesomeIcon
                icon={faVolumeHigh}
                style={{ fontSize: 12, color: "white" }}
            />
        </>
    )
}