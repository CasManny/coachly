// @ts-nocheck
"use client";
import { useGetCalls } from "@/hooks/use-getcalls";
import { CallRecording } from "@stream-io/node-sdk";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import { Call } from "@stream-io/video-react-sdk";
import Loader from "./Loader";
import { toast } from "@/hooks/use-toast";

interface CallListProps {
  type: "ended" | "upcoming" | "recordings";
}

const CallList = ({ type }: CallListProps) => {
  const { isLoading, endedCalls, upcomingCalls, callRecordings } =
    useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const router = useRouter();

  if (isLoading) return <Loader />;

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recordings":
        return recordings;
      case "upcoming":
        return upcomingCalls;
      default:
        return [];
    }
  };
  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No previous calls";
      case "recordings":
        return "No recordings";
      case "upcoming":
        return "No upcoming calls";
      default:
        return "";
    }
  };

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  console.log(callRecordings)

  useEffect(() => {
    try {
      const fetchRecordings = async () => {
        const callData = await Promise.all(callRecordings.map((meeting) => meeting.queryRecordings()))
        const recordings = callData.filter(call => call.recordings.length > 0).flatMap(call => call.recordings)
        setRecordings(recordings)
      }
  
      if (type === 'recordings') {
        fetchRecordings()
      }
      
    } catch (error) {
      toast({title: "Try again Later"})
    }
  }, [type, recordings])

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call).id}
            icon={
              type === "ended"
                ? "/icons/previous.svg"
                : type === "upcoming"
                ? "/icons/upcoming.svg"
                : "/icons/recordings.svg"
            }
            title={
              (meeting as Call).state?.custom?.description?.subString(0, 26) ||
              (meeting as CallRecording).filename?.substring(0, 20) ||
              "Personal Meeting"
            }
            date={
              (meeting as Call).state?.startsAt?.toLocaleString() ||
              (meeting as CallRecording).start_time?.toLocaleString()
            }
            isPreviousMeeting={type === "ended"}
            link={
              type === "recordings"
                ? (meeting as CallRecording).url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                    (meeting as Call).id
                  }`
            }
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
            buttonText={type === "recordings" ? "Play" : "Start"}
            handleClick={
              type === "recordings"
                ? () => router.push(`${(meeting as CallRecording).url}`)
                : () => router.push(`/meeting/${(meeting as Call).id}`)
            }
          />
        ))
      ) : (
        <h1 className="text-2xl font-bold text-black">{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
