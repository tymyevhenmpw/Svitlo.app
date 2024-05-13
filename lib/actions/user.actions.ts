"use server"

import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string,
}

interface InteractParams {
    userId: string,
    followId: string,
    path: string,
}

export async function updateUser({
    userId, 
    username,
    name,
    bio,
    image,
    path,
}: Params): Promise<void> {
    connectToDB();

    try {
        await User.findOneAndUpdate(
            { id: userId},
            { 
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            },
            { upsert: true }
        );

        if(path === '/profile/edit') {
            revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`)
    }
}

export async function fetchUser(userId: string){
    try {
        connectToDB();

        return User
            .findOne({ id: userId})
            // .populate({
            //     path: 'communities',
            //     model: Community
            // })
    } catch (error:any) {
        throw new Error(`Failed to fetch user: ${error.message}`)
    }
}

export async function fetchUserPosts(userId: string) {
    try {
        connectToDB();

        // Find all threads authored by user with the given userId

        // TODO: Populate community
        const threads = await User.findOne({ id: userId })
          .populate({
            path: 'threads',
            model: Thread,
            populate: [
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: 'name image id'
                        }
                    },
                    {
                        path: 'repostedOn',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: 'id name image'
                        }
                    }
                ]
            })  

          return threads;
    } catch (error: any) {
        throw new Error(`Failed to fetch user posts: ${error.message}`)
    }
}

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"
} : {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
}) {
    try {
        connectToDB();

        const skipAmount = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString, "i");

        const query: FilterQuery<typeof User> = {
           id: { $ne: userId}
        }

        if(searchString.trim() !== "") {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ]
        }

        const sortOptions = { createdAt: sortBy};

        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalUsersCount = await User.countDocuments(query);

        const users = await usersQuery.exec();

        const isNext = totalUsersCount > skipAmount + users.length;

        return { users, isNext };
    } catch (error: any) {
        throw new Error(`Failed to fetch users: ${error.message}`)
    }
}

export async function getLikesActivity(userId: string){
    try {
        connectToDB();

        const user = await User.findOne({ id: userId});

        if(!user){
            throw new Error(`No logged user.`)
        }

        const userThreads = await Thread.find({ author: user._id});

        // Collect all the child thread ids (replies) from the "children" field

        const threadsLikes = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.likedBy)
        }, [])

        const likesOnUsersThreads = await User.find({ _id: { $in: threadsLikes}})

        return likesOnUsersThreads;
    } catch (error: any) {
        throw new Error(`Error fetching the replies activity: ${error.message}`)        
    }
}

export async function getRepliesActivity(userId: string){
    try {
        connectToDB();

        const user = await User.findOne({ id: userId});

        if(!user){
            throw new Error(`No logged user.`)
        }

        const userThreads = await Thread.find({ author: user._id});

        // Collect all the child thread ids (replies) from the "children" field

        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children)
        }, [])

        const repliesOnUsersThreads = await Thread.find({ _id: { $in: childThreadIds }, author: { $ne: user._id } })
            .populate({
                path: 'author',
                model: User,
                select: 'name image _id id'
            })

        return repliesOnUsersThreads;
    } catch (error: any) {
        throw new Error(`Error fetching the replies activity: ${error.message}`)        
    }
}

export async function getRepostsActivity(userId: string){
    try {
        connectToDB();

        const user = await User.findOne({ id: userId});

        if(!user){
            throw new Error(`No logged user.`)
        }

        const userThreads = await Thread.find({ author: user._id});

        // Collect all the child thread ids (replies) from the "children" field

        const repostsIds = userThreads.reduce((acc, userThread) => {
            console.log("User thread reposts: " + userThread.reposts);
            return acc.concat(userThread.reposts)
        }, [])

        const repostsOnUsersThreads = await Thread.find({ _id: { $in: repostsIds } })
            .populate([
                    {
                        path: "author",
                        model: User,
                        select: "id name image _id"
                    },
                    {
                        path: "repostedOn",
                        model: Thread,
                        select: "_id"
                    }
                ])

        return repostsOnUsersThreads;
    } catch (error: any) {
        throw new Error(`Error fetching reposts activity: ${error.message}`)
    }
}

export async function followUser({userId, followId, path}: InteractParams) {
    try {
        connectToDB();

        const currentUser = await User.findOne({ id: userId });

        const userToFollow = await User.findOne({ id: followId });

        const isFollowed = await isUserFollowedOrFollowing({ userId, followId, type: "Followed" })
        if(!currentUser){
            throw new Error("No logged user")
        }

        if(!userToFollow){
            throw new Error("No user to follow")
        }

        if(isFollowed) {
            await currentUser.following.pull(userToFollow._id);
            await userToFollow.followed.pull(currentUser._id);
        } else {
            await currentUser.following.push(userToFollow._id);
            await userToFollow.followed.push(currentUser._id);
        }

        await currentUser.save();
        await userToFollow.save();

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to follow user ${error.message}`)
    }
}

export async function isUserFollowedOrFollowing({userId, followId, type}: {userId: string, followId: string, type: string}) {
    try {
        connectToDB();

        const currentUser = await User.findOne({ id: userId });

        const userToFollow = await User.findOne({ id: followId })

        if(type === "Followed"){
            const isFollowed = userToFollow.followed.includes(currentUser._id);
            
            return isFollowed
        } else if(type === "Following"){
            const isFollowing = userToFollow.following.includes(currentUser._id);
            
            return isFollowing
        }
        

    } catch (error: any) {
        throw new Error(`Failed to determine, whether the user is followed ${error.message}`)
    }
}

export async function fetchUsersWhoFollow(userId: string) {
    try {
        connectToDB();

        const currentUser = await User.findOne({ id: userId }).populate({ path: "followed", model: User, select: "_id id image name username" });

        const usersWhoFollow = currentUser.followed;

        return usersWhoFollow;
    } catch (error: any) {
        throw new Error(`Error fetching users, who follow ${error.message}`)
    }
}

export async function fetchUsersWhoAreFollowed(userId: string) {
    try {
        connectToDB();

        const currentUser = await User.findOne({ id: userId }).populate({ path: "following", model: User, select: "_id id image name username" });

        const usersWhoAreFollowed = currentUser.following;

        return usersWhoAreFollowed;
    } catch (error: any) {
        throw new Error(`Error fetching users, who are followed ${error.message}`)
    }
}

export async function deleteFollower({userId, followId, path}: InteractParams){
    try {
        connectToDB();

        const currentUser = await User.findOne({ id: userId });

        const followingUser = await User.findOne({ id: followId });

        if(!currentUser){
            throw new Error("No logged user")
        }

        if(!followingUser){
            throw new Error("No following user")
        }

        const isFollowing = await isUserFollowedOrFollowing({ userId, followId, type: "Following" });

        if(isFollowing) {
            await currentUser.followed.pull(followingUser._id);
            await followingUser.following.pull(currentUser._id);
        }

        await currentUser.save();
        await followingUser.save();

        console.log(path);

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error deleting follower ${error.message}`)
    }
}