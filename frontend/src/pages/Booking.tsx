import { useQuery } from "react-query"
import * as apiClient from "../api-client"

const Booking = () => {
    const {data: currentUser} = useQuery("viewCurrentUser", apiClient.viewCurrentUser)
}
export default Booking;