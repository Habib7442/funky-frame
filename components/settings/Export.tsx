"use client";
import { useState } from "react";
import { exportToPdf, exportToPng } from "@/lib/utils";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import Link from "next/link";
import Image from "next/image";

const Export = () => {
  const [downloadedImageUrl, setDownloadedImageUrl] = useState<string | null>(
    null
  );

  const handleExportToPng = () => {
    // Call exportToPng function
    const imageUrl = exportToPng();
    // Set the downloaded image URL in state
    setDownloadedImageUrl(imageUrl);
  };

  return (
    <div className="flex flex-col gap-3 px-5 py-3">
      <h3 className="text-[10px] uppercase">Export</h3>
      <Button
        variant="outline"
        className="w-full border border-primary-grey-100 hover:bg-primary-green hover:text-primary-black"
        onClick={exportToPdf}
      >
        Export to PDF
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full border border-primary-grey-100 hover:bg-primary-blue hover:text-primary-black"
            onClick={handleExportToPng}
          >
            Export to PNG
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[880px] border-none flex p-0">
          <div className="w-1/2 bg-transparent">
            {downloadedImageUrl && (
              <Image
                src={downloadedImageUrl}
                alt="Downloaded"
                className="max-w-full"
                width={500}
                height={500}
              />
            )}
            <h1 className="text-center text-xl font-bold bg-teal-600">
              A stroke of genius captured in pixels !
            </h1>
          </div>

          <div className="w-1/2 bg-transparent flex flex-col justify-center items-center px-4">
            <h1 className="text-center text-xl font-bold bg-blue-400 shadow-lg rounded-lg">
              Get review of u&apos;r masterpiece by using Google Gemini !
            </h1>
            <Link href="/review-generations" className="mt-4 bg-red-400 p-2 font-bold shadow-md rounded-md">Get Review</Link>
          </div>
          {/* Conditionally render the downloaded image */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Export;
