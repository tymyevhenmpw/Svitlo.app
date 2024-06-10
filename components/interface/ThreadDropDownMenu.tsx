"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteThread, renderCreatorFunctional } from "@/lib/actions/thread.actions";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface Props {
  threadId: string;
  currentUserId: string;
  author: string;
}

const ThreadDropDownMenu = ({ threadId, currentUserId, author }: Props) => {
  
  const [ toRender, setToRender ] = useState(false);
  const pathname = usePathname();

  const [ loading, setLoading ] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      fetchRender();
    }
  }, [inView]);

  const fetchRender = async () => {
    try {
      if(currentUserId === author) {
        setToRender(true);
      }
    } catch (error) {
        console.error(`Error fetching, whether to render creator functional status ${error}`)
    }
  }

  const handleDelete = async () => {
    setLoading(true);

    try{
        await deleteThread({ threadId, userId: currentUserId, path: pathname});
    } finally {
        setLoading(false);
    }
  }

  return (
    <div>
      <DropdownMenu>
          <DropdownMenuTrigger>
              <Image src="/assets/ellipsis-horizontal.svg" height={24} width={24} alt="More"/>
          </DropdownMenuTrigger>
          <DropdownMenuContent ref={ref}>
              <DropdownMenuLabel>Svitlo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {toRender ? (<DropdownMenuItem>
                <div className="flex px-2 gap-2 rounded-xl" onClick={handleDelete}>
                  <Image
                    src={loading ? "/assets/spinner.svg" : "/assets/delete.svg"}
                    width={16}
                    height={16}
                    alt="Delete"
                    className={`cursor-pointer object-contain border-[#FF4D4D] rounded-full ${!loading && "hover:border-2"}`}
                  />
                  <p className="text-red-500">Delete</p>
                  {loading && (
                    <Image height={24} width={24} src="/assets/spinner.svg" alt="Loading"/>
                  )}
                </div>
              </DropdownMenuItem>) : (<DropdownMenuItem><Image height={24} width={24} src="/assets/spinner.svg" alt="Loading"/></DropdownMenuItem>)}
              {!toRender ? (<DropdownMenuItem><p className="text-subtle-medium">Comming soon.</p></DropdownMenuItem>) : (<DropdownMenuItem><Image height={24} width={24} src="/assets/spinner.svg" alt="Loading"/></DropdownMenuItem>)}
          </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ThreadDropDownMenu;