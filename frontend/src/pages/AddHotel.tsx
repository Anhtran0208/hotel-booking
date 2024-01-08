import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../context/AppContext";
import * as apiClient from "../api-client";


const AddHotel = () => {
    const {showNoti} = useAppContext();

    const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
        onSuccess: () => {
            showNoti({ message: "Saved Successfully", type: "SUCCESS"})
        },
        onError: () => {
            showNoti({ message: "Error! Try again", type: "ERROR"});
        },
    });

    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData)
    }
    return (
        <ManageHotelForm onSave={handleSave} isLoading={isLoading} />
    )
}
export default AddHotel;