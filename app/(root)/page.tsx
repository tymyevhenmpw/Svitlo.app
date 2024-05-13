import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

 
export default async function Home() {
  const user = await currentUser();

  if(!user) return null;
  
  const result = await fetchPosts(1, 30, user.id);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

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