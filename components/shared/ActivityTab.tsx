import { getLikesActivity, getRepliesActivity, getRepostsActivity } from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Props {
    currentUserId: string;
    tabsName: string;
}

const ActivityTab = async ({ currentUserId, tabsName }: Props) => {
    if(tabsName === "reposts") {
        let result = await getRepostsActivity(currentUserId);

        if(!result) redirect('/')

        const formatDate = (date: Date) => {
            const now = new Date();
            const diff = now.getTime() - date.getTime();
              
            if (diff < 3600000) { // less than 1 hour
                return `${Math.floor(diff / 60000)} minutes ago`;
            } else if (diff < 86400000) { // less than 24 hours
                return `${Math.floor(diff / 3600000)} hours ago`;
            } else if (diff < 2592000000) { // less than 30 days
                return `${Math.floor(diff / 86400000)} days ago`;
            } else {
                return date.toLocaleDateString();
            }
        }
        return(
            <section className="mt-9 flex flex-col gap-10">
                {result.map((activity: any) => (
                    <Link key={activity._id} href={`/reposts/${activity.repostedOn._id}`}>
                        <article className="activity-card">
                            <div className="relative h-11 w-11 object-cover">
                                <Image
                                    src={activity.author.image}
                                    alt="Profile image"
                                    fill
                                    className="rounded-full object-cover shadow-2xl"
                                />
                            </div>
                            <p className="!text-small-regular text-light-1 max-[444px]:flex max-[444px]:flex-col">
                                <div>
                                    <Link href={`/profile/${activity.author.id}`} className="mr-1 text-primary-experimental">
                                        {activity.author.name}
                                    </Link>
                                    Reposted your thread 
                                </div>
                                <span className="text-primary-experimental text-tiny-medium ml-1">{`${formatDate(activity.createdAt)}`}</span>
                            </p>
                            {/* TODO: <p className="text-light-2">{reply.text}</p> */}
                        </article>
                    </Link>
                ))}

                {result.length === 0 && (
                    <p className="!text-base-regular text-light-3">No activity yet</p>
                )}
            </section>
        )
    } else if(tabsName === "replies") {
        let result = await getRepliesActivity(currentUserId);

        if(!result) redirect('/')

        const formatDate = (date: Date) => {
            const now = new Date();
            const diff = now.getTime() - date.getTime();
              
            if (diff < 3600000) { // less than 1 hour
                return `${Math.floor(diff / 60000)} minutes ago`;
            } else if (diff < 86400000) { // less than 24 hours
                return `${Math.floor(diff / 3600000)} hours ago`;
            } else if (diff < 2592000000) { // less than 30 days
                return `${Math.floor(diff / 86400000)} days ago`;
            } else {
                return date.toLocaleDateString();
            }
        }
        return(
            <section className="mt-9 flex flex-col gap-10">
                {result.map((activity: any) => (
                    <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                        <article className="activity-card">
                            <div className="relative h-11 w-11 object-cover">
                                <Image
                                    src={activity.author.image}
                                    alt="Profile image"
                                    fill
                                    className="rounded-full object-cover shadow-2xl"
                                />
                            </div>

                            <p className="!text-small-regular text-light-1 max-[444px]:flex max-[444px]:flex-col">
                                <div>
                                    <Link href={`/profile/${activity.author.id}`} className="mr-1 text-primary-experimental">
                                        {activity.author.name}
                                    </Link>
                                    Replied to your thread 
                                </div>
                                <span className="text-primary-experimental text-tiny-medium ml-1">{`${formatDate(activity.createdAt)}`}</span>
                            </p>
                            {/* TODO: <p className="text-light-2">{reply.text}</p> */}
                        </article>
                    </Link>
                ))}

                {result.length === 0 && (
                    <p className="!text-base-regular text-light-3">No activity yet</p>
                )}
            </section>
        )
    } else if(tabsName === "likes") {
        let result = await getLikesActivity(currentUserId);

        if(!result) redirect('/')

        return(
            <section className="mt-9 flex flex-col gap-10">
                {result.length > 0 && result.map((activity) => (
                    <Link href={`/profile/${activity.id}`} key={activity.id}>
                        <article className="activity-card">
                            <div className="relative h-11 w-11 object-cover">
                                <Image
                                    src={activity.image}
                                    alt="Profile image"
                                    fill
                                    className="rounded-full object-cover shadow-2xl"
                                />
                            </div>
                            <p className="!text-small-regular text-light-1"><span className="mr-1 text-primary-experimental">{activity.name}</span> liked your thread.</p>                 
                        </article>
                    </Link>
                ))}

                {result.length === 0 && (
                    <p className="!text-base-regular text-light-3">No activity yet</p>
                )}
            </section>
        )
    }
}

export default ActivityTab;