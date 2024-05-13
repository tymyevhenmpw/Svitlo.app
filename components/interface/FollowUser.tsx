"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { followUser, isUserFollowedOrFollowing } from "@/lib/actions/user.actions";

interface Props {
    userId: string;
    followId: string;
}

const FollowUser = ({ userId, followId}: Props) => {

    const pathname = usePathname();
    
    const[isFollowed, setIsFollowed] = useState(false);

    useEffect(() => {
        const fetchIsFollowed = async () => {
            try {
                const followed = await isUserFollowedOrFollowing({ userId, followId, type: "Followed" })
                setIsFollowed(followed)
            } catch (error) {
                console.error(`Failed to follow user ${error}`)
            }
        };

        fetchIsFollowed();
    }, [userId, followId])

    const handleClick = async () => {
        await followUser({
            userId,
            followId,
            path: pathname,
        });

        setIsFollowed((prevIsFollowed) => !prevIsFollowed);
    }
    return (
        <Button onClick={handleClick} className={`${ isFollowed ? "bg-transparent" : "bg-primary-experimental" } border-2 border-solid border-primary-experimental`} size="sm">{isFollowed ? "Unfollow" : "Follow"}</Button>
    )
}

export default FollowUser;