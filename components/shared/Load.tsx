"use client";

import { fetchPosts, fetchStringifiedPosts } from "@/lib/actions/thread.actions";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Spinner } from "./Spinner";
import ThreadCard from "../cards/ThreadCard";
import { useInView } from "react-intersection-observer";

interface Thread {
    _id: string;
    currentUserId: string;
    parentId: string | null;
    text: string;
    author: {
        name: string;
        image: string;
        id: string;
    };
    community: {
        id: string;
        name: string;
        image: string;
    } | null;
    createdAt: string;
    children: {
        author: {
            image: string;
        };
    }[];
    likedBy: {
        author: {
            id: string;
        };
    }[];
    hashtags: [];
    isComment?: boolean;
    reposts: [];
    repostedOn: {
        text: string;
        author: {
            id: string;
            image: string;
            name: string;
        };
    };
}

const Load = ({ id }: { id: string }) => {
    const [result, setResult] = useState<Thread[]>([]);
    const [startFetching, setStartFetching] = useState(false);

    const [ loadingState, setLoadingState ] = useState("")

    const [ pagesLoaded, setPagesLoaded ] = useState(2);

    const { ref, inView } = useInView();

    const handleFetchMore = async () => {
        setStartFetching(true);
        console.log('Fetching more posts...');
        try {
          const fetchedPosts = await fetchStringifiedPosts(pagesLoaded, 10, id);

          const posts = JSON.parse(fetchedPosts);
          
          if(posts.length === 0) {
            setLoadingState("All")
          }

          setResult(prev => [...prev, ...posts]);
          console.log('Fetched posts:', posts);
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setStartFetching(false);
        }
    }

    useEffect(() => {
        if(inView) {
            console.log("Spinner is in view.");

            setPagesLoaded((prev) => { return prev + 1;})

            console.log(pagesLoaded);

            handleFetchMore();
        }
    }, [inView])

    return (
        <>
            {result.length === 0 ? (
            <p className="no-result">Loading more svitlos...</p>
            ) : (
            <>
                {result.map((post) => (
                <ThreadCard
                    key={post._id}
                    id={post._id}
                    currentUserId={id}
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

            {loadingState === "All" ? (
                <p className="no-result">You are all cought up!</p>
                ) : (
                    <div className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3" ref={ref}>
                        <Spinner/>
                    </div>
                )
            }
        </>
    );
}

export default Load;

