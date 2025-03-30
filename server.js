require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = process.env.OPENWEATHER_API_KEY; 

app.get('/weather', async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ error: 'City parameter is required' });
        }
        
        const response = await axios.get(API_URL, {
            params: { q: city, appid: API_KEY, units: 'metric' }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Weather API error:', error.response?.data || error.message);
        
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            return res.status(error.response.status).json({ 
                error: error.response.data.message || 'Error from weather service' 
            });
        } else {
            return res.status(500).json({ error: 'Failed to fetch weather data' });
        }
    }
});

app.listen(8000, () => console.log('Server running on port 8000'));
