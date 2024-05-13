import UserCard from "@/components/cards/UserCard";
import { fetchUsersWhoAreFollowed } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

interface Person {
    _id: string;
    id: string;
    name: string;
    username: string;
    image: string;
}

const Page = async ({ params }: { params: { id: string } }) => {
    if(!params.id) return null;

    const user = await currentUser();

    if(!user) return null;

    let type = "";

    if(params.id === user.id){
        type="Following";
    } else {
        type="";
    }
    const result: Person[] = await fetchUsersWhoAreFollowed(params.id);

    return (
        <section className="relative">
            <h1 className="head-text text-left">Following</h1>
            <div>
                {result.length === 0
                    ? <p className="no-result text-left">{params.id === user.id ? "You don't follow anybody yet" : "The user doesn't follow anybody yet"}</p>
                    : result.map((person: Person) => (
                    <div className="mt-5">
                        <UserCard
                            key={person.id}
                            id={person.id}
                            name={person.name}
                            username={person.username}
                            imgUrl={person.image}
                            personType="User"
                            type={type}
                            currentUserId={user.id}
                        />
                    </div>
                ))}
                {/* TODO: Suggested users */}                
            </div>
        </section>
    )
}

export default Page