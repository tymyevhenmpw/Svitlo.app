"use client";

import Image from "next/image"
import { useEffect, useState } from "react";

const ShareThread = ({threadId}: {threadId: string}) => {
    const [success, setSuccess] = useState(false);

    const copyToClipBoard = async () => {
        try {
            await navigator.clipboard.writeText(`localhost:3000/thread/${threadId}`);
            setSuccess(true);
        } catch (error) {
            console.error(`Failed to copy link to the clipboard ${error}`);
            setSuccess(false);
        }
    }

    useEffect(() => {
        if(success){
            const timer = setTimeout(() => {
                setSuccess(false);
            }, 2000)

            return () => clearTimeout(timer)
        }
    }, [success])

    return (
        <Image src={`/assets/${success ? "tag.svg" : "share.svg"}`} alt="share" width={24}
            height={24} className="cursor-pointer object-contain" onClick={copyToClipBoard}/>
    )
}

export default ShareThread;