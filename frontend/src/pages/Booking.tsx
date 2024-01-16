import { useQuery } from "react-query"
import * as apiClient from "../api-client"
import BookingForm from "../forms/BookingForm/BookingForm"
import { useSearchContext } from "../context/SearchContext"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import BookingDetailSummary from "../components/BookingDetailSummary"
import { Elements } from "@stripe/react-stripe-js"
import { useAppContext } from "../context/AppContext"

const Booking = () => {
    const {stripePromise} = useAppContext();
    const search = useSearchContext();
    const {hotelId} = useParams();

    const {data: hotel} = useQuery("fetchHotelById", 
    () => apiClient.fetchHotelById(hotelId as string), 
    {enabled: !!hotelId})

    const [lengthOfStay, setLengthOfStay] = useState<number>(0)
    useEffect(() => {
        if (search.checkIn && search.checkOut){
            const nights = Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) / (1000*60*60*24);
        setLengthOfStay(Math.ceil(nights))
        }
    }, [search.checkIn, search.checkOut])

    const { data: paymentIntentData} = useQuery(
        "createPayment", () => apiClient.createPayment(hotelId as string, lengthOfStay.toString()),
        {enabled: !!hotelId && lengthOfStay > 0,}
    )

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
            {currentUser && paymentIntentData && 
            (<Elements 
            stripe={stripePromise}
            options={{
                clientSecret: paymentIntentData.clientSecret,
            }}
            >
                <BookingForm 
                currentUser={currentUser}
                paymentIntent={paymentIntentData}
                 />
            </Elements>
            )}
            
        </div>
    )
}
export default Booking;