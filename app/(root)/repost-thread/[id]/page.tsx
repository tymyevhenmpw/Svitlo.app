import ThreadCard from "@/components/cards/ThreadCard";
import RepostThread from "@/components/forms/RepostThread";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


async function Page({ params }: { params: { id: string } }) {
    if(!params.id) return null;

    const user = await currentUser();

    if(!user) return null;

    const userInfo = await fetchUser(user.id);

    if(!userInfo?.onboarded) redirect('/onboarding');

    const threadToRepostOn = await fetchThreadById(params.id);

    return (
        <>
            <h1 className="head-text text-left mb-10">Repost Svitlo</h1>

            <ThreadCard
                key={threadToRepostOn._id}
                id={threadToRepostOn._id}
                currentUserId={user?.id || ""}
                parentId={threadToRepostOn.parentId}
                content={threadToRepostOn.text}
                author={threadToRepostOn.author}
                community={threadToRepostOn.community}
                createdAt={threadToRepostOn.createdAt}
                likedBy={threadToRepostOn.likedBy}
                comments={threadToRepostOn.children}
                hashtags={threadToRepostOn.hashtags}
                reposts={threadToRepostOn.reposts}
                repostedOn={threadToRepostOn.repostedOn}
            />
            
            <RepostThread userId={userInfo._id} threadId={params.id}/>

        </>
    )
}

export default Page;