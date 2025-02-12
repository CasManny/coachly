import { useParams } from "next/navigation"

export const useGetMeetingById = () => {
    const params = useParams()
    return params.id as string
}