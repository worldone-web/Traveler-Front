import { Store } from '../core/heropy.js';

const store2 = new Store({
    userId: 12,
    page: 1,
    recommends: [],
    recommend: null, // 특정 가게의 상세 정보를 저장
    restaurantsName: [], // 각 음식점들의 이름들
    loading: false
});

export default store2;

export const recommendRestaurantStores = async (query) => {
    try {
        store2.state.loading = true; // 로딩 상태 설정

        if (!query) {
            throw new Error('검색어가 비어 있습니다.');
        }

        store2.state.recommends = []; // 추천 배열 초기화

        // `/api/recommends` API 호출
        const response = await fetch(`/api/recommends?query=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();

        // 유효한 데이터 구조인지 확인
        if (data && data.restaurants && Array.isArray(data.restaurants.list)) {
            const results = data.restaurants.list; // 음식점 리스트 가져오기
            
            // 각 음식점에 대한 세부 정보 비동기 호출
            const restaurantPromises = results.map(async (restaurant) => {
                const { id, name, latitude, longitude } = restaurant;

                try {
                    // Google Places API를 통해 근처 음식점 검색 요청
                    const exactResponse = await fetch(`/api/exactPlaces?name=${encodeURIComponent(name)}&latitude=${latitude}&longitude=${longitude}`);

                    if (!exactResponse.ok) {
                        throw new Error(`Error fetching details for ${name}: ${exactResponse.statusText}`);
                    }

                    const restaurantDetails = await exactResponse.json();
                    //console.log(restaurantDetails)

                    // 필요한 데이터 구조에 맞게 변환
                    return {
                        id,
                        name,
                        latitude,
                        longitude,
                        details: restaurantDetails.restaurants.length > 0 ? restaurantDetails.restaurants[0] : null // 첫 번째 결과 추가
                    };
                } catch (error) {
                    console.error(`Error fetching details for ${name}:`, error);
                    return { id, name, latitude, longitude, details: null }; // 오류 발생 시 기본 값 반환
                }
            });

            // 모든 비동기 요청이 완료될 때까지 대기
            const filteredRestaurants = await Promise.all(restaurantPromises);

            // recommends 배열에 필터된 음식점 추가
            store2.state.recommends = [
                ...store2.state.recommends,
                ...filteredRestaurants
            ];
            

            

        } else {
            console.error('Invalid data structure:', data);
            store2.state.recommends = []; // 잘못된 구조면 초기화
        }

    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        store2.state.recommends = []; // 오류 발생 시 초기화
    } finally {
        store2.state.loading = false; // 로딩 상태 해제
    }
};
