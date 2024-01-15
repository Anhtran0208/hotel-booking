import express, { Request, Response} from "express";
import Hotel from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";

const router = express.Router();

router.get("/search", async (req: Request, res: Response) => {
    try {
        const query = constructSearchQuery(req.query);

        let sortOptions = {}
        switch(req.query.sortOptions) {
            case "starRating":
                sortOptions = { starRating: -1};
                break;
            case "pricePerNightAsc":
                sortOptions = { pricePerNight: 1};
                break;
            case "pricePerNightDsc":
                sortOptions = {pricePerNight: -1};
                break
        }

        const pageSize = 5;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString():"1")

        const skipPage = (pageNumber - 1) * pageSize
       const hotels = await Hotel.find(query).sort(sortOptions).skip(skipPage).limit(pageSize); 
       const totalHotels = await Hotel.countDocuments(query);

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

router.get("/:id", [
    param("id").notEmpty().withMessage("Hotel ID is required")
], 
async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }

    const id = req.params.id.toString();
    try {
        const hotel = await Hotel.findById(id);
        res.json(hotel)
    } catch(e) {
        console.log(e)
        res.status(500).json({ message: "Error! Try again"})
    }
})



const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};

    if (queryParams.destination) {
        constructedQuery.$or = [
           {city: new RegExp(queryParams.destination, "i")},
           {country: new RegExp(queryParams.destination, "i")}, 
        ]
    }

    if (queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount)
        }
    }

    if (queryParams.childrenCount){
        constructedQuery.childrenCount = {
            $gte: parseInt(queryParams.childrenCount)
        }
    }

    if (queryParams.facilities){
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities) ?
            queryParams.facilities : [queryParams.facilities],
        }
    }

    if (queryParams.types){
        constructedQuery.type = {
            $in: Array.isArray(queryParams.types) ?
            queryParams.types : [queryParams.types]
        }
    }

    if (queryParams.stars){
        const starRating = Array.isArray(queryParams.stars) 
        ? queryParams.stars.map((star: string) => parseInt(star))
        : parseInt(queryParams.stars)

        constructedQuery.starRating = { $eq: starRating}
    }

    if (queryParams.maxPrice){
        constructedQuery.pricePerNight = {
            $gte: parseInt(queryParams.maxPrice).toString()
        }
    }
    return constructedQuery;
}
export default router