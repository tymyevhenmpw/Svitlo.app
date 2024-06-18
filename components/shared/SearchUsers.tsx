"use client"

import Image from "next/image";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { fetchUsers } from "@/lib/actions/user.actions";
import { useInView } from "react-intersection-observer";
import { Spinner } from "./Spinner";
import UserCard from "../cards/UserCard";
import { usePathname } from "next/navigation";

interface User {
    id: string;
    name: string;
    username: string;
    image: string;
    personType: string;
    type: string;
    currentUserId: string;
}

const SearchUsers = ({ userId }: { userId: string }) => {
    const [ inputValue, setInputValue ] = useState("");
    const [ users, setUsers ] = useState<User[]>([]);
    const [ loadingState, setLoadingState ] = useState("");
    const [ isFetching, setIsFetching ] = useState(false);
    const [ pagesLoaded, setPagesLoaded ] = useState(2);

    const { ref, inView } = useInView();

    const pathname = usePathname();

    const handleSearch = async () => {
        setUsers([]);
        setPagesLoaded(2);
        setLoadingState("");
        const result = await fetchUsers({
            userId: userId,
            searchString: inputValue,
            pageNumber: 1,
            pageSize: 3,
            sortBy: 'desc',
            path: pathname
        });

        const parsedUsers = JSON.parse(result);

        if (parsedUsers.length === 0) {
            setLoadingState("All");
        }

        setUsers(parsedUsers);
    };

    const handleFetchMore = async () => {
        setIsFetching(true);

        try {
            const fetchedUsers = await fetchUsers({
                userId: userId,
                searchString: inputValue,
                pageNumber: pagesLoaded,
                pageSize: 3,
                sortBy: 'desc',
                path: pathname
            });

            const parsedUsers = JSON.parse(fetchedUsers);

            if (parsedUsers.length === 0) {
                setLoadingState("All");
                setPagesLoaded(prev => prev - 1);
            } else {
                setLoadingState("");
            }

            setUsers(prev => [...prev, ...parsedUsers]);
        } catch (error: any) {
            throw new Error(`Error fetching more users: ${error.message}`);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (inView && loadingState !== "All") {
            handleFetchMore()
            
            setPagesLoaded(prev => prev + 1);
        }
    }, [inView]);

    return (
        <div>
            <div className="w-full flex gap-3">
                <Input
                    className="bg-dark-2 text-white outline-none border-0 focus-visible:ring-offset-0 rounded-3xl"
                    placeholder="Search"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <Image
                    src="/assets/search.svg"
                    width={24}
                    height={24}
                    alt="Search"
                    className="cursor-pointer"
                    onClick={handleSearch}
                />
            </div>

            {users.length !== 0 && (
                <div className="mt-16">
                    {users.map((user) => (
                        <article className="mt-5">
                            <UserCard
                                key={user.id}
                                id={user.id}
                                name={user.name}
                                username={user.username}
                                imgUrl={user.image}
                                personType="User"
                                type=""
                                currentUserId={userId}
                            />
                        </article>
                    ))}
                </div>
            )}

            {(users.length > 0 && loadingState !== "All") && (
                <div className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3" ref={ref}>
                    <div></div>
                    {isFetching && (
                        <Spinner/>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchUsers;
