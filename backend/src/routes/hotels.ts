import express, { Request, Response} from "express";
import Hotel from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";

const router = express.Router();
router.get("/search", async (req: Request, res: Response) => {
    try {
        const pageSize = 5;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString():"1")

        const skipPage = (pageNumber - 1) * pageSize
       const hotels = await Hotel.find().skip(skipPage).limit(pageSize); 
       const totalHotels = await Hotel.countDocuments();

       const response: HotelSearchResponse= {
        data: hotels,
        pagination: {
            totalHotels,
            page: pageNumber,
            totalPages: Math.ceil(totalHotels / pageSize),
        }
       }
       res.json(response);
    } catch(e){
        console.log("error", e)
        res.status(500).json({message: "Something went wrong"})
    }
})
export default router