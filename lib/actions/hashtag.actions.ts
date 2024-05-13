"use server"

import { revalidatePath } from "next/cache";
import Hashtag from "../models/hashtag.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { M_PLUS_1 } from "next/font/google";
import Community from "../models/community.model";

interface Params {
    threadId: string,
    author: string,
    text: string,
    path: string,
}
export async function createHashtag({threadId, author, text, path}: Params) {
    try {
        connectToDB();

        const existingHashtag = await Hashtag.findOne({ text: text });

        if(!existingHashtag){
            const createdHashtag = await Hashtag.create({ text: text, author: author });

            await createdHashtag.threads.push(threadId);

            await createdHashtag.save();
        } else {
            await existingHashtag.threads.push(threadId);

            await existingHashtag.save();
        }

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to create/update hashtag ${error.message}`)
    }
}

export async function fetchAllThreadsUnderHashtag(pageNumber = 1, pageSize = 20, text: string) {
    try {
        connectToDB();

        const skipAmount = (pageNumber - 1) * pageSize;

        const hashtag = await Hashtag.findOne({ text: text});

        const hashtagThreads = Thread.find({ _id: { $in: hashtag.threads}, parentId: { $in: [null, undefined]}})
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

        const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined]}, hashtags: { $in: hashtag.text}});

        const posts = await hashtagThreads.exec();
    
        const isNext = totalPostsCount > skipAmount + posts.length;
    
        return { posts, isNext }
    } catch (error: any) {
        throw new Error(`Error fetching hashtag's threads ${error.message}`);
    }
}

export async function fetchHashtagByText(text: string){
    try {
        connectToDB();

        const hashtag = await Hashtag.findOne({ text: text}).populate({ path: 'author', model: User, select: "id name username image"});

        return hashtag;
    } catch (error: any) {
        throw new Error(`Error fetching hashtag by text ${error.message}`)
    }
}