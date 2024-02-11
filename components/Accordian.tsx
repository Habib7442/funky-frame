import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
import { Button } from "./ui/button";

interface AccordianProps {
    captionText: string;
  }
  
  const Accordian: React.FC<AccordianProps> = ({ captionText }) => {
    const captions = captionText.split("\n").filter(Boolean);
  
    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text)
        .then(() => alert("Caption copied to clipboard"))
        .catch((err) => console.error("Failed to copy caption", err));
    };
  
    return (
      <Accordion type="single" className="bg-gray-900 rounded-lg gap-2" collapsible>
        {captions.map((caption, index) => (
          <AccordionItem key={`item-${index + 1}`} value={`item-${index + 1}`}>
            <AccordionTrigger className="text-grey-400 text-xs font-semibold">Caption {index + 1}</AccordionTrigger>
            <AccordionContent className="text-blue-300 text-xs italic font-semibold">
              {caption}
              <Button className="text-white bg-teal-600 my-2 mx-2" variant="outline" size="sm" onClick={() => copyToClipboard(caption)}>Copy Caption</Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };
  
  export default Accordian;
  