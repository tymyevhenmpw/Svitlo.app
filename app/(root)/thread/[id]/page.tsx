import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreadById, fetchThreadsComments } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Comment from "@/components/forms/Comment";

const Page = async ({ params }: { params: { id: string}}) => {
    if(!params.id) return null;

    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding');

    const thread = await fetchThreadById(params.id)

    const threadsComments = await fetchThreadsComments(params.id);

    return(
        <section className="relative">
            <div>
            <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={user?.id || ""}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createdAt={thread.createdAt}
                likedBy={thread.likedBy}
                comments={thread.children}
                hashtags={thread.hashtags}
                reposts={thread.reposts}
                repostedOn={thread.repostedOn}
            />
            </div>

            <div className="mt-7">
                <Comment
                    threadId={thread.id}
                    currentUserImg={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>

            <div className="mt-10">
                {threadsComments.map((childItem: any) => (
                    <ThreadCard 
                        key={childItem._id}
                        id={childItem._id}
                        currentUserId={user?.id || ""}
                        parentId={childItem.parentId}
                        content={childItem.text}
                        author={childItem.author}
                        community={childItem.community}
                        createdAt={childItem.createdAt}
                        likedBy={childItem.likedBy}
                        comments={childItem.children}
                        hashtags={childItem.hashtags}
                        reposts={childItem.reposts}
                        repostedOn={childItem.repostedOn}
                        isComment
                    />
                ))}
            </div>
        </section>
    )
}

export default Page;