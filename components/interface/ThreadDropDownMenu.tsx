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
import { useState } from "react";

interface Props {
  threadId: string;
  currentUserId: string;
  author: string;
}

const ThreadDropDownMenu = ({ threadId, currentUserId, author }: Props) => {
  
  const [ toRender, setToRender ] = useState(false);
  const pathname = usePathname();

  const [ loading, setLoading ] = useState(false);

  const fetchRender = async () => {
    try {
        const render = await renderCreatorFunctional({threadId: threadId, userId: currentUserId});
        setToRender(render);

        console.log(render);
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
    <div onMouseEnter={fetchRender}>
      <DropdownMenu>
          <DropdownMenuTrigger  onClick={fetchRender}>
              <Image src="/assets/ellipsis-horizontal.svg" height={24} width={24} alt="More"/>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {toRender && <DropdownMenuItem>
                <div className="flex px-2 gap-2 rounded-xl" onClick={handleDelete}>
                  <Image
                    src={loading ? "/assets/spinner.svg" : "/assets/delete.svg"}
                    width={16}
                    height={16}
                    alt="Delete"
                    className={`cursor-pointer object-contain mr-[-4px] border-[#FF4D4D] rounded-full ${!loading && "hover:border-2"}`}
                  />
                  <p>Delete</p>
                </div>
              </DropdownMenuItem>}
          </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ThreadDropDownMenu;