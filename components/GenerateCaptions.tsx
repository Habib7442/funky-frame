"use client";
import { Loader, Loader2, UploadIcon } from "lucide-react";

import { useMemo, useState } from "react";
// import Loader from "@/components/Loader";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "react-hot-toast";
import Accordian from "./Accordian";
import { Button } from "./ui/button";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const Message = {
  role: "assistant" | "system" | "user",
  content: [],
};

const TextContent = {
  type: "text",
  text: "",
};

const ImageContent = {
  type: "image_url",
  image_url: {
    url: "",
  },
};

const MessageContent = TextContent | ImageContent;

const Captions = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [numCaptions, setNumCaptions] = useState(4);
  const [captionTone, setCaptionTone] = useState("bold");
  const [captionLanguage, setCaptionLanguage] = useState("english");
  const [captionText, setCaptionText] = useState("");

  const router = useRouter();

  const generateContentMemoized = useMemo(() => generateContent, []);

  async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

  async function generateContent(prompt, imageFiles) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const imageParts = await Promise.all(imageFiles.map(fileToGenerativePart));
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    return text;
  }

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.slice(0, 1);

      // Check if the size of the image is less than 2MB
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      const isSizeValid = newImages.every((file) => file.size <= maxSize);

      if (isSizeValid) {
        setImages(newImages);
      } else {
        // Show an error message or handle the oversized image case
        toast.error("Please upload an image with size less than 2MB.");
        // You may also clear the input to prevent further attempts with the same file
        e.target.value = null;
      }
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

 

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const sendMessage = async () => {
    setIsSending(true);

    if (images.length === 0) {
      toast.error("Please upload an image.");
      setIsSending(false);
      return;
    }

    const newUserMessageContent = [
      {
        type: "text",
        text: message,
      },
      ...images.map((file) => ({
        type: "image_url",
        image_url: { url: URL.createObjectURL(file) },
      })),
    ];

    const newUserMessage = {
      role: "user",
      content: newUserMessageContent,
    };

    addMessage(newUserMessage);

    const imageBase64Strings = await Promise.all(
      images.map(fileToGenerativePart)
    );

    const prompt = `Create ${numCaptions} captivating captions in ${captionLanguage} with a ${captionTone} tone. Also add emojis to the captions. Let your creativity shine! 🚀✨`;

    const formData = new FormData();
    formData.append("file", images);

    try {
      const generatedText = await generateContentMemoized(prompt, images);
      setCaptionText(generatedText);

      const rapRes = await fetch("/api/rap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rapText: generatedText }),
      });

      const newAssistantMessage = {
        role: "assistant",
        content: [
          {
            type: "text",
            text: generatedText,
          },
        ],
      };
      addMessage(newAssistantMessage);
      //   setClassificationResult(response);
    } catch (error) {
      if (error?.response?.status === 403) {
        // proModal.onOpen();
        console.log("error", error);
      } else {
        toast.error("Something went wrong");
      }
      console.log(error);
    } finally {
      router.refresh();
      setMessage("");
      setIsSending(false);
    }
  };

  const handleNumCaptionsChange = (e) => {
    setNumCaptions(parseInt(e.target.value, 10));
  };

  const handleCaptionToneChange = (e) => {
    setCaptionTone(e.target.value);
  };

  const handleCaptionLanguageChange = (e) => {
    setCaptionLanguage(e.target.value);
  };

  return (
    <div className="flex flex-col h-screen relative">
      <span className="text-xs text-primary-grey-300 mt-3 px-5 border-b border-primary-grey-200 pb-4">
        Generate Captions using the power of Google Gemini AI.
      </span>
      <div className="flex flex-col w-full justify-center items-center gap-1 px-3 my-1">
        <select
          value={numCaptions}
          onChange={handleNumCaptionsChange}
          className="border p-2 rounded-lg bg-slate-900 text-xs text-grey-400 focus:ring-0 lg:w-full w-20"
        >
          {[2, 4, 6, 8, 10].map((num) => (
            <option key={num} value={num} className=" text-sm">
              {num} Caption{num !== 1 ? "s" : ""}
            </option>
          ))}
        </select>

        <select
          value={captionTone}
          onChange={handleCaptionToneChange}
          className="border p-2 rounded-lg lg:w-full w-20 text-xs bg-slate-900 text-grey-400 focus:ring-0"
        >
          <option className="text-xs" value="bold">
            Bold
          </option>
          <option className="text-xs" value="casual">
            Casual
          </option>
          <option className="text-xs" value="professional">
            Professional
          </option>
          <option className="text-xs" value="funny">
            Funny
          </option>
          {/* Add more tone options as needed */}
        </select>

        <select
          value={captionLanguage}
          onChange={handleCaptionLanguageChange}
          className="border p-2 rounded-lg lg:w-full w-20 text-xs bg-slate-900 text-grey-400 focus:ring-0"
        >
          <option className="text-xs" value="english">
            English
          </option>
          <option className="text-xs" value="hindi">
            Hindi
          </option>
          <option className="text-xs" value="bengali">
            Bengali
          </option>
          <option className="text-xs" value="spanish">
            Spanish
          </option>
          {/* Add more language options as needed */}
        </select>

        <label className="flex justify-center items-center mt-2 lg:mt-0 rounded-lg bg-gray-200 text-gray-500 w-full cursor-pointer">
          <UploadIcon className="w-full bg-gray-700 text-gray-300 rounded-lg" />
          {/* <Button size="sm" className="w-full bg-gray-700 text-gray-300">Upload Image</Button> */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden outline-none border-none"
            disabled={isSending}
          />
        </label>
        {/* <textarea
          className="flex-1 border p-2 rounded-lg bg-slate-900 text-gray-300 focus:ring-0 resize-none"
          placeholder="Describe the image or What is the emotion of the image?"
          rows={1}
          value={message}
          onChange={handleMessageChange}
          disabled={images.length === 0 || isSending}
        ></textarea> */}
        <Button
          className="flex justify-center items-center mt-2 lg:mt-0 p-2 rounded-lg bg-teal-600 text-white h-10 w-full"
          size="sm"
          onClick={sendMessage}
          disabled={isSending}
        >
          {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      <div className="p-4 flex justify-center items-center">
        {images.map((image, index) => (
          <div key={index} className="relative inline-block">
            <Image
              src={URL.createObjectURL(image)}
              alt={`upload-preview ${index}`}
              className="object-cover rounded-lg mr-2 w-24 h-24"
              width={100}
              height={100}
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
            >
              X
            </button>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-1">
        <div className="space-y-4 mt-4">
          {isSending && <Loader />}
          {/* {messages.length === 0 && images.length === 0 && !isSending && (
            <div
              style={{
                background: `url(/mood.png)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                opacity: 0.5,
              }}
            >
              <CaptionEmpty label="No conversation started" />
            </div>
          )} */}
          <div className="flex flex-col gap-y-4 mb-10 px-3">
            <Accordian
              captionText={
                messages.length > 0
                  ? messages[messages.length - 1].content[0].text
                  : "No Caption"
              }
            />
            {/* {messages.map((message, index) => (
              <div
                key={index}
                className="w-full flex flex-col text-gray-400 justify-center items-center"
              >
                <ul>
                    <li>{message.content[0].text}</li>
                </ul>
                <div
                  className={cn(
                    "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  )}
                >
                  
                  <ReactMarkdown
                    components={{
                      pre: ({ node, ...props }) => (
                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                          <pre {...props} />
                        </div>
                      ),
                      code: ({ node, ...props }) => (
                        <code
                          className="bg-black/10 p-2 rounded-lg"
                          {...props}
                        />
                      ),
                    }}
                    className="text-sm overflow-hidden leading-7"
                  >
                    {message.content[0].text}
                  </ReactMarkdown>
                </div>
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Captions;
