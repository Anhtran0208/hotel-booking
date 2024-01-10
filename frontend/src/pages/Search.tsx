import { useQuery } from "react-query";
import { useSearchContext } from "../context/SearchContext"
import * as apiClient from "../api-client"
import { useState } from "react";
import SearchResultCard from "../components/SearchResultCard";

const Search = () => {
    const search = useSearchContext();
    const [page, setPage] = useState<number>(1)

    const searchParams = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childrenCount: search.childrenCount.toString(),
        page: page.toString(),
    }

    const {data: hotelData} = useQuery(
        ["searchHotels", searchParams], 
        () => apiClient.searchHotels(searchParams)
    )

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
            <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
            </div>

            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                        {hotelData?.pagination.totalHotels} Hotels found
                        {search.destination ? ` in ${search.destination}`: ""}
                    </span>
                </div>
                {hotelData?.data.map(() => (
                    <SearchResultCard hotel={hotel} />
                ))}
            </div>
        </div>
    )
}
export default Search;