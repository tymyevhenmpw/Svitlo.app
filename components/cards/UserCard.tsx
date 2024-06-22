"use client"

import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import DeleteFollower from "../interface/DeleteFollower";
import FollowUser from "../interface/FollowUser";

interface Props {
    id: string;
    name: string;
    username: string;
    imgUrl: string;
    personType: string;
    type: string;
    currentUserId: string;
}

const UserCard = ({ id, name, username, imgUrl, personType, type, currentUserId }: Props) => {
    const router = useRouter();

    return (
        <article className="user-card">
            <div className="user-card_avatar">
                <div className="relative h-14 w-14 object-cover">
                    <Image
                        src={imgUrl}
                        alt="Profile image"
                        fill
                        className="rounded-full object-cover shadow-2xl"
                    />
                </div>

                <div className="flex-1 text-ellipsis">
                    <h4 className="text-base-semibold text-light-1">{name}</h4>
                    <p className="text-small-medium text-gray-1">@{username}</p>
                </div>
            </div>

            {type === "Followed"
                ? <DeleteFollower userId={currentUserId} followId={id}></DeleteFollower>
                : type === "Following"
                    ? <FollowUser userId={currentUserId} followId={id}></FollowUser>
                    : null
            }
            <Button className="user-card_btn border-2 border-solid border-primary-experimental" onClick={() => router.push(`/profile/${id}`)}>
                View
            </Button>
        </article>
    )
}

export default UserCard;
