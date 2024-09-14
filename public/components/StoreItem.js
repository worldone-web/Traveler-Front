import { Component } from '../core/heropy.js';

export default class StoreItem extends Component {
    constructor(props) {
        super({
            props,
            tagName: 'a' // 링크 형태로 렌더링
        });
    }

    async getApiKey() {
        // 서버에서 API 키를 가져옴
        const response = await fetch('/api/config');
        const { apiKey } = await response.json();
        return apiKey;
    }

    async render() {
        const { store } = this.props;

        if (!store) {
            console.error('Store object is missing');
            return;
        }

        const { name, place_id, photos, rating, user_ratings_total } = store;

        // API 키 가져오기
        const apiKey = await this.getApiKey();

        // 첫 번째 사진 가져오기 (사진이 있을 경우)
        const photoUrl = photos && photos.length > 0
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photos[0].photo_reference}&key=${apiKey}`
            : 'default-image.jpg'; 


        
        const id = encodeURIComponent(place_id); // 가게 id를 이용하여 상세정보 검색
        
  
        // 클릭 시 페이지 이동을 방지하고 SPA 라우팅 사용
        this.el.setAttribute('href', `#/restaurant?id=${id}`);
        this.el.classList.add('restaurant');
        this.el.style.backgroundImage = `url(${photoUrl})`; // 음식점 배경을 첫번 째 사진으로 사용

        // 평점 데이터
        const ratingValue = rating ? `${rating} / 5` : '평점 없음';

        // 전체 사용자 리뷰 수 표시
        const totalRatingsDisplay = user_ratings_total ? `${user_ratings_total}명 리뷰` : '리뷰 없음';

        this.el.innerHTML = /*html*/`
            <div class="info">
                <h3 class="name">${name}</h3>
                <p class="rating">평점: ${ratingValue}</p>
                <p class="total-ratings">${totalRatingsDisplay}</p>
            </div>
        `;
    }
}
