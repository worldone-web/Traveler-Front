import express from 'express';
import fetch from 'node-fetch'; // 'node-fetch' 모듈을 사용합니다.
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();


const __filename = fileURLToPath(import.meta.url); // 파일 경로 반환
const __dirname = path.dirname(__filename); //현재 파일이 속한 디렉토리의 절대 경로 반환

const app = express();
const port = process.env.PORT || 8080;
const API_KEY = process.env.GOOGLE_API_KEY || null;

// API 키를 클라이언트에 전달하는 엔드포인트
app.get('/api/config', (req, res) => {
    res.json({ apiKey: API_KEY });
});

app.get('/api/places', async (req, res) => {
    const { query, page = 1 } = req.query;
    
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }
    //console.log(`Query: ${query}, Page: ${page}`); // 디버깅 로그

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        //console.log('Search API Response:', JSON.stringify(data, null, 2)); 

        res.json(data);
    } catch (error) {
        console.error('Error fetching from Google Places API:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/api/detail', async (req, res) => {
    const placeId = req.query.place_id;
    
    if (!placeId) {
        return res.status(400).send({ error: 'place_id is required' });
    }

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`);
        const data = await response.json();

        if (data.status !== 'OK') {
            return res.status(500).send({ error: 'Failed to fetch place details', details: data });
        }
        //console.log('Detail API Response:', JSON.stringify(data, null, 2)); 

        res.json(data.result); 
    } catch (error) {
        console.error('Error fetching place details:', error);
        res.status(500).send({ error: 'Error fetching place details' });
    }
});

app.get('/api/recommends', async (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const response = await fetch(`http://127.0.0.1:5000/recommend/${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        
        const data = await response.json();
        //console.log('Recommend API Response:', JSON.stringify(data, null, 2)); 

        // Check if the data structure is valid
        if (data && data.restaurants && Array.isArray(data.restaurants.list)) {
            // Send the valid data response
            res.json(data);
        } else {
            // Handle invalid data structure
            console.error('Invalid data structure:', data);
            res.status(500).json({ error: 'Invalid data structure from recommendation API' });
        }
    } catch (error) {
        console.error('Error fetching from Google Places API:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/api/exactPlaces', async (req, res) => {
    const { name, latitude, longitude, radius = 500 } = req.query; // 기본 반경을 1000미터로 설정

    // query, latitude, longitude가 없을 경우 에러 반환
    if (!name || !latitude || !longitude) {
        return res.status(400).json({ error: 'Name, latitude, and longitude parameters are required' });
    }

    try {
        

        // Google Places Nearby Search API 호출
        const searchResponse = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=${encodeURIComponent(name)}&key=${API_KEY}`);

        // API 응답 상태 확인
        if (!searchResponse.ok) {
            throw new Error(`Network response was not ok: ${searchResponse.statusText}`);
        }

        const searchData = await searchResponse.json();

        // 결과 반환
        res.json({ restaurants: searchData.results });

    } catch (error) {
        console.error('Error fetching from Google Places API:', error);
        res.status(500).json({ error: 'Failed to fetch data from Google Places API' });
    }
});







// app.use(): Express.js에서 미들웨어를 설정하는 데 사용, 모든 경로와 모든 요청에 대해 미들웨어를 적용
// express.static(): 특정 디렉토리의 정적 파일들을 제공하기 위해 사용되는 미들웨어, 
// 이 미들웨어를 통해 CSS, JavaScript, 이미지 파일 등의 정적 자원을 쉽게 제공
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 서버를 지정된 port에서 실행되게함.
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
