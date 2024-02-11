import { Plus } from "lucide-react";
import { OrganizationProfile } from "@clerk/nextjs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

const InviteButton = () => {
  return (
    <div className="px-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full border-gray-500">
            <Plus className="mr-2 h-4 w-4" />
            Invite Members
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[880px] border-none bg-transparent p-0">
          <OrganizationProfile />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InviteButton;
