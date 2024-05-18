import Image from "next/image";
import FollowUser from "../interface/FollowUser";
import Link from "next/link";

interface Props {
    accountId: string;
    authUserId: string;
    name: string;
    username: string;
    imgUrl: string;
    bio: string;
    followed: string;
    following: string;
    type?: 'User' | 'Community'
}

const ProfileHeader = ({
    accountId,
    authUserId,
    name,
    username,
    imgUrl,
    bio,
    followed,
    following,
    type
}: Props)  => {
    return (
        <div className="flex w-full flex-col justify-start">
            <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                    <div className="relative h-20 w-20 object-cover">
                        <Image
                            src={imgUrl}
                            alt="Profile image"
                            fill
                            className="rounded-full object-cover shadow-2xl"
                        />
                    </div>

                    <div className="flex-1">
                        <h2 className="text-left text-heading3-bold text-light-1">{name}</h2>
                        
                        <div className="sm:hidden flex gap-7">
                            <p className="text-base-medium text-gray-1">@{username}</p>
                            
                            {type === 'User' && (<FollowUser userId={authUserId} followId={accountId}/>)}
                        </div>
                    </div>

                    {type === 'User' && (
                        <div className="max-sm:hidden">
                            <FollowUser userId={authUserId} followId={accountId}/>
                        </div>
                    )}
                </div>
            </div>
                {/* TODO: Community */}

                <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>

                {type === 'User' && (
                    <div className="flex flex-1">
                        <Link href={`/followed/${accountId}`}><p className="mt-6 text-small-regular text-light-1 border-solid border-2 border-primary-experimental px-2 py-1 rounded-lg">{followed.length} Followed</p></Link>
                        <Link href={`/following/${accountId}`}><p className="mt-6 ml-4 text-small-regular text-light-1 border-solid border-2 border-primary-experimental px-2 py-1 rounded-lg">{following.length} Following</p></Link>
                    </div>
                )}

                <div className="mt-4 h-0.5 w-full bg-secondary-500 rounded-md"/>
        </div>
    )
}

export default ProfileHeader;