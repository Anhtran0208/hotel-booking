import { HotelType } from "../../../backend/src/shared/types";

type Props = {
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childrenCount: number;
    lengthOfStay: number;
    hotel: HotelType
}

const BookingDetailSummary = ({
    checkIn, checkOut, adultCount, childrenCount, lengthOfStay, hotel
}: Props) => {
    return (
    <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
        <h2 className="text-xl font-bold">Your Booking Details</h2>
        <div className="border-b py-2">
            Location:
            <div className="font-bold">{`${hotel.name}, ${hotel.city}, ${hotel.country}`}</div>
        </div>

        <div className="flex justify-between">
            <div>
                Check in 
                <div className="font-bold">{checkIn.toDateString()}</div>
            </div>

            <div>
                Check out
                <div className="font-bold">{checkOut.toDateString()}</div>
            </div>
        </div>

        <div className="border-t border-b py-2">
            Length of Stay 
            <div className="font-bold">
                {lengthOfStay} days
            </div>
        </div>

        <div>
            Guests 
            <div className="font-bold">{adultCount} adults & {childrenCount} children </div>
        </div>
    </div>
    )
}
export default BookingDetailSummary;