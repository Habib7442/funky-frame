"use client";

import { useMemo } from "react";

import { generateRandomName } from "@/lib/utils";
import { Presence, useOthers, useSelf } from "@/liveblocks.config";

import Avatar from "./Avatar";
import { UserButton } from "@clerk/nextjs";
import { User } from "@liveblocks/client";

interface UserInfo {
  name: string;
  avatar: string;
  // Add any other properties if available
}

interface OtherUser {
  connectionId: string;
  info: UserInfo;
}

const ActiveUsers = () => {
  const others = useOthers();

  // console.log("others",others.map((user) => user.info))

  const currentUser = useSelf();

  const memoizedUsers = useMemo(() => {
    const { name, avatar } = currentUser.info as UserInfo;
    // const { name: otherUserName, avatar: otherUserAvatar } = others.info;
    // console.log("firstName", name);
    const hasMoreUsers = others.length > 2;

    return (
      <div className="flex items-center justify-center gap-1">
        {currentUser && (
          <>
            <Avatar
              name={name}
              avatar={avatar}
              otherStyles="border-[3px] border-primary-green"
            />
          </>
        )}

        {others
          .slice(0, 2)
          .map((value: User<Presence, UserMeta>, index: number) => (
            <Avatar
              key={value.connectionId}
              name={value.info.name}
              avatar={value.info.avatar}
              otherStyles="-ml-3"
            />
          ))}

        {hasMoreUsers && (
          <div className="z-10 -ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary-black">
            +{others.length - 2}
          </div>
        )}

        <UserButton />
      </div>
    );
  }, [others?.length]);

  return memoizedUsers;
};

export default ActiveUsers;
