import { useParams } from "next/navigation"

export const useGetMeetingId = () => {
    const params = useParams()
    return params.id
}