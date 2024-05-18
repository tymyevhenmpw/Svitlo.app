import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { currentUser } from "@clerk/nextjs";

import { Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Image from "next/image";
import { communityTabs } from "@/constants";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import CommunitiesTab from "@/components/shared/CommunitiesTab";


async function Page({ params }: { params: {id: string}}) {
    const user = await currentUser();

    if(!user) return null;

    const communityDetails = await fetchCommunityDetails(params.id)

    return (
        <section>
            <ProfileHeader 
                accountId={communityDetails.id}
                authUserId={user.id}
                name={communityDetails.name}
                username={communityDetails.username}
                imgUrl={communityDetails.image}
                bio={communityDetails.bio}
                followed={communityDetails.followed}
                following={communityDetails.following}
                type="Community"
            />

            <div className="mt-9">
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                        {communityTabs.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.value} className="tab">
                                <Image
                                    src={tab.icon}
                                    alt={tab.label}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                />
                                <p className="max-sm:hidden">{tab.label}</p>

                                {tab.label === "Threads" && (
                                    <p className="ml-1 rounded-full w-5 h-5 bg-secondary-experimental py-0.5 pr-[2px] max-sm:pr-0 !text-tiny-medium text-light-2">
                                        {communityDetails?.threads?.length}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {communityTabs.map((tab) => (
                        <TabsContent key={`content-${tab.label}`} value={tab.value} className="w-full text-light-1">
                            <CommunitiesTab
                                communityDetails={communityDetails}
                                currentUserId={user.id}
                                accountId={communityDetails._id}
                                accountType="User"
                                tabsName={tab.value}
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    )
}

export default Page;