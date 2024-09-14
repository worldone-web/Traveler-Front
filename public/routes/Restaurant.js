import { Component } from '../core/heropy.js';
import eatStore, { getRestaurantDetails } from '../store/restaurant.js'; // restaurant.js에서 가져온 store와 함수

export default class Restaurant extends Component {
    async render() {
        // URL의 쿼리 파라미터를 파싱하여 가게 ID를 추출
        const queryParams = new URLSearchParams(location.hash.split('?')[1]);
        const placeId = queryParams.get('id'); // 가게의 place_id를 가져옴

        if (!placeId) {
            this.el.innerHTML = '<p>잘못된 요청입니다. 가게 ID가 없습니다.</p>';
            return;
        }

        try {
            // getRestaurantDetails 함수로 가게의 상세 정보를 불러옴
            await getRestaurantDetails(placeId);
            const restaurant = eatStore.state.restaurant; // 가져온 가게 정보를 store에서 불러옴

            if (!restaurant) {
                this.el.innerHTML = '<p>해당 가게 정보를 가져올 수 없습니다.</p>';
                return;
            }

            // HTML 구성 및 지도 초기화
            this.el.classList.add('container', 'the-restaurant');
            this.el.innerHTML = /* html */ `
                <div id="map" style="width: 100%; height: 400px;"></div>
                <div class="specs">
                    <div class="title">
                        ${restaurant.name || 'Unknown Place'}
                    </div>
                    <div>
                        <h3>위치</h3>
                        <span>${restaurant.formatted_address || 'No address provided'}</span>
                    </div>
                    <div>
                        <h3>전화번호</h3>
                        <p>${restaurant.phone || 'No phone number'}</p>
                    </div>
                    <div>
                        <h3>개장 시간</h3>
                        <p>${this.formatOpeningHours(restaurant.opening_hours)}</p>
                    </div>
                    <div class="special">
                        <div>
                            <h3>음식점 후기</h3>
                            <p>${restaurant.place_url || 'No delivery information'}</p>
                        </div>
                        <div>
                            <h3>음식점 웹 사이트</h3>
                            <p>${restaurant.place_website || 'No delivery information'}</p>
                        </div>
                        <div>
                            <h3>배달 여부</h3>
                            <p>${restaurant.delivery_available || 'No delivery information'}</p>
                        </div>
                        <div>
                            <h3>식사 여부</h3>
                            <p>${restaurant.delivery_available || 'No delivery information'}</p>
                        </div>

                    <div>
                    
                </div>
            `;

            // Google Maps API로 지도 초기화
            this.initializeMap(restaurant);

        } catch (error) {
            console.error('Error in Restaurant render:', error);
            this.el.innerHTML = `<p>데이터를 가져오는 중 오류 발생: ${error.message}</p>`;
        }
    }

    // Google Maps API로 지도 초기화 및 가게 위치 표시
    async initializeMap(restaurant) {
        const { geometry } = restaurant;
        const apiKey = await this.getApiKey(); // API 키를 가져옴

        // Google Maps API를 비동기로 로딩
        const loadGoogleMapsApi = () => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
                script.async = true;
                script.defer = true;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        // initMap 함수는 구글 지도 API에서 자동으로 호출
        window.initMap = () => {
            const map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: geometry.location.lat, lng: geometry.location.lng },
                zoom: 15
            });

            // 마커 추가
            new google.maps.Marker({
                position: { lat: geometry.location.lat, lng: geometry.location.lng },
                map: map,
                title: restaurant.name
            });
        };

        try {
            await loadGoogleMapsApi();
        } catch (error) {
            console.error('Google Maps API 로딩 실패:', error);
        }
    }

    // 오픈시간과 마감시간 포맷팅 함수
    formatOpeningHours(openingHours) {
        if (!openingHours || !openingHours.weekday_text) {
            return '영업 시간 정보가 없습니다.';
        }
    
        // weekday_text 배열을 HTML로 변환
        const formattedHours = openingHours.weekday_text.join('<br>');
    
        return formattedHours;
    }
    

    // 서버에서 API 키를 가져오는 함수
    async getApiKey() {
        try {
            const response = await fetch('/api/config');
            const { apiKey } = await response.json();
            return apiKey;
        } catch (error) {
            console.error('API 키를 가져오는 중 오류 발생:', error);
            return null;
        }
    }
}
