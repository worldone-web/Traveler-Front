import App from './App.js';
import router from './routes/index.js';


// 앱을 렌더링
const root = document.querySelector("#root");
root.append(new App().el);


// 라우터 설정
router();

