"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { createHashtag } from "./hashtag.actions";
import Hashtag from "../models/hashtag.model";
import Community from "../models/community.model";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    repostedOn: string | null,
    path: string,
}

interface InteractParams {
    threadId: string,
    userId: string,
    path: string,
}
export async function createThread({ text, author, communityId, repostedOn, path }: Params){
    try {
        connectToDB();

        const communityIdObject = await Community.findOne(
            { id: communityId },
            { _id: 1 }
        );

        const createdThread = await Thread.create({
            text,
            author,
            repostedOn: repostedOn,
            community: communityIdObject,
        });

        if(repostedOn){
            const threadThatIsBeingReposted = await Thread.findById(repostedOn);

            threadThatIsBeingReposted.reposts.push(createdThread._id);

            threadThatIsBeingReposted.save();
        }
        // Update user model
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id}
        });

        if (communityIdObject) {
            // Update Community model
            await Community.findByIdAndUpdate(communityIdObject, {
              $push: { threads: createdThread._id },
            });
          }

        await extractHashtags(createdThread._id, author, path);

        revalidatePath(path);   
    } catch (error: any) {
        throw new Error(`Error creating thread: ${error.message}`)
    }
};

export async function extractHashtags(threadId: string, author: string, path: string){
    try {
        connectToDB();

        const currentThread = await Thread.findById(threadId)

        const regex = /#[A-Za-z0-9_]+/g;

        const hashtags = currentThread.text.match(regex);

        if(hashtags) {
            for(const hashtag of hashtags){
                await createHashtag({ threadId: threadId, author: author, text: hashtag.slice(1), path: path});
            }
            
            currentThread.hashtags = hashtags;
            await currentThread.save();
        } else {
            currentThread.hashtags = hashtags;
            await currentThread.save();
        }
        
    } catch (error: any) {
        throw new Error(`Failed to extract hashtags ${error.message}`)
    }
}

export async function fetchPosts(pageNumber: number, pageSize = 10, userId: string) {
    connectToDB();

    // Calculate the number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    // Fetch the posts of the users, who are followed
    const currentUser = await User.findOne({ id: userId });

    const followedUsers = currentUser.following;

    // const newFollowedUsersPosts = await fetchNewFollowedUsersPosts(1, 20, userId)

    // const remainingPostsCount = pageSize - newFollowedUsersPosts.length;

    // Fetch the posts that have no parents (top-level threads...)
    const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({ path: 'author', model: User })
        .populate({
            path: 'children',
            populate: {
                path: 'author',
                model: User,
                select: "_id name parentId image"
            }
        })
        .populate({ path: 'likedBy', model: User, select: "_id id name image" })
        .populate({
            path: 'repostedOn',
            populate: {
                path: 'author',
                model: User,
                select: "_id id name image"
            }
        })
        .populate({
            path: "community",
            model: Community,
          })

        const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined]} });

        const posts = await postsQuery.exec();

        const isNext = totalPostsCount > skipAmount + posts.length;

        return { posts: posts, isNext }
};

export async function fetchStringifiedPosts(pageNumber: number, pageSize = 10, userId: string) {
    connectToDB();

    // Calculate the number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    // Fetch the posts of the users, who are followed
    const currentUser = await User.findOne({ id: userId });

    const followedUsers = currentUser.following;

    // const newFollowedUsersPosts = await fetchNewFollowedUsersPosts(1, 20, userId)

    // const remainingPostsCount = pageSize - newFollowedUsersPosts.length;

    // Fetch the posts that have no parents (top-level threads...)
    const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({ path: 'author', model: User })
        .populate({
            path: 'children',
            populate: {
                path: 'author',
                model: User,
                select: "_id name parentId image"
            }
        })
        .populate({ 
            path: 'likedBy', 
            model: User, select: 
            "_id id name image" 
        })
        .populate({
            path: 'repostedOn',
            populate: {
                path: 'author',
                model: User,
                select: "_id id name image"
            }
        })
        .populate({
            path: "community",
            model: Community,
          })

        const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined]} });

        const posts = await postsQuery.exec();

        const isNext = totalPostsCount > skipAmount + posts.length;

        return JSON.stringify(posts);
};

export async function fetchThreadsComments(threadId: string){
    try {
        connectToDB()

        const threadsComments = await Thread.find({ parentId: threadId})            
            .populate({ path: 'author', model: User })
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: "_id name parentId image"
                }
            })
            .populate({ 
                path: 'likedBy', 
                model: User, select: 
                "_id id name image" 
            })
            .populate({
                path: 'repostedOn',
                populate: {
                    path: 'author',
                    model: User,
                    select: "_id id name image"
                }
            })
            .populate({
                path: "community",
                model: Community,
            })

        return threadsComments;
    } catch (error: any) {
        throw new Error(`Error fetching threads comments: ${error.message}`)
    }
}

// export async function fetchNewFollowedUsersPosts(pageNumber = 1, pageSize = 20, userId: string){
//     connectToDB();

//     // Calculate the number of posts to skip
//     const skipAmount = (pageNumber - 1) * pageSize;

//     // Fetch the posts of the users, who are followed
//     const currentUser = await User.findOne({ id: userId });

//     const followedUsers = currentUser.following;

//     const followedUsersPostQuery = Thread.find({ author: { $in: followedUsers }, parentId: { $in: [null, undefined] } })
//         .sort({ createdAt: 'desc' })
//         .skip(skipAmount)
//         .limit(pageSize)
//         .populate({ path: 'author', model: User })
//         .populate({
//             path: 'children',
//             populate: {
//                 path: 'author',
//                 model: User,
//                 select: "_id name parentId image"
//             }
//         })
//         .populate({
//             path: 'repostedOn',
//             populate: {
//                 path: 'author',
//                 model: User,
//                 select: "_id id name image"
//             }
//         })
//         .populate({
//             path: "community",
//             model: Community,
//           })

//     const followedUsersPosts = await followedUsersPostQuery.exec();

//     const threeDays = 3 * 24 * 60 * 60 * 1000;

//         const olderThanThreeDaysThreads = followedUsersPosts.filter(thread => {
//             const currentDate = new Date().getTime();
//             const threadCreationDate = new Date(thread.createdAt).getTime();

//             const timeDifference = currentDate - threadCreationDate;

//             return timeDifference > threeDays
//         })

//     const newFollowedUsersPosts = followedUsersPosts.filter(thread => !olderThanThreeDaysThreads.includes(thread));

//     return newFollowedUsersPosts;
// }

export async function fetchThreadById(id: string) {
    connectToDB();

    try {
        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: "_id id name image"
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            })
            .populate({
                path: 'repostedOn',
                populate: {
                    path: 'author',
                    model: User,
                    select: "_id id name image"
                }
            })
            .populate({ 
                path: 'likedBy', 
                model: User, 
                select: "_id id name image" 
            })
            .populate({
                path: "community",
                model: Community,
                select: "_id id name image",
              }).exec();
            return thread;
    } catch (error: any) {
        throw new Error(`Error fetching thread: ${error.message}`)
    }
}

export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string,
) {
    connectToDB();

    try {
        // Find the original thread by its ID
        const originalThread = await Thread.findById(threadId);

        if(!originalThread) {
            throw new Error("Thread not found")
        }

        // Create new thread with the comment text
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId,
        })

        // Save the new thread
        const savedCommentThread = await commentThread.save();

        // Update the original thread to include the new comment
        originalThread.children.push(savedCommentThread._id);

        // Save the original thread
        await originalThread.save();

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error adding comment to thread: ${error.message}`)
    }
}

export async function addLikeToThread({
    threadId,
    userId,
    path
}: InteractParams) {
    connectToDB();
    try {

        const currentThread = await Thread.findById(threadId);
        const currentUser = await User.findOne({ id: userId });
        
        if(!currentThread) {
            throw new Error("Thread not found")
        }

        const isLiked = await isThreadLiked({ threadId: threadId, userId: userId })

        if(isLiked) {
            currentThread.likedBy.pull(currentUser._id)
            currentUser.liked.pull(currentThread._id)
        } else {
            currentThread.likedBy.push(currentUser._id)
            currentUser.liked.push(currentThread._id)
        }

        await currentThread.save();
        await currentUser.save();


        revalidatePath(path);


    } catch (error: any) {
        throw new Error(`Error adding like to the thread: ${error.message}`)
    }
}

export async function isThreadLiked({
    threadId,
    userId,
}: {threadId: string, userId: string}) {
    connectToDB();

    try {
        
        const currentThread = await Thread.findById(threadId);
        const currentUser = await User.findOne({ id: userId });

        if(!currentThread) {
            throw new Error("Thread not found")
        }

        const isLiked = currentThread.likedBy.includes(currentUser._id);

        return isLiked;

    } catch (error: any) {
        throw new Error(`Error checking, whether the thread is liked by a user: ${error.message}`)
    }

}

export async function deleteThread({
    threadId,
    userId,
    path
}: InteractParams) {
    connectToDB();

    try {

        const currentThread = await Thread.findById(threadId);
        const currentUser = await User.findOne({ id: userId });
        const usersWhoLikedThread = await User.find({ _id: { $in: currentThread.likedBy } });
        const commentThreads = await Thread.find({ parentId: currentThread._id });
        const community = await Community.findOne({ id: currentThread.cummunity});

        if(!currentThread) {
            throw new Error("Thread not found")
        }

        if(currentUser._id  = currentThread.author) {
            await Thread.findByIdAndDelete(threadId);

            revalidatePath(path);
            
            try {
                
                await currentUser.threads.pull(currentThread._id);

            } catch (error: any) {
                throw new Error(`Error updating author after deleting: ${error.message}`)
            }
            
            try {

                if(currentThread.repostedOn){
                    const repostedThread = await Thread.findById({ _id: currentThread.repostedOn});
                    
                    if(repostedThread){
                        await repostedThread.reposts.pull(currentThread._id);
        
                        await repostedThread.save();
                    }
                }

            } catch (error: any) {
                throw new Error(`Error updating reposts after deleting thread: ${error.message}`)
            }

            try {
                if(currentThread.reposts){
                    const threadsReposts = await Thread.find({ _id: { $in: currentThread.reposts } });

                    for(const threadRepost of threadsReposts) {
                        threadRepost.repostedOn = null;

                        await threadRepost.save();
                    }
                }
            } catch (error: any) {
                throw new Error(`Error turning thread's reposts into a regular threads: ${error.message}`)
            }
            try {

                for(const user of usersWhoLikedThread) {
                    await user.liked.pull(currentThread._id);
                    await user.save();
                }

            } catch (error: any) {
                throw new Error(`Error updating the users, who liked thread, after deleting: ${error.message}`)
            }
            
            try {

                const hashtags = await Hashtag.find({ text: { $in: currentThread.hashtags}});
                
                if(hashtags) {
                    for(const hashtag of hashtags) {
                        await hashtag.threads.pull(currentThread._id)
                        
                        await hashtag.save();
                    }
            }

            } catch (error: any) {
                throw new Error(`Error updating hashtags after deleting: ${error.message}`)
            }
            
            await deleteComments(threadId);

            await currentUser.save();
            
            revalidatePath(path);
        }

    } catch (error: any) {
        throw new Error(`Error deleting thread ${error.message}`)
    }
}

export async function deleteComments( threadId: string) {

    const comments = await Thread.find({ parentId: threadId})

    for(const comment of comments) {

        const usersWhoLikedThread = await User.find({ _id: { $in: comment.likedBy } });

        for(const user of usersWhoLikedThread) {
            await user.liked.pull(comment._id);
            await user.save();
        }

        const hashtags = await Hashtag.find({ text: { $in: comment.hashtags}});

        if(hashtags) {
            for(const hashtag of hashtags) {
                await hashtag.threads.pull(comment._id);

                await hashtag.save();
            }
        }

        await deleteComments(comment._id);

        await Thread.findByIdAndDelete(comment._id)
    }
}

export async function renderCreatorFunctional({threadId, userId}: {threadId: string, userId: string}) {
    connectToDB();

    try {

        const currentThread = await Thread.findById(threadId);
        const currentUser = await User.findOne({ id: userId });

        
        if(!currentThread){
            throw new Error("No thread found")
        }

        if(!currentUser){
            throw new Error("No logged user")
        }

        const renderCreatorFunctional = currentThread.author.equals(currentUser._id);

        return renderCreatorFunctional;

    } catch (error: any) {
        throw new Error(`Error determining the author ${error.message}`) 
    }
}

export async function fetchUsersWhoLikedThread(threadId: string) {
    connectToDB();

    try {
        
        const currentThread = await Thread.findById(threadId).populate({ path: 'likedBy', model: User, select: "_id id image name username"});

       const usersWhoLiked = currentThread.likedBy;
        
        return usersWhoLiked;
    } catch (error: any) {
        throw new Error(`Error fetching users, who liked thread ${error.message}`)
    }
}

export async function fetchThreadsReposts(threadId: string, pageNumber = 1, pageSize = 20) {
    connectToDB();

        const skipAmount = (pageNumber - 1) * pageSize;

        const currentThread = await Thread.findById(threadId);

        const threadsReposts = Thread.find({ _id: { $in: currentThread.reposts}})
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({ path: 'author', model: User })
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: "_id name parentId image"
                }
            })
            .populate({ 
                path: 'likedBy', 
                model: User, 
                select: "_id id name image" 
            })
            .populate({
                path: 'repostedOn',
                populate: {
                    path: 'author',
                    model: User,
                    select: "_id id name image"
                }
            })
            .populate({
                path: "community",
                model: Community,
                select: "_id id name image",
            })

        const totalPostsCount = await Thread.countDocuments({
            repostedOn: { $in: currentThread._id }
        }); // Get the total count of posts            

        const posts = await threadsReposts.exec();
            
        const isNext = totalPostsCount > skipAmount + posts.length;
            
        return { posts, isNext };
}

export async function fetchUsersReposts(accountId: string, pageNumber = 1, pageSize = 20){
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const userAccount = await User.findOne({ id: accountId });

    const accountReposts = Thread.find({ author: userAccount._id, repostedOn: { $ne: null } })
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: 'author', model: User })
    .populate({
        path: 'children',
        populate: {
            path: 'author',
            model: User,
            select: "_id name parentId image"
        }
    })
    .populate({
        path: 'repostedOn',
        populate: {
            path: 'author',
            model: User,
            select: "_id id name image"
        }
    })
    .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
    })
    .populate({ 
        path: 'likedBy', 
        model: User, 
        select: "_id id name image" 
    })

    const totalPostsCount = await Thread.countDocuments({ 
        author: userAccount._id, repostedOn: { $ne: null } 
    }); // Get the total count of posts            

    const posts = await accountReposts.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;
        
    return { posts, isNext };
}