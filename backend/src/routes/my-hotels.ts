import express, { Request, Response} from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import { HotelType } from "../shared/types";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 
    }
})

router.post("/", 
verifyToken, [
    body("name").notEmpty().withMessage("Name is required"),
    body('city').notEmpty().withMessage("City is required"),
    body('country').notEmpty().withMessage("Country is required"),
    body('description').notEmpty().withMessage("Description is required"),
    body('type').notEmpty().withMessage("Type is required"),
    body('pricePerNight').notEmpty().isNumeric().withMessage("Price is required and must be a number"),
    body('facilities').notEmpty().isArray().withMessage("Facilities are required"),
],
upload.array("imageFiles", 6), 
async (req: Request, res: Response) => {
    try {
        const imageFiles = req.files as Express.Multer.File[];
        const newHotel: HotelType = req.body;

        // upload images to cloudinary 
        const uploadPromises = imageFiles.map(async (image) => {
            //encode image in base64 string 
            const b64 = Buffer.from(image.buffer).toString("base64")

            //specify types of image and attach to base64 string
            let dataURI = "data:" + image.mimetype + ";base64," + b64;

            //upload image to cloudinary 
            const res = await cloudinary.v2.uploader.upload(dataURI);
            return res.url;
        })

        const imageUrls = await Promise.all(uploadPromises);

        //add URL to the new hotel if upload was successful
        newHotel.imageURLs = imageUrls;
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId;

        //save hotel in database 
        const hotel = new Hotel(newHotel);
        await hotel.save();
        res.status(201).send(hotel);

    } catch (error) {
        console.log("Error adding the hotel", error);
        res.status(500).json({ message: "Something went wrong. Please try again"});
    }
})

router.get("/", verifyToken, async(req: Request, res: Response) => {
    
    try{
        const hotels = await Hotel.find({userId: req.userId})
        res.json(hotels);
    } catch(error){
        res.status(500).json({message: "Error! Try again"})
    }
})
export default router;