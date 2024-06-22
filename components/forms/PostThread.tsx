"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrganization } from "@clerk/nextjs";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

//import { updateUser } from "@/lib/actions/user.actions";
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import { Input } from "../ui/input";
import { useState } from "react";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

function PostThread({ userId }: { userId: string }) {

    const router = useRouter();
    const pathname = usePathname();
    const { organization } = useOrganization();

    const [ loadingState, setLoadingState ] = useState(false);

    const form = useForm({
      resolver: zodResolver(ThreadValidation),
      defaultValues: {
        thread: '',
        accountId: userId,
      },
    });
    
    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
      setLoadingState(true);

      try {
        await createThread({
          text: values.thread,
          author: userId,
          communityId: organization ? organization.id : null,
          repostedOn: null,
          path: pathname
        });        
      } catch (error: any) {
        throw new Error(`Error creating new thread: ${error.message}`)
      } finally {
        setLoadingState(false);
      }

      router.push("/")
    }

    return (
      <Form {...form}>
      <form
        className='mt-10 flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Content
              </FormLabel>
              <FormControl className="no-focus border-dark-4 bg-dark-3 text-light-1">
                <Textarea
                  rows={15}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="bg-primary-experimental border-2 border-solid border-primary-experimental">
          {loadingState ? "Creating Svitlo..." : "Post Svitlo"}
        </Button>
      </form>
      </Form>
    )

}

export default PostThread;