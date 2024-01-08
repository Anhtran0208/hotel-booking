import { useFormContext } from "react-hook-form"
import { HotelFormData } from "./ManageHotelForm"

const ImageSection = () => {
    const { register, formState: {errors}} = useFormContext<HotelFormData>();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Images</h2>
            <div className="border rounded p-4 flex flex-col gap-4">
                <input type="file" 
                multiple accept="image/*" 
                className="w-full text-gray-700 font-normal"
                {...register("imageFiles", {
                    validate: (imageFiles) => {
                        const totalFiles = imageFiles.length;
                        if (totalFiles === 0){
                            return "You need to upload at least one image"
                        }

                        if (totalFiles > 6){
                            return "You cannot upload more than 6 images"
                        }
                    }
                })} />
            </div>
            {errors.imageFiles && (
                <span className="text-red-500 text-sm font-bold">
                    {errors.imageFiles.message}
                </span>
            )}
        </div>
    )
}
export default ImageSection;