import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client"
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../context/AppContext";


const EditHotel = () => {
    const {hotelId} = useParams();
    const {showNoti} = useAppContext();
    const { data: hotel } = useQuery("editHotel", () => 
    apiClient.editHotel(hotelId || ''), {
        enabled: !!hotelId
    }
    );

    const {mutate, isLoading} = useMutation(apiClient.updateHotelById, {
        onSuccess: () => {
            showNoti({message: "Update hotel successfully", type: "SUCCESS"})
        },
        onError: () => {
            showNoti({message: "Error updating hotel", type: "ERROR"})
        }
    })

    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData)
    }

    return <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading}/>
}
export default EditHotel;