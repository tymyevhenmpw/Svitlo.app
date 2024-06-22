"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { useOrganization } from "@clerk/nextjs";
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

function RepostThread({ userId, threadId }: { userId: string, threadId: string }) {

    const router = useRouter();
    const pathname = usePathname();
    const { organization } = useOrganization();

    const [ loadingState, setLoadingState ] = useState(false);
  
    const form = useForm({
      resolver: zodResolver(ThreadValidation),
      defaultValues: {
        thread: '',
        htags: '',
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
          repostedOn: threadId,
          path: pathname
        });
      } catch (error: any) {
        throw new Error(`Error reposting svitlo: ${error.message}`)
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
                Repost content
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
          {loadingState ? "Reposting Svitlo..." : "Repost Svitlo"}
        </Button>
      </form>
      </Form>
    )

}

export default RepostThread;