import ThreadCard from "@/components/cards/ThreadCard";
import { fetchAllThreadsUnderHashtag, fetchHashtagByText } from "@/lib/actions/hashtag.actions";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";

const Page = async ({ params }: { params: { text: string } }) => {
    if(!params.text) return null

    const user = await currentUser();

    if(!user) return null;

    const result = await fetchAllThreadsUnderHashtag(1, 20, params.text);

    const hashtag = await fetchHashtagByText(params.text);

  return (
    <section className="relative">
        <h1 className="head-text text-left">#{hashtag.text}</h1>
        <h2 className="mt-2 text-light-2 text-body-medium flex gap-2">Created by <Link href={`/profile/${hashtag.author.id}`}><p className="text-primary-experimental">{hashtag.author.username}</p></Link></h2>
        <p className="mt-2 text-white text-small-regular">Firstly mentioned at: <span className="text-primary-experimental">{ new Date(hashtag.createdAt).toLocaleString() }</span></p>
        <div className="mt-9 flex flex-col gap-10">
            {result.posts.length === 0 ? (<p className="no-result">No threads found</p>
            ) : (
                <>
                    {result.posts.map((post) => (
                        <ThreadCard
                            key={post._id}
                            id={post._id}
                            currentUserId={user?.id || ""}
                            parentId={post.parentId}
                            content={post.text}
                            author={post.author}
                            community={post.community}
                            createdAt={post.createdAt}
                            likedBy={post.likedBy}
                            hashtags={post.hashtags}
                            comments={post.children}
                            reposts={post.reposts}
                            repostedOn={post.repostedOn}
                        />
                    ))}
                </>
        )}
        </div>
    </section>

  )
}

export default Page