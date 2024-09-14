import express from 'express';
import fetch from 'node-fetch'; // 'node-fetch' 모듈을 사용합니다.
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url); // 파일 경로 반환
const __dirname = path.dirname(__filename); //현재 파일이 속한 디렉토리의 절대 경로 반환

const app = express();
const port = process.env.PORT || 3000;
const API_KEY = process.env.GOOGLE_API_KEY || null;

// API 키를 클라이언트에 전달하는 엔드포인트
app.get('/api/config', (req, res) => {
    res.json({ apiKey: API_KEY });
});


// 클라이언트가 루트경로(/)를 HTTP GET 요청을 보낼 때 실행될 핸들러를 정의
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>부산 음식점 추천 사이트</title>
        <!-- Google font -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
        <!-- CSS 적용 -->
        <link rel="stylesheet" href="main.css">
        <!-- Google Maps API 로딩 -->
        <style>
            #map {
                height: 700px;
                width: 100%;
            }
        </style>
        <script type="module" src="main.js" defer></script>
    </head>
    <body>
        <div id="root"></div>
        <div id="map"></div>
        <script>
            function loadGoogleMapsApi() {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = \`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap\`;
                    script.async = true;
                    script.defer = true;
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }

            function initMap() {
                const mapOptions = {
                    center: { lat: 37.5665, lng: 126.9780 }, // 서울 시청 기준
                    zoom: 12,
                };
                const map = new google.maps.Map(document.getElementById('map'), mapOptions);
            }

            // Google Maps API 로딩
            loadGoogleMapsApi().then(() => {
                console.log('Google Maps API가 성공적으로 로드되었습니다.');
            }).catch((error) => {
                console.error('Google Maps API 로딩 중 오류 발생:', error);
            });
        </script>
    </body>
    </html>
    `);
});

app.get('/api/places', async (req, res) => {
    const { query, page = 1 } = req.query;
    
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }
    console.log(`Query: ${query}, Page: ${page}`); // 디버깅 로그

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2)); 

        res.json(data);
    } catch (error) {
        console.error('Error fetching from Google Places API:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// app.use(): Express.js에서 미들웨어를 설정하는 데 사용, 모든 경로와 모든 요청에 대해 미들웨어를 적용
// express.static(): 특정 디렉토리의 정적 파일들을 제공하기 위해 사용되는 미들웨어, 
// 이 미들웨어를 통해 CSS, JavaScript, 이미지 파일 등의 정적 자원을 쉽게 제공
app.use(express.static(path.join(__dirname, 'public')));

// 서버를 지정된 port에서 실행되게함.
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
