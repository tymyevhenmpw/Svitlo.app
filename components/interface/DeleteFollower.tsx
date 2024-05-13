"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { deleteFollower, isUserFollowedOrFollowing } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

interface Props {
    userId: string;
    followId: string;
}

const DeleteFollower = ({ userId, followId}: Props) => {
    const pathname = usePathname();

    const path = `/profile/${userId}`;

    const[isFollowing, setisFollowing] = useState(false);

    useEffect(() => {
        const fetchisFollowing = async () => {
            try {
                const following = await isUserFollowedOrFollowing({ userId, followId, type: "Following" })
                setisFollowing(following)
            } catch (error) {
                console.error(`Failed to delete follower ${error}`)
            }
        };

        fetchisFollowing();
    }, [userId, followId])

    const handleClick = async () => {
        await deleteFollower({
            userId,
            followId,
            path: path,
        });

        setisFollowing((previsFollowing) => !previsFollowing);
    }
    return (
        <Button onClick={handleClick} className={`${ isFollowing ? "bg-transparent" : "bg-primary-experimental" } border-2 border-solid border-primary-experimental`} size="sm">{isFollowing ? "Delete" : null}</Button>
    )
}

export default DeleteFollower