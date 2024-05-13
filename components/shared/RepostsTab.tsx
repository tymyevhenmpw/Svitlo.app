import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchUsersReposts } from "@/lib/actions/thread.actions";

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

const RepostsTab = async ({ currentUserId, accountId, accountType}: Props) => {
    let result = await fetchUsersReposts(accountId, 1, 20);

    if(!result) redirect('/')
    return(
        <section className="mt-9 flex flex-col gap-10 border">
            {result.posts.map((thread: any) => (
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community} // todo
                    createdAt={thread.createdAt}
                    likedBy={thread.likedBy}
                    hashtags={thread.hashtags}
                    comments={thread.children}
                    reposts={thread.reposts}
                    repostedOn={thread.repostedOn}
               />
            ))}
        </section>
    )
}

export default RepostsTab;