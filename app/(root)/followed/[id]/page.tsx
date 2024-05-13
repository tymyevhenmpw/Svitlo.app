import UserCard from "@/components/cards/UserCard";
import { fetchUsersWhoFollow } from "@/lib/actions/user.actions";
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
        type = "Followed";
    } else {
        type = "";
    }

    const result: Person[] = await fetchUsersWhoFollow(params.id);

    return (
        <section className="relative">
            <h1 className="head-text text-left">Followed By</h1>
            <div>
                {result.length === 0
                    ? <p className="no-result text-left">No followers</p>
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
            </div>
        </section>
    )
}

export default Page;