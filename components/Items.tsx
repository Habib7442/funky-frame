"use client";

import { useOrganization, useOrganizationList } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface ItemProps {
  name: string;
  id: string;
  imageUrl: string;
}

const Items = ({ id, name, imageUrl }: ItemProps) => {
  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();

  const isActive = organization?.id === id;

  const onClick = () => {
    if (!setActive) return;

    setActive({organization: id})
  };
  return (
    <div>
      <Image
        src={imageUrl}
        alt={name}
        width={80}
        height={80}
        onClick={() => {}}
        className={cn(
          "cursor-pointer rounded-md opacity-75 transition hover:opacity-100 w-10 h-10",
            !isActive && "opacity-20"
        )}
      />
    </div>
  );
};

export default Items;
