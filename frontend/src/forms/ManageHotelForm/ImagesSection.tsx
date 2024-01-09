import { useFormContext } from "react-hook-form"
import { HotelFormData } from "./ManageHotelForm"

const ImagesSection = () => {
    const { register, formState: {errors}, watch, setValue} = useFormContext<HotelFormData>();
    const currentImageUrls = watch("imageUrls")
    const handleDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, imageUrl: string) =>{
        event.preventDefault();
        setValue(
            "imageUrls", 
            currentImageUrls.filter((url) => url !== imageUrl)
            )
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Images</h2>
            <div className="border rounded p-4 flex flex-col gap-4">

                {currentImageUrls && (
                    <div className="grid grid-cols-6 gap-4">
                        {currentImageUrls.map((url) => (
                            <div className="relative group">
                                <img src={url} className="min-h-full object-cover"/>
                                <button 
                                onClick={(event) => handleDelete(event, url)}
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white">
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <input 
                type="file"
                multiple 
                accept="image/*" 
                className="w-full text-gray-700 font-normal"
                {...register("imageFiles", {
                    validate: (imageFiles) => {
                        const totalFiles = imageFiles.length + (currentImageUrls?.length || 0);
                        if (totalFiles === 0){
                            return "You need to upload at least 1 image"
                        }

                        if (totalFiles > 6){
                            return "You cannot upload more than 6 images"
                        }
                        return true;
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
export default ImagesSection;