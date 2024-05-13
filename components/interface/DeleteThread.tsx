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

    const [toRender, setToRender] = useState(false);
    const pathname = usePathname();

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
        await deleteThread({ threadId, userId: currentUserId, path: pathname})
    }

    return( 
        toRender ? (<Image
                src="/assets/delete.svg"
                width={16}
                height={16}
                alt="Delete"
                className="cursor-pointer object-contain mt-[-8px] mr-[-4px]"
                onClick={handleDelete}
            />): null)
    ;
}

export default DeleteThread