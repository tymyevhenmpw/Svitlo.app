import ActivityTab from "@/components/shared/ActivityTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { activityTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Page() {
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.onboarded) redirect('/onboarding');

    return (
        <section>
            <h1 className="head-text mb-10">Activity</h1>

            <section className="mt-10 flex flex-col gap-5">
                <Tabs defaultValue="likes" className="w-full">
                        <TabsList className="tab">
                            {activityTabs.map((tab) => (
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
                                            {userInfo?.threads?.length}
                                        </p>
                                    )}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {activityTabs.map((tab) => (
                            <TabsContent key={`content-${tab.label}`} value={tab.value} className="w-full text-light-1">
                                <ActivityTab
                                    currentUserId={user.id}
                                    tabsName={tab.value}
                                />
                            </TabsContent>
                        ))}
                    </Tabs>
            </section>
        </section>
    );
}

export default Page;
