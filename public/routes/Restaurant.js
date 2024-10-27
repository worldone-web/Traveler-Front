import { Component } from '../core/heropy.js';
import eatStore, { getRestaurantDetails } from '../store/restaurant.js'; // restaurant.js에서 가져온 store와 함수

export default class Restaurant extends Component {
    async render() {
        const queryParams = new URLSearchParams(location.hash.split('?')[1]);
        const placeId = queryParams.get('id');

        eatStore.state.storePlaceId=placeId;
        console.log(eatStore.state.storePlaceId)

        if (!placeId) {
            this.el.innerHTML = '<p>잘못된 요청입니다. 가게 ID가 없습니다.</p>';
            return;
        }

        try {
            await getRestaurantDetails(placeId);
            const restaurant = eatStore.state.restaurant;

            if (!restaurant) {
                this.el.innerHTML = '<p>해당 가게 정보를 가져올 수 없습니다.</p>';
                return;
            }

            this.el.classList.add('container', 'the-restaurant');
            this.el.innerHTML = /* html */ `
                <div id="map" style="width: 100%; height: 400px;" class="classMap"></div>
                <div id="directions-panel">
                    <!-- 세부 경로가 여기에 표시됩니다 -->
                </div>
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
                        <h3>영업 시간</h3>
                        <p>${this.formatOpeningHours(restaurant.opening_hours)}</p>
                    </div>
                    <div class="labels">
                        <h3>서비스 정보</h3>
                        <div>
                            <span>배달 여부 - ${restaurant.delivery_available ? 'O' : 'X'}</span>
                            &nbsp;/&nbsp;
                            <span>식사 여부 - ${restaurant.delivery_available ? 'O' : 'X'}</span>     
                        </div>
                        <div>
                            ${restaurant.place_url ? `<a href="${restaurant.place_url}">음식점 후기</a>` : 'None information'}
                        </div>
                        <div>
                            ${restaurant.place_website ? `<a href="${restaurant.place_website}">음식점 공식 사이트</a>` : 'None information'}
                        </div>
                    </div>
                    <button id="directions-btn">현재 위치에서 경로 찾기</button>
                </div>
            `;

            this.initializeMap(restaurant);

            document.getElementById('directions-btn').addEventListener('click', () => {
                this.findRouteToRestaurant(restaurant);
            });

        } catch (error) {
            console.error('Error in Restaurant render:', error);
            this.el.innerHTML = `<p>데이터를 가져오는 중 오류 발생: ${error.message}</p>`;
        }
    }

    async initializeMap(restaurant) {
        const { geometry } = restaurant;
        const apiKey = await this.getApiKey();

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

        window.initMap = () => {
            const map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: geometry.location.lat, lng: geometry.location.lng },
                zoom: 15
            });

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

    async findRouteToRestaurant(restaurant) {
        const apiKey = await this.getApiKey();
        
        // 필라데핑아 시청 좌표 고정
        const PHCityHallHQCoords = {
            lat: 39.9526,
            lng: -75.1652
        };
        
        // 구글 지도 초기화
        const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: PHCityHallHQCoords
        });
        
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
        
        console.log('필라데피아 시청 좌표:', PHCityHallHQCoords);
        console.log('음식점 좌표:', restaurant.geometry.location);
    
        // 경로 요청
        const request = {
            origin: PHCityHallHQCoords, // 출발지 고정
            destination: {
                lat: restaurant.geometry.location.lat,
                lng: restaurant.geometry.location.lng
            },
            travelMode: google.maps.TravelMode.TRANSIT // 대중교통 경로
        };
          
        
        directionsService.route(request, (result, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(result);
    
                // 세부 경로를 화면에 출력
                this.displayRouteDetails(result.routes[0].legs[0].steps);
    
            } else {
                console.error('Directions request failed due to ' + status);
                alert('경로를 찾을 수 없습니다: ' + status);
            }
        });
    }
    
    displayRouteDetails(steps) {
        const directionsPanel = document.getElementById('directions-panel');
        directionsPanel.innerHTML = ''; // 이전 내용 삭제
    
        steps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            
            // 아이콘 선택
            let icon;
            switch (step.travel_mode) {
                case 'WALKING':
                    icon = '<i class="fas fa-walking"></i>';
                    break;
                case 'TRANSIT':
                    icon = '<i class="fas fa-bus"></i>';
                    break;
                case 'DRIVING':
                    icon = '<i class="fas fa-car"></i>';
                    break;
                default:
                    icon = '<i class="fas fa-question"></i>';
                    break;
            }
    
            // 세부 경로에 아이콘과 정보를 추가
            stepElement.innerHTML = `
                <div class="step-item">
                    <div class="step-icon">${icon}</div>
                    <div class="step-details">
                        <h4>Step ${index + 1}</h4>
                        <p>${step.instructions}</p>
                        <p><strong>거리:</strong> ${step.distance.text}, <strong>시간:</strong> ${step.duration.text}</p>
                    </div>
                </div>
            `;
            directionsPanel.appendChild(stepElement);
        });
    }
    
    

    formatOpeningHours(openingHours) {
        if (!openingHours || !openingHours.weekday_text) {
            return '영업 시간 정보가 없습니다.';
        }

        const formattedHours = openingHours.weekday_text.join('<br>');
        return formattedHours;
    }

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
