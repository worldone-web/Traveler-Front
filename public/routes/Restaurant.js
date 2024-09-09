import { Component } from '../core/heropy.js';
import eatStore, { getRestaurantDetails, getWalkingRoute } from '../store/restaurant.js';

export default class Restaurant extends Component {
    async render() {
        const queryParams = new URLSearchParams(location.hash.split('?')[1]);
        const query = queryParams.get('query');
        const analyzeType = queryParams.get('analyze_type') || 'similar';

        if (!query) {
            this.el.innerHTML = '<p>잘못된 요청입니다. 가게 이름이 없습니다.</p>';
            return;
        }

        try {
            await getRestaurantDetails(query, analyzeType);
            const restaurant = eatStore.state.restaurant;

            if (!restaurant) {
                this.el.innerHTML = '<p>해당 가게 정보를 가져올 수 없습니다.</p>';
                return;
            }

            this.el.classList.add('container', 'the-restaurant');
            this.el.innerHTML = /* html */ `
                <div id="map" style="width: 100%; height: 400px;"></div>
                <div class="specs">
                    <div class="title">
                        ${restaurant.name || 'Unknown Place'}
                    </div>
                    <div>
                        <h3>Location</h3>
                        <span>${restaurant.address || 'No address provided'}</span>
                        &nbsp;/&nbsp;
                        <span>${restaurant.road_address || 'No address provided'}</span>
                    </div>
                    <div>
                        <h3>Phone Number</h3>
                        <p>${restaurant.phone || 'No phone number'}</p>
                    </div>
                    <div>
                        <h3>Rating</h3>
                        <p>${restaurant.rating || 'N/A'}</p>
                    </div>
                    <div>
                        <h3>URL</h3>
                        <a href="${restaurant.page_url}" target="_blank">${restaurant.name} 상세 정보</a>
                    </div>
                </div>
            `;
            
            // 지도 초기화 및 경로 표시
            await this.initializeMap(restaurant);
        } catch (error) {
            console.error('Error in Restaurant render:', error);
            this.el.innerHTML = `<p>데이터를 가져오는 중 오류 발생: ${error.message}</p>`;
        }
    }

    async initializeMap(restaurant) {
        if (!window.kakao) {
            console.error('Kakao Map SDK is not loaded');
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            const { x: restaurantLng, y: restaurantLat } = restaurant;

            const mapContainer = document.getElementById('map');
            const mapOption = {
                center: new kakao.maps.LatLng(userLat, userLng),
                level: 3
            };

            const map = new kakao.maps.Map(mapContainer, mapOption);

            // 가게 위치 마커
            const restaurantPosition = new kakao.maps.LatLng(restaurantLat, restaurantLng);
            const restaurantMarker = new kakao.maps.Marker({
                position: restaurantPosition,
                title: restaurant.name
            });
            restaurantMarker.setMap(map);

            // 사용자 위치 마커
            const userPosition = new kakao.maps.LatLng(userLat, userLng);
            const userMarker = new kakao.maps.Marker({
                position: userPosition,
                title: 'Your location',
                image: new kakao.maps.MarkerImage(
                    'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                    new kakao.maps.Size(24, 35)
                )
            });
            userMarker.setMap(map);

            // 경로 그리기
            try {
                const routeData = await getWalkingRoute(userLng, userLat, restaurantLng, restaurantLat);
                
                // 각 road의 vertexes에서 위도(y)와 경도(x)를 추출하여 path를 만듭니다.
                const linePath = routeData.routes[0].sections[0].roads.flatMap(road => {
                    const path = [];
                    for (let i = 0; i < road.vertexes.length; i += 2) {
                        const lng = road.vertexes[i];
                        const lat = road.vertexes[i + 1];
                        path.push(new kakao.maps.LatLng(lat, lng));
                    }
                    return path;
                });

                const polyline = new kakao.maps.Polyline({
                    path: linePath, // 선을 구성하는 좌표배열
                    strokeWeight: 5, // 선의 두께
                    strokeColor: '#FFAE00', // 선의 색깔
                    strokeOpacity: 0.7, // 선의 불투명도 (0에서 1 사이의 값)
                    strokeStyle: 'solid' // 선의 스타일
                });

                polyline.setMap(map); // 지도에 선을 표시합니다.

                // 지도 범위 조정
                const bounds = new kakao.maps.LatLngBounds();
                linePath.forEach(point => bounds.extend(point));
                map.setBounds(bounds);
            } catch (error) {
                console.error('Error getting route data:', error);
            }
        }, (error) => {
            console.error('Error getting user location:', error);
            this.el.innerHTML = `<p>사용자 위치를 가져오는 중 오류 발생: ${error.message}</p>`;
        });
    }
}
