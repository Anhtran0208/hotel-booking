export type HotelType = {
    _id: string;
    userId: string;
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    adultCount: number; 
    childrenCount: number;
    facilities: string[];
    pricePerNight: number;
    starRating: number;
    imageURLs: string[];
    lastUpdated: Date;
}
