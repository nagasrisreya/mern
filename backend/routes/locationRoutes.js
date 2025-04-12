import express from "express";
import { getTravelDetails,getDistanceAndTransport,getPlacesToVisit } from "../controllers/locationController.js"; // Corrected function name

const router = express.Router();

router.get("/details", getTravelDetails); // /api/v1/location/details
router.post('/distance', getDistanceAndTransport);
router.post('/places', getPlacesToVisit); 

export default router; // Use ES module export