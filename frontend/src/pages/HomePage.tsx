import { useQuery } from "react-query"
import * as apiClient from "../api-client"
import HotelCard from "../components/HotelCard";

const HomePage = () => {
    const {data: hotels} = useQuery("fetchHotels", () => apiClient.fetchHotels())

    const topHotels = hotels?.slice(0, 2) || [];
    const bottomHotels = hotels?.slice(2) || [];

    return (
        <div className="space-y-3">
            <h2 className="text-3xl font-bold">Latest Destinations</h2>
            <div className="grid gap-4">
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                    {topHotels.map((hotel) => (
                        <HotelCard hotel={hotel} />
                    ))}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {bottomHotels.map((hotel) => (
                        <HotelCard hotel = {hotel} />
                    ))}
                </div>
            </div>
        </div>
    )
}
export default HomePage;