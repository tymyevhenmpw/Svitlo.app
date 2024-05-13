import UserCard from "@/components/cards/UserCard";
import { fetchUsersWhoLikedThread } from "@/lib/actions/thread.actions"
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

    const result: Person[] = await fetchUsersWhoLikedThread(params.id);

  return (
    <section className="relative">
        <h1 className="head-text text-left">Liked By</h1>
        <div>
            {result.map((person: Person) => (
                <div className="mt-5">
                    <UserCard
                        key={person.id}
                        id={person.id}
                        name={person.name}
                        username={person.username}
                        imgUrl={person.image}
                        personType="User"
                        type=""
                        currentUserId={user.id}
                    />
                </div>
            ))}
        </div>
    </section>
  )
}

export default Page