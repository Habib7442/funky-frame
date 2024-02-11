"use client";

import { useMemo } from "react";
import Image from "next/image";

import { getShapeInfo } from "@/lib/utils";
import CreateOrg from "./CreateOrganization";
import List from "./List";
import { OrganizationSwitcher } from "@clerk/nextjs";
import InviteButton from "./InviteButton";

const LeftSidebar = ({ allShapes }: { allShapes: Array<any> }) => {
  // memoize the result of this function so that it doesn't change on every render but only when there are new shapes
  const memoizedShapes = useMemo(
    () => (
      <section className="sticky left-0 flex h-full min-w-[200px] select-none flex-col overflow-y-auto border-t border-primary-grey-200 bg-primary-black pb-20 text-primary-grey-300 max-sm:hidden">
        <InviteButton />
        <div className="mt-2 flex flex-col items-center justify-center">
          <OrganizationSwitcher
            hidePersonal
            appearance={{
              elements: {
                rootBox: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: "5px",
                  paddingInline: "5px",
                },
                organizationSwitcherTrigger: {
                  padding: "6px",
                  width: "100%",
                  borderRadius: "8px",
                  border: "1px solid #4B5563",
                  color: "#9CA3AF",
                  justifyContent: "space-between",
                },
              },
            }}
          />
          <h3 className="border border-primary-grey-200 px-5 py-4 text-xs uppercase">
            Create Organization
          </h3>
          <CreateOrg />
          <List />
        </div>
        <div className="mt-2 flex flex-col">
          <h3 className="border border-primary-grey-200 px-5 py-4 text-xs uppercase">
            Layers
          </h3>
          {allShapes?.map((shape: any) => {
            const info = getShapeInfo(shape[1]?.type);

            return (
              <div
                key={shape[1]?.objectId}
                className="group my-1 flex items-center gap-2 px-5 py-2.5 hover:cursor-pointer hover:bg-primary-green hover:text-primary-black"
              >
                <Image
                  src={info?.icon}
                  alt="Layer"
                  width={16}
                  height={16}
                  className="group-hover:invert"
                />
                <h3 className="text-sm font-semibold capitalize">
                  {info.name}
                </h3>
              </div>
            );
          })}
        </div>
      </section>
    ),
    [allShapes?.length]
  );

  return memoizedShapes;
};

export default LeftSidebar;
