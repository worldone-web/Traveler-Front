import { Store } from '../core/heropy.js';

const store2 = new Store({
    searchText: '치킨',
    page: 1,
    recommends: [],
    recommend: null, // 특정 가게의 상세 정보를 저장
    restaurantsName:[], // 각 음식점들의 이름들
    loading: false
});

export default store2;

export const recommendRestaurantStores = async (query) => {
    try {
        store2.state.loading = true;
        if (!query) {
            throw new Error('검색어가 비어 있습니다.');
        }
        store2.state.recommends = [];

        const response = await fetch(`/api/recommends?query=${encodeURIComponent(query)}`); // 각 음식점들의 이름들 반환
        
        // 각 음식점들의 정보들의 반환
        // response2 = await fetch -> 함수 하나 더 만들어서 실행

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        const { results } = data;

        //console.log('/api/recommends:', JSON.stringify(results, null, 2)); // 디버깅 로그
        
        store2.state.recommends = [
            ...store2.state.recommends,
            ...results
        ];


    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        store2.state.recommends = [];
    } finally {
        store2.state.loading = false;
    }
};
