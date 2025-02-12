"use client";

import Image from "next/image";

import { useGetCallParticipants } from "@/hooks/use-getcall-participants";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Loader, User } from "lucide-react";
import { Button } from "./ui/button";

interface MeetingCardProps {
  id: string;
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
}

const MeetingCard = ({
  icon,
  id,
  title,
  date,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
}: MeetingCardProps) => {
  const { toast } = useToast();
  const { participants, isLoading } = useGetCallParticipants(id);
  const numbersOfParticipants = participants.length;

  return (
    <section className="flex min-h-[258px] group w-full flex-col justify-between rounded-[14px] bg-dark-1 px-5 border border-gray-500 py-8 xl:max-w-[568px]">
      <article className="flex flex-col gap-2">
        <Image src={icon} alt="upcoming" width={28} height={28} />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-base font-normal">{date}</p>
        </div>
      </article>
      <article className={cn("relative", {})}>
        <div className="relative flex w-full max-sm:hidden"></div>
        {!isPreviousMeeting && (
          <div className="flex justify-between items-center">
            <div className="">
              {isLoading ? (
                <Loader className="animate-spin size-4" />
              ) : (
                <div className="flex items-center gap-1">
                  <User />
                  <span>participants:{numbersOfParticipants} </span>
                </div>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <Button
                onClick={handleClick}
                className="rounded bg-blue-1 h-8 px-6"
              >
                {buttonIcon1 && (
                  <Image
                    src={buttonIcon1}
                    alt="feature"
                    width={20}
                    height={20}
                  />
                )}
                &nbsp; {buttonText}
              </Button>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(link);
                  toast({
                    title: "Link Copied",
                  });
                }}
                className="bg-dark-4 px-6 h-8"
              >
                <Image
                  src="/icons/copy.svg"
                  alt="feature"
                  width={20}
                  height={20}
                />
                &nbsp; Copy Link
              </Button>
            </div>
          </div>
        )}
      </article>
    </section>
  );
};

export default MeetingCard;
