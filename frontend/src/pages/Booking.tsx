import { useQuery } from "react-query"
import * as apiClient from "../api-client"
import BookingForm from "../forms/BookingForm/BookingForm"
import { useSearchContext } from "../context/SearchContext"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import BookingDetailSummary from "../components/BookingDetailSummary"

const Booking = () => {
    const search = useSearchContext();
    const {hotelId} = useParams();

    const {data: hotel} = useQuery("fetchHotelById", 
    () => apiClient.fetchHotelById(hotelId as string), 
    {enabled: !!hotelId})

    const [lengthOfStay, setLengthOfStay] = useState<number>(0)
    useEffect(() => {
        if (search.checkIn && search.checkOut){
            const numberOfNights = Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) / (1000*60*60*24);
        setLengthOfStay(Math.ceil(numberOfNights))
        }
    }, [search.checkIn, search.checkOut])

    const {data: currentUser} = useQuery("viewCurrentUser", apiClient.viewCurrentUser)
    if (!hotel){
        return <></>
    }
    return (
        <div className="grid md:grid-cols-[1fr_2fr]">
            <BookingDetailSummary 
            checkIn={search.checkIn}
            checkOut={search.checkOut}
            adultCount={search.adultCount}
            childrenCount={search.childrenCount}
            lengthOfStay={lengthOfStay}
            hotel={hotel}
            />
            {currentUser && <BookingForm currentUser={currentUser} />}
            
        </div>
    )
}
export default Booking;