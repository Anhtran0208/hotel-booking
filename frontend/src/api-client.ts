import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {HotelSearchResponse, HotelType} from "../../backend/src/shared/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const register = async (formData: RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
    });

    const responseBody = await response.json();

    if (!response.ok) {
        throw new Error(responseBody.message);
    }
}

export const signIn = async (formData: SignInFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })

    const body = await response.json();
    if (!response.ok){
        throw new Error (body.message)
    }
    return body 
}

export const signOut = async () => {
    const response = await fetch (`${API_BASE_URL}/api/auth/logout`, {
        credentials: "include",
        method: "POST",
    });

    if (!response.ok){
        throw new Error ("Unexpected error! Please try again")
    }
}

export const validateToken = async () => {
    const response = await fetch (`${API_BASE_URL}/api/auth/validate-token`, {
        credentials: "include"
    })

    if (!response.ok){
        throw new Error("Token invalid")
    }
    return response.json()
}

export const addMyHotel = async (hotelFormData: FormData) => {
    const response = await fetch (`${API_BASE_URL}/api/my-hotels`, {
        method: "POST",
        credentials: "include",
        body: hotelFormData,
    })

    if (!response.ok){
        throw new Error("Cannot add hotels")
    }
    return response.json();
}

export const viewHotels = async (): Promise<HotelType[]>=> {
    const response = await fetch (`${API_BASE_URL}/api/my-hotels`, {
        credentials: "include"
    })
    if (!response.ok){
        throw new Error("Cannot view hotels")
    }
    return response.json();
}

export const editHotel = async(hotelId: string):Promise<HotelType> =>{
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
        credentials: "include"
    })
    if (!response.ok){
        throw new Error("Cannot find hotel")
    }
    return response.json();
}

export const updateHotelById = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,{
        method: "PUT",
        body: hotelFormData,
        credentials: "include"
    })

    if (!response.ok){
        throw new Error ("Cannot update hotel")
    }
    return response.json()
}

export type SearchParams = {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adultCount?: string;
    childrenCount?: string;
    page?: string;
    facilities?: string[];
    types?: string[];
    stars?: string[];
    maxPrice?: string;
    sortOptions?: string;
}

export const searchHotels = async(searchParams: SearchParams):Promise<HotelSearchResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "")
    queryParams.append("checkIn", searchParams.checkIn || "")
    queryParams.append("checkOut", searchParams.checkOut || "")
    queryParams.append("adultCount", searchParams.adultCount || "")
    queryParams.append("childrenCount", searchParams.childrenCount || "")
    queryParams.append("page", searchParams.page || "");
    queryParams.append("maxPrice", searchParams.maxPrice || "");
    queryParams.append("sortOptions", searchParams.sortOptions || "")
    
    searchParams.facilities?.forEach((facility) => 
    queryParams.append("facilities", facility)
    );

    searchParams.types?.forEach((type) => 
    queryParams.append("types", type)
    );
    
    searchParams.stars?.forEach((star) => 
    queryParams.append("stars", star)
    );


    const response =  await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`)

    if (!response.ok){
        throw new Error ("Error searching hotel")
    }
    return response.json()
}

export const fetchHotelById = async(hotelId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`)
    if (!response.ok){
        throw new Error("Error! Try again")
    }
    return response.json();
}