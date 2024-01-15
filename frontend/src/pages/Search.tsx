import { useQuery } from "react-query";
import { useSearchContext } from "../context/SearchContext"
import * as apiClient from "../api-client"
import { useState } from "react";
import SearchResultCard from "../components/SearchResultCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";

const Search = () => {
    const search = useSearchContext();
    const [page, setPage] = useState<number>(1)
    const [selectedStars, setSelectedStars] = useState<string[]>([])
    const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([])
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
    const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
    const [sortOptions, setSortOptions] = useState<string>("")

    const searchParams = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childrenCount: search.childrenCount.toString(),
        page: page.toString(),
        stars: selectedStars,
        types: selectedHotelTypes,
        facilities: selectedFacilities,
        maxPrice: selectedPrice?.toString(),
        sortOptions,
    }

    const {data: hotelData} = useQuery(
        ["searchHotels", searchParams], 
        () => apiClient.searchHotels(searchParams)
    )

    const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const starRating = event.target.value;

        setSelectedStars((prevStar) =>
        event.target.checked ? [...prevStar, starRating] : prevStar.filter((star) => star !== starRating)
        )
    }

    const handleTypesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const hotelType = event.target.value;

        setSelectedHotelTypes((prevType) => 
        event.target.checked ? [...prevType, hotelType] : prevType.filter((hotel) => hotel !== hotelType)
        )
    }

    const handleFacilitiesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const hotelFacility = event.target.value;

        setSelectedFacilities((prevFacility) => 
        event.target.checked ? [...prevFacility, hotelFacility] : prevFacility.filter((facility) => facility !== hotelFacility)
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
            <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
                <div className="space-y-5">
                    <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
                        Filter by: 
                    </h3>
                    <StarRatingFilter selectedStars={selectedStars} onChange={handleStarsChange}/>
                    <HotelTypesFilter selectedHotelTypes={selectedHotelTypes} onChange={handleTypesChange}/>
                    <FacilitiesFilter selectedFacilities={selectedFacilities} onChange={handleFacilitiesChange} />
                    <PriceFilter selectedPrice={selectedPrice} onChange={(value?: number) => setSelectedPrice(value)} />
                </div>
            </div>

            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                        {hotelData?.pagination.totalHotels} Hotels found
                        {search.destination ? ` in ${search.destination}`: ""}
                    </span>

                    <select 
                        className="p-2 border rounded-md"
                        value={sortOptions} 
                        onChange={(event) => setSortOptions(event.target.value)}>
                            <option value="">Sort by</option>
                            <option value="starRating">Ratings</option>
                            <option value="pricePerNightAsc">Price from low to high</option>
                            <option value="pricePerNightDsc">Price from high to low</option>

                    </select>
                </div>

                {hotelData?.data.map((hotel) => (
                    <SearchResultCard hotel={hotel} />
                ))}

                <div>
                    <Pagination page={hotelData?.pagination.page || 1} 
                    totalPages={hotelData?.pagination.totalPages || 1}
                    onPageChange={(page) =>setPage(page)}
                    />
                </div>
            </div>
        </div>
    )
}
export default Search;