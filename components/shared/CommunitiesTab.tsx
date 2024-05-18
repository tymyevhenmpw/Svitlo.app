import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import UserCard from "../cards/UserCard";

interface Props {
    communityDetails: {
        members: {
            id: string;
            name: string;
            username: string;
            image: string
        }[];
    }
    currentUserId: string;
    accountId: string;
    accountType: string;
    tabsName: string;
}

const CommunitiesTab = async ({ communityDetails, currentUserId, accountId, accountType, tabsName}: Props) => {
    if(tabsName === "threads"){
        let result = await fetchCommunityPosts(accountId);
    
        if(!result) redirect('/')
        return(
            <section className="mt-9 flex flex-col gap-10">
                {result.threads.map((thread: any) => (
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
    } else if(tabsName === "members"){
        return(
            <section className="mt-9 flex flex-col gap-10">
                {communityDetails?.members.map((member: any) => (
                    <UserCard
                        key={member.id}
                        id={member.id}
                        name={member.name}
                        username={member.username}
                        imgUrl={member.image}
                        personType="User"
                        type=""
                        currentUserId={currentUserId}
                    />
                ))}
            </section>
        )
    }
}

export default CommunitiesTab;