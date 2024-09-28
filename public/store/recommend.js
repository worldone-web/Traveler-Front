import { Store } from '../core/heropy.js';

const store2 = new Store({
    userId: 1,
    page: 1,
    recommends: [],
    recommend: null, // 특정 가게의 상세 정보를 저장
    restaurantsName: [], // 각 음식점들의 이름들
    loading: false
});

export default store2;

export const recommendRestaurantStores = async (query) => {
    try {
        store2.state.loading = true;

        if (!query) {
            throw new Error('검색어가 비어 있습니다.');
        }

        store2.state.recommends = []; // 초기화

        const response = await fetch(`/api/recommends?query=${encodeURIComponent(query)}`); // API 호출

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();

        // Check if the data structure is valid
        if (data && data.restaurants && Array.isArray(data.restaurants.list)) {
            const results = data.restaurants.list; // 음식점들의 리스트
            
            // 각 음식점 이름 추출
            const restaurantNames = results.map(restaurant => restaurant.name);
            console.log('음식점 이름들:', restaurantNames);

            // Google API를 통해 각 음식점의 첫 번째 결과 가져오는 비동기 함수
            const fetchFirstRestaurantDetail = async (name) => {
                const response = await fetch(`/api/places?query=${encodeURIComponent(name)}`);
                if (!response.ok) {
                    throw new Error(`Error fetching details for ${name}: ${response.statusText}`);
                }
                const data = await response.json();
                return data.results[0]; // 첫 번째 결과만 반환
            };

            // 모든 음식점의 첫 번째 정보 가져오기
            const detailedRestaurants = await Promise.all(restaurantNames.map(name => fetchFirstRestaurantDetail(name)));

            console.log('/api/recommends:', JSON.stringify(detailedRestaurants, null, 2)); // 디버깅 로그
            
            store2.state.recommends = [
                ...store2.state.recommends,
                ...detailedRestaurants
            ];
        } else {
            console.error('Invalid data structure:', data);
            store2.state.recommends = []; // 잘못된 구조면 초기화
        }

    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        store2.state.recommends = [];
    } finally {
        store2.state.loading = false;
    }
};
