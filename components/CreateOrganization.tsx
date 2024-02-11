"use client";

import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";

const CreateOrg = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='aspect-square h-10 w-full px-2'>
          <button className='flex w-full my-2 p-2 items-center justify-center rounded-md bg-white/25 opacity-60 transition hover:opacity-100'>
            <Plus className='text-white' />
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className='max-w-[480px] border-none bg-transparent p-0'>
        <CreateOrganization />
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrg;
