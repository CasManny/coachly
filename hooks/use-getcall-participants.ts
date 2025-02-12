import {
  Call,
  useStreamVideoClient
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCallParticipants = (callId: string | undefined) => {
  const client = useStreamVideoClient();
  const [callDetails, setCallDetails] = useState<Call | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCallDetails = async () => {
      if (!client || !callId) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch the call details using the client
        const call = client.call("default", callId); // Replace "default" with your call type
        await call.get(); // Fetches the call details from the server
        setCallDetails(call);

        // Fetch participants using `useParticipants`
        const participantsList = await call.queryMembers({}); // Get all participants
        setParticipants(participantsList.members || []);
      } catch (err) {
        console.error("Error fetching call details:", err);
        setError("Failed to fetch call details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCallDetails();
  }, [client, callId]);

  return { callDetails, participants, isLoading, error };
};
