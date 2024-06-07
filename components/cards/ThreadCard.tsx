import Image from "next/image";
import Link from "next/link";
import AddLike from "../interface/LikeThread";
import DeleteThread from "../interface/DeleteThread";
import ShareThread from "../interface/ShareThread";
import { formatDateString } from "@/lib/utils";
import ThreadDropDownMenu from "../interface/ThreadDropDownMenu";

interface Props {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    author: {
        name: string;
        image: string
        id: string;
    }
    community: {
        id: string;
        name: string;
        image: string;
    } | null
    createdAt: string;
    comments: {
        author:{
            image: string;
        }
    }[];
    likedBy: {
        author: {
            id: string;
        }
    }[];
    hashtags: [];
    isComment?: boolean;
    reposts: [];
    repostedOn: {
        text: string,
        author: {
            id: string,
            image: string,
            name: string
        }
    }
}

const ThreadCard = ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    createdAt,
    comments,
    likedBy,
    hashtags,
    isComment,
    reposts,
    repostedOn
}: Props) => {

    const parseHashtags = (text: string) => {
        return text.split(/(\B#[a-zA-Z0-9][\w'-]*)/).map((word, index) => {
            if(word.startsWith("#")){
                const hashtag = word.slice(1);
                return (
                    <Link href={`/hashtag/${hashtag}`} key={word}>
                        <span className="text-blue">{word}</span>
                    </Link>
                )
            }
            return <span key={index}>{word}</span>;
        })
    }
    if(!repostedOn){
        return (
            <article className={`flex w-full flex-col rounded-xl ${isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'}`}>
                <div className="flex items-start justify-between">
                    <div className="flex w-full flex-1 flex-row gap-4">
                        <div className="flex flex-col items-center">
                            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                                <Image
                                    src={author.image}
                                    alt="Profile image"
                                    sizes="44"
                                    fill
                                    className="cursor-pointer rounded-full"
                                ></Image>
                            </Link>
                            <div className="thread-card_bar"/>
                        </div>

                        <div className="flex w-full flex-col">
                            <Link href={`/profile/${author.id}`} className="w-fit">
                                <h4 className="cursor-pointer text-base-semibold text-light-1">{author.name}</h4>
                            </Link>

                            <p className="mt-2 text-small-regular text-light-2">{parseHashtags(content)}</p>

                            <div className={`${isComment && "mb-12"} mt-5 flex flex-col gap-3`}>
                                <div className="flex gap-3.5">
                                    <AddLike threadId={id.toString()} currentUserId={currentUserId}/>

                                    <Link href={`/thread/${id}`}>
                                        <Image src="/assets/reply.svg" alt="reply" width={24}
                                            height={24} className="cursor-pointer object-contain"/>
                                    </Link>

                                    {!isComment && !repostedOn
                                        ? (
                                            <Link href={`/repost-thread/${id}`}>
                                                <Image src="/assets/repost.svg" alt="repost" width={24}
                                                    height={24} className="cursor-pointer object-contain"/>
                                            </Link>
                                        ) : null}

                                    <ShareThread threadId={id.toString()}/>
                                    {likedBy.length > 0
                                        ? <Link href={`/likes/${id}`}><p className="ml-1 mt-1 text-subtle-medium text-primary-experimental max-md:hidden">{ likedBy.length > 1 ? `${likedBy.length} likes` : `${likedBy.length} like`}</p></Link>
                                        : null
                                    }
                                    {comments.length > 0
                                        ? <Link href={`/thread/${id}`}>
                                            <p className="ml-1 mt-1 text-subtle-medium text-primary-experimental max-md:hidden">{ comments.length > 1 ? `${comments.length} comments` : `${comments.length} comment`}</p>
                                          </Link>
                                        : null
                                    }
                                    {!repostedOn && reposts.length > 0
                                        ? <Link href={`/reposts/${id}`}><p className="ml-1 mt-1 text-subtle-medium text-primary-experimental max-md:hidden">{ reposts.length > 1 ? `${reposts.length} reposts` : `${reposts.length} repost`}</p></Link>
                                        : null
                                    }
                                </div>
                                <div className="flex gap-2">
                                    {isComment && comments.length > 0 ? (
                                        <Link href={`/thread/${id}`}>
                                            <p className="mt-1 text-subtle-medium text-gray-1">{comments.length} replies</p>
                                        </Link>
                                    ): null}
                                    {likedBy.length > 0
                                        ? <Link href={`/likes/${id}`}><p className="ml-1 text-subtle-medium text-primary-experimental md:hidden">{ likedBy.length > 1 ? `${likedBy.length} likes` : `${likedBy.length} like`}</p></Link>
                                        : null
                                    }
                                    {!repostedOn && reposts.length > 0
                                        ? <Link href={`/reposts/${id}`}><p className="ml-1 text-subtle-medium text-primary-experimental md:hidden">{ reposts.length > 1 ? `${reposts.length} reposts` : `${reposts.length} repost`}</p></Link>
                                        : null
                                    }
                                </div>
                            </div>

                            {!isComment && community ? (
                                <Link href={`/communities/${community.id}`} className="mt-5 flex items-center">
                                    <p className="text-subtle-medium text-gray-1">
                                        {formatDateString(createdAt)}
                                        - {community.name} Community
                                    </p>

                                    <Image
                                        src={community.image}
                                        alt={community.name}
                                        width={14}
                                        height={14}
                                        className="ml-1 rounded-full object-cover"
                                    />
                                </Link>
                            ) : (
                                <p className="text-subtle-medium text-gray-1">
                                    {formatDateString(createdAt)}
                                </p>
                            )}
                        </div>
                    </div>
                        <ThreadDropDownMenu threadId={id.toString()} currentUserId={currentUserId} author={author.id}/>
                        {/* <DeleteThread threadId={id.toString()} currentUserId={currentUserId} author={author.id}/> */}
                </div>
            </article>
        )
    } else {
        return (
            <article className={`flex w-full flex-col rounded-xl ${isComment ? 'px-0 xs:px-7' : repostedOn ? 'p-4 border-2 border-dark-2': 'bg-dark-2 p-7'}`}>
                <div className="flex items-start justify-between">
                    <div className="flex w-full flex-1 flex-row gap-4">
                        <div className="flex flex-col items-center">
                            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                                <Image
                                    src={author.image}
                                    alt="Profile image"
                                    sizes="44"
                                    fill
                                    className="cursor-pointer rounded-full"
                                ></Image>
                            </Link>
                            <div className="thread-card_bar"/>
                        </div>

                        <div className="flex w-full flex-col">
                            <Link href={`/profile/${author.id}`} className="w-fit">
                                <h4 className="cursor-pointer text-base-semibold text-light-1">{author.name}</h4>
                            </Link>

                            <p className="mt-2 text-small-regular text-light-2">{parseHashtags(content)}</p>

                            <div className={`${isComment && "mb-12"} mt-5 flex flex-col gap-3`}>
                                <div className="flex gap-3.5">
                                    <AddLike threadId={id.toString()} currentUserId={currentUserId}/>

                                    <Link href={`/thread/${id}`}>
                                        <Image src="/assets/reply.svg" alt="reply" width={24}
                                            height={24} className="cursor-pointer object-contain"/>
                                    </Link>

                                    {!isComment && !repostedOn
                                        ? (
                                            <Link href={`/repost-thread/${id}`}>
                                                <Image src="/assets/repost.svg" alt="repost" width={24}
                                                    height={24} className="cursor-pointer object-contain"/>
                                            </Link>
                                        ) : null}

                                    <ShareThread threadId={id.toString()}/>
                                    {likedBy.length > 0
                                        ? <Link href={`/likes/${id}`}><p className="ml-1 mt-1 text-subtle-medium text-primary-experimental max-md:hidden">{ likedBy.length > 1 ? `${likedBy.length} likes` : `${likedBy.length} like`}</p></Link>
                                        : null
                                    }
                                    {comments.length > 0
                                        ? <Link href={`thread/${id}`}>
                                            <p className="ml-1 mt-1 text-subtle-medium text-primary-experimental max-md:hidden">{ comments.length > 1 ? `${comments.length} comments` : `${comments.length} comment`}</p>
                                          </Link>
                                        : null
                                    }
                                    {!repostedOn && reposts.length > 0
                                        ? <Link href={`/reposts/${id}`}><p className="ml-1 text-subtle-medium text-primary-experimental md:hidden">{ reposts.length > 1 ? `${reposts.length} reposts` : `${reposts.length} repost`}</p></Link>
                                        : null
                                    }
                                </div>
                                {isComment && comments.length > 0 ? (
                                    <Link href={`/thread/${id}`}>
                                        <p className="mt-1 text-subtle-medium text-gray-1">{comments.length} replies</p>
                                    </Link>
                                ): null}
                                {likedBy.length > 0
                                    ? <Link href={`/likes/${id}`}><p className="ml-1 text-subtle-medium text-primary-experimental md:hidden">{ likedBy.length > 1 ? `${likedBy.length} likes` : `${likedBy.length} like`}</p></Link>
                                    : null
                                }
                                {!repostedOn && reposts.length > 0
                                    ? <Link href={`/reposts/${id}`}><p className="ml-1 mt-1 text-subtle-medium text-primary-experimental max-md:hidden">{ reposts.length > 1 ? `${reposts.length} reposts` : `${reposts.length} repost`}</p></Link>
                                    : null
                                }
                            </div>
                            <div className="w-full pt-2">
                                <h4 className="text-primary-experimental text-small-regular">Repost on</h4>
                                <article className={`flex w-full flex-col rounded-xl bg-dark-2 p-7 mt-2`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex w-full flex-1 flex-row gap-4">
                                            <div className="flex flex-col items-center">
                                                <Link href={`/profile/${repostedOn.author.id}`} className="relative h-11 w-11">
                                                    <Image
                                                        src={repostedOn.author.image}
                                                        alt="Profile image"
                                                        sizes="44"
                                                        fill
                                                        className="cursor-pointer rounded-full"
                                                    ></Image>
                                                    </Link>
                                                    <div className="thread-card_bar"/>
                                            </div>
                                            <div className="flex w-full flex-col">
                                                <Link href={`/profile/${repostedOn.author.id}`} className="w-fit">
                                                    <h4 className="cursor-pointer text-base-semibold text-light-1">{repostedOn.author.name}</h4>
                                                </Link>

                                                <p className="mt-2 text-small-regular text-light-2">{parseHashtags(repostedOn.text)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>

                            {!isComment && community ? (
                                <Link href={`/communities/${community.id}`} className="mt-5 flex items-center">
                                    <p className="text-subtle-medium text-gray-1">
                                        {formatDateString(createdAt)}
                                        - {community.name} Community
                                    </p>

                                    <Image
                                        src={community.image}
                                        alt={community.name}
                                        width={14}
                                        height={14}
                                        className="ml-1 rounded-full object-cover"
                                    />
                                </Link>
                            ) : (
                                <p className="mt-5 text-subtle-medium text-gray-1">
                                    {formatDateString(createdAt)}
                                </p>
                            )}
                        </div>
                    </div>
                        <ThreadDropDownMenu threadId={id.toString()} currentUserId={currentUserId} author={author.id}/>
                        {/* <DeleteThread threadId={id.toString()} currentUserId={currentUserId} author={author.id}/> */}
                </div>
            </article>
        )
    }
}

export default ThreadCard;