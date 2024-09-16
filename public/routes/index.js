// 모든 페이지들의 경로들
// 각각의 js를 하나의 페이지로 생각
import Home from "./Home.js";
import Restaurant from "./Restaurant.js";

import { createRouter } from '../core/heropy.js';

export default createRouter([
    { path: '#/', component: Home },
    { path: '#/restaurant', component: Restaurant },
    { path: '#/restaurant/:id', component: Restaurant }, // 특정 레스토랑으로 이동할 때 사용할 라우터
    { path: '/', component: Home } // 루트 경로를 Home에 연결
]);
