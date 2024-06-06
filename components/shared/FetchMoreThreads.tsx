"use server";

import { fetchPosts } from "@/lib/actions/thread.actions";

const FetchMoreThreads = async ({ startFetching, nextPage, id }: { startFetching: boolean, nextPage: number, id: string}) => {

    if(startFetching) {
        const result = await fetchPosts(nextPage, 10, id);

        console.log(result);
    }


  return (
    <>
        {/* {result.posts.length === 0 ? (
            <p className="no-result">No threads found</p>
        ) : (
            <>
                {result.posts.map((thread) => (
                    <ThreadCard
                        key={thread._id}
                        id={thread._id}
                        currentUserId={id}
                        parentId={thread.parentId}
                        content={thread.content}
                        author={thread.author}
                        community={thread.community}
                        createdAt={thread.createdAt}
                        likedBy={thread.likedBy}
                        hashtags={thread.hashtags}
                        comments={thread.comments}
                        reposts={thread.reposts}
                        repostedOn={thread.repostedOn}
                    />
                ))}
            </>
        )} */}
    </>
    
  )
}

export default FetchMoreThreads;

    // const [ threads, setThreads ] = useState<Thread[]>([]);
    // const [ pagesLoaded, setPagesLoaded ] = useState(1);

    // const { ref, inView } = useInView();

    // const loadMoreThreads = async () => {

    //     try {
    //         const nextPage = pagesLoaded + 1;

    //         console.log(nextPage);

    //         const result = await fetchPosts(nextPage, 20, id);

    //         // console.log(result);

    //         // setThreads((prevThreads) => [...prevThreads, ...result.posts as Thread[]]);
    //         setPagesLoaded(nextPage);
    //     } catch (error) {
    //         console.error("Failed to load threads:", error);
    //     }
    // };

    // useEffect(() => {
    //     if (inView) {
    //         loadMoreThreads();
    //         console.log("Component is in view.");
    //     }
    // }, [inView]);