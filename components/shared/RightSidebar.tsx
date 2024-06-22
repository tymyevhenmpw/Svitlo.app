import { fetchSuggestedCommunities } from "@/lib/actions/community.actions";
import SuggestedCommunityCard from "../cards/SuggestedCommunityCard";
import { fetchSuggestedUsers } from "@/lib/actions/user.actions";
import UserCard from "../cards/UserCard";
import SuggestedUserCard from "../cards/SuggestedUserCard";

async function RightSidebar(){

    //const suggestedCommunities = await fetchSuggestedCommunities();

    //const suggestedUsers = await fetchSuggestedUsers();
    return (
        <section className = "custom-scrollbar rightsidebar">
            <div className = "flex flex-1 flex-col justify-start">
                <h3 className = "text-heading4-medium text-light-1">Suggested Users</h3>
                {/* {suggestedUsers.length > 0 &&
                    (
                        <div className="flex flex-col mt-5">
                            {suggestedUsers.map((person) => (
                                <article className="mt-5">
                                    <SuggestedUserCard
                                        key={person.id}
                                        id={person.id}
                                        name={person.name}
                                        username={person.username}
                                        imgUrl={person.image}
                                    />
                                </article>
                            ))}
                        </div>
                    )
                } */}
            </div>
            <div className = "flex flex-1 flex-col justify-start">
                <h3 className = "text-heading4-medium text-light-1">Suggested Communities</h3>
                {/* {suggestedCommunities.length > 0 &&
                    (
                        <div className="flex flex-col mt-5">
                            {suggestedCommunities.map((community) => (
                                <article className="mt-5">
                                    <SuggestedCommunityCard
                                        key={community.id}
                                        id={community.id}
                                        name={community.name}
                                        username={community.username}
                                        imgUrl={community.image}
                                        members={community.members}
                                    />
                                </article>
                            ))}
                        </div>
                    )
                } */}
            </div>
        </section>
    )
}

export default RightSidebar;