import SearchUsers from "@/components/shared/SearchUsers";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async () => {
    const user = await currentUser()
    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.onboarded) redirect('/onboarding');

    return(
        <SearchUsers userId={user.id}/>
    )
}

export default Page;
