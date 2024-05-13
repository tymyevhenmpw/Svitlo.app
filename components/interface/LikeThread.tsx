"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { addLikeToThread, isThreadLiked } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";

interface Props {
  threadId: string;
  currentUserId: string;
  isComment?: boolean;
  parentId?: string | null;
}

const AddLike = ({
  threadId,
  currentUserId,
}: Props) => {
  const [isLiked, setIsLiked] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchIsLiked = async () => {
      try {
        const liked = await isThreadLiked({ threadId, userId: currentUserId });
        setIsLiked(liked);
      } catch (error) {
        console.error(`Error fetching like status ${error}`);
      }
    };

    fetchIsLiked();
  }, [threadId, currentUserId]);

  const handleClick = async () => {
    setIsLiked((prevIsLiked) => !prevIsLiked);
    
    await addLikeToThread({
      threadId,
      userId: currentUserId,
      path: pathname,
    });
  };

  return (
    <Image
      src={`/assets/heart-${isLiked ? "filled" : "gray"}.svg`}
      alt="heart"
      width={24}
      height={24}
      className="cursor-pointer object-contain"
      onClick={handleClick}
    />
  );
};

export default AddLike;
