import asyncHandler from "express-async-handler";
import axios from "axios";

/**
 * @desc    Search for jobs using the JSearch API
 * @route   GET /api/jobs/search
 * @access  Private (or Public, depending on your app's logic)
 */
export const searchJobs = asyncHandler(async (req, res) => {
    // --- Get search parameters from the frontend query ---
    // Provides default values if nothing is sent from the frontend.
    const { 
        query = 'Software developer in India', 
        page = '1', 
        num_pages = '1' ,

    } = req.query;

    // --- Prepare the request to the RapidAPI ---
    const options = {
        method: 'GET',
        url: 'https://jsearch.p.rapidapi.com/search',
        params: {
            query: query,
            page: page,
            num_pages: num_pages,
            country: 'IN',
        },
        headers: {
            'x-rapidapi-key': process.env.RAPID_KEY, // Securely access your key from .env
            'x-rapidapi-host': 'jsearch.p.rapidapi.com'
        }
    };

    // --- Make the API call and send the response ---
    try {
        const response = await axios.request(options);
        
        // Send the 'data' part of the API response back to your frontend
        res.status(200).json(response.data);

    } catch (error) {
        console.error("Failed to fetch jobs from JSearch API:", error.message);
        res.status(500);
        throw new Error('Could not fetch job listings at this time.');
    }
});
