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
const API_KEY = process.env.REST_API_KEY || null;

// app.use(): Express.js에서 미들웨어를 설정하는 데 사용, 모든 경로와 모든 요청에 대해 미들웨어를 적용
// express.static(): 특정 디렉토리의 정적 파일들을 제공하기 위해 사용되는 미들웨어, 
// 이 미들웨어를 통해 CSS, JavaScript, 이미지 파일 등의 정적 자원을 쉽게 제공
app.use(express.static(path.join(__dirname, 'public')));

// Kakao Maps API를 호출하는 엔드포인트
app.get('/api/places', async (req, res) => {
    const { query, page } = req.query;

    console.log(`Query: ${query}, Page: ${page}`); // 디버깅 로그

    try {
        const response = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&page=${page}`, {
            headers: {
                'Authorization': `KakaoAK ${API_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Kakao Maps API 요청 중 오류 발생:', error);
        res.status(500).json({ error: 'Kakao Maps API 요청 중 오류 발생' });
    }
});

// 카카오 API를 호출하여 가게 정보를 가져오는 엔드포인트
app.get('/api/detail', async (req, res) => {
    const { query, analyze_type = 'similar' } = req.query; // 쿼리와 analyze_type 파라미터를 가져옴

    console.log(`Query: ${query}, analyze_type: ${analyze_type}`); // 디버깅 로그

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const response = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&analyze_type=${analyze_type}`, {
            headers: {
                'Authorization': `KakaoAK ${API_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        //console.log('API 응답:', JSON.stringify(data, null, 2)); // 디버깅 로그
        const place = data.documents && data.documents.length > 0 ? data.documents[0] : null;

        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }

        res.json(place);
    } catch (error) {
        console.error('Kakao Maps API 요청 중 오류 발생:', error);
        res.status(500).json({ error: 'Kakao Maps API 요청 중 오류 발생' });
    }
});

// Route to fetch walking route from Kakao Navigation API
app.get('/api/route', async (req, res) => {
    const { startX, startY, endX, endY } = req.query;
    console.log(`startX: ${startX}, startY: ${startY}, endX: ${endX}, endY: ${endY}`); // 디버깅 로그
    try {
        const response = await fetch(`https://apis-navi.kakaomobility.com/v1/directions?origin=${startX},${startY}&destination=${endX},${endY}`, {
            headers: {
                'Authorization': `KakaoAK ${API_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API 응답:', JSON.stringify(data, null, 2)); // 디버깅 로그
        res.json(data);
    } catch (error) {
        console.error('Error fetching route:', error);
        res.status(500).json({ error: 'Failed to fetch route' });
    }
});




// 클라이언트가 루트경로(/)를 HTTP GET 요청을 보낼 때 실행될 핸들러를 정의
// res.sendFile() 메서드는 서버에서 특정 파일을 클라이언트에게 전송할 때 사용
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});




// 서버를 지정된 port에서 실행되게함.
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
