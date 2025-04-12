import axios from "axios";

export const getTravelDetails = async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ success: false, message: "From and To locations are required." });
  }

  try {
    // Fetch transport data from Rome2Rio
    const rome2rioResponse = await axios.get(`https://free.rome2rio.com/api/1.4/json/Search`, {
      params: {
        key: process.env.ROME2RIO_API_KEY,
        oName: from,
        dName: to,
      },
    });

    const transportOptions = rome2rioResponse.data.routes
      ?.map((route) => route.name)
      ?.filter((option, index, self) => self.indexOf(option) === index);

    // Fetch places to visit from Triposo
    const triposoResponse = await axios.get(`https://www.triposo.com/api/20220104/location.json`, {
      params: {
        part_of: to,
        tag_labels: "topattractions",
        count: 5,
        account: process.env.TRIPOSO_ACCOUNT_ID,
        token: process.env.TRIPOSO_API_TOKEN,
      },
    });

    const placesToVisit = triposoResponse.data.results?.map((place) => place.name);

    res.status(200).json({
      success: true,
      transportOptions,
      placesToVisit,
    });
  } catch (error) {
    console.error("Travel details error:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// import axios from 'axios';
// import axios from 'axios';

export const getDistanceAndTransport = async (req, res) => {
  const { from, to } = req.body;

  if (!from || !to) {
    return res.status(400).json({
      success: false,
      message: "Both 'from' and 'to' locations are required.",
    });
  }

  try {
    const apiKey = process.env.GEOAPIFY_API_KEY;

    // Step 1: Convert place names to coordinates
    const getCoords = async (place) => {
      const { data } = await axios.get(`https://api.geoapify.com/v1/geocode/search`, {
        params: {
          text: place,
          apiKey,
        },
      });

      const coords = data.features?.[0]?.geometry?.coordinates;
      if (!coords) throw new Error(`Could not find coordinates for: ${place}`);
      return coords; // [lon, lat]
    };

    const [fromCoords, toCoords] = await Promise.all([getCoords(from), getCoords(to)]);

    // Step 2: Get route info between coordinates
    const routeRes = await axios.get(`https://api.geoapify.com/v1/routing`, {
      params: {
        waypoints: `${fromCoords[1]},${fromCoords[0]}|${toCoords[1]},${toCoords[0]}`,
        mode: 'drive',
        apiKey,
      },
    });

    const route = routeRes.data.features[0].properties;

    // Step 3: Get places to visit near destination
    const placesRes = await axios.get(`https://api.geoapify.com/v2/places`, {
      params: {
        categories: 'tourism.sights,leisure.park,catering.restaurant',
        filter: `circle:${toCoords[0]},${toCoords[1]},5000`, // 5km radius
        limit: 5,
        apiKey,
      },
    });
    
    // Safely extract places, with fallback
    const placesToVisit = Array.isArray(placesRes.data.features)
      ? placesRes.data.features
          .map((place) => place?.properties?.name)
          .filter(Boolean)
      : [];
    
      res.json({
        success: true,
        from,
        to,
        distance: `${(route.distance / 1000).toFixed(2)} km`,
        time: `${Math.ceil(route.time / 60)} min`,
        transportOptions: ['Driving', 'Walking', 'Cycling', 'Transit'],
        placesToVisit,
      });
      console.log("Backend Response:", {
        success: true,
        from,
        to,
        distance: `${(route.distance / 1000).toFixed(2)} km`,
        time: `${Math.ceil(route.time / 60)} min`,
        transportOptions: ['Driving', 'Walking', 'Cycling', 'Transit'],
        placesToVisit,
      });  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch travel details.' });
  }
};

// import axios from 'axios';

export const getPlacesToVisit = async (req, res) => {
  const { place } = req.body;

  if (!place) {
    return res.status(400).json({ success: false, message: "Place name is required." });
  }

  try {
    const apiKey = process.env.GEOAPIFY_API_KEY;

    // Get coordinates of the place
    const geoRes = await axios.get(`https://api.geoapify.com/v1/geocode/search`, {
      params: {
        text: place,
        apiKey,
      },
    });

    const coords = geoRes.data.features[0].geometry.coordinates; // [lon, lat]

    // Search for nearby places of interest
    const placesRes = await axios.get(`https://api.geoapify.com/v2/places`, {
      params: {
        categories: 'tourism.sights,leisure.park', // You can add more categories
        filter: `circle:${coords[0]},${coords[1]},5000`, // 5km radius
        limit: 10,
        apiKey,
      },
    });

    const places = placesRes.data.features.map((place) => place.properties.name).filter(Boolean);

    res.json({
      success: true,
      placesToVisit: places,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Failed to fetch places." });
  }
};
