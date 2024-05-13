import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreadsReposts } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";

const Page = async ({ params }: { params: { id: string } }) => {

    if(!params.id) return null;

    const user = await currentUser();

    if(!user) return null;
    
    const result = await fetchThreadsReposts(params.id, 1, 20);
  
  return (
    <>
      <h1 className="head-text text-left">Reposts</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
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
      </section>
    </>
  )
}

export default Page