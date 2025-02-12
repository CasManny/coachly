"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { revalidatePath } from "next/cache";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const apiSecret = process.env.STREAM_SECRET_KEY!;

export const tokenProvider = async () => {
  const user = await currentUser();
  if (!user) throw new Error("User is not logged in");
  if (!apiKey) throw new Error("No api key");
  if (!apiSecret) throw new Error("No apisecret provided");
  const client = new StreamClient(apiKey, apiSecret);
  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;

  const issued = Math.floor(Date.now() / 10000) - 60;
  const token = client.generateUserToken({
    user_id: user.id,
    exp,
    validity_in_seconds: issued,
  });
  return token;
};


