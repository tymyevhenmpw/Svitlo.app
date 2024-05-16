"use client";

import { deleteThread, renderCreatorFunctional } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import Image from "next/image"
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
    threadId: string;
    currentUserId: string;
    author: string;
}

const DeleteThread = ({ threadId, currentUserId, author }: Props) => {

    const [ toRender, setToRender ] = useState(false);
    const pathname = usePathname();

    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        const fetchRender = async () => {
            try {
                const render = await renderCreatorFunctional({threadId: threadId, userId: currentUserId});
                setToRender(render);
            } catch (error) {
                console.error(`Error fetching, whether to render creator functional status ${error}`)
            }
        }

        fetchRender();
    }, [threadId, currentUserId])

    const handleDelete = async () => {
        setLoading(true);

        try{
            await deleteThread({ threadId, userId: currentUserId, path: pathname});
        } finally {
            setLoading(false);
        }
    }

    return( 
        toRender ? (<Image
                src={loading ? "/assets/spinner.svg" : "/assets/delete.svg"}
                width={16}
                height={16}
                alt="Delete"
                className={`cursor-pointer object-contain mt-[-8px] mr-[-4px] border-[#FF4D4D] rounded-full ${!loading && "hover:border-2"}`}
                onClick={handleDelete}
            />): null)
    ;
}

export default DeleteThread