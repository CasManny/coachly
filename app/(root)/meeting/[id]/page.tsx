"use client";
import Loader from "@/components/Loader";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import { useGetCallById } from "@/hooks/use-getcall-byId";
import { useGetMeetingId } from "@/hooks/use-getmeeting-id";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import React, { useState } from "react";
const MeetingId = () => {
  const meetingId = useGetMeetingId()
  const { user, isLoaded } = useUser();
  const { call, isCallLoading } = useGetCallById(meetingId!)
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if(!isLoaded || isCallLoading) return <Loader />
  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? <MeetingSetup setIsSetupComplete={setIsSetupComplete} /> : <MeetingRoom />}
        </StreamTheme>
      </StreamCall>

      <h1>Hello</h1>
    </main>
  );
};

export default MeetingId;
