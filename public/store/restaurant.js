import { Store } from '../core/heropy.js';

const store = new Store({
    searchText: '',
    page: 1,
    restaurants: [],
    restaurant: null, // 특정 가게의 상세 정보를 저장하기 위한 필드
    pageMax: 1,
    loading: false
});

export default store;

// 서버에서 레스토랑 정보를 검색하는 함수
export const searchRestaurantStores = async (query, page = 1) => {
    try {
        store.state.loading = true;
        store.state.page = page;
        if (page === 1) {
            store.state.restaurants = [];
        }

        const response = await fetch(`/api/places?query=${encodeURIComponent(query)}&page=${page}`);
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        const { results, next_page_token } = data;

        console.log('/api/places:', JSON.stringify(results, null, 2)); // 디버깅 로그
        
        store.state.restaurants = [
            ...store.state.restaurants,
            ...results
        ];

        // 페이지 처리
        store.state.pageMax = next_page_token ? (page + 1) : page; // 다음 페이지가 있으면 증가

    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        store.state.restaurants = [];
    } finally {
        store.state.loading = false;
    }
};

export const getRestaurantDetails = async (query, analyzeType = 'exact') => {
    try {
        store.state.loading = true; // Optional: Add loading state if needed
        const response = await fetch(`/api/detail?query=${encodeURIComponent(query)}&analyze_type=${analyzeType}`);
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();

        console.log('/api/detail:', JSON.stringify(data, null, 2)); // 디버깅 로그
        
        // 데이터가 documents 배열이 아닌 경우 직접 객체로 처리
        if (data && typeof data === 'object') {
            store.state.restaurant = {
                name: data.place_name || 'Unknown Place',
                address: data.address_name || 'No address provided',
                road_address: data.road_address_name || 'No address provided',
                page_url: data.place_url || '#',
                category: data.category_name || 'No category',
                phone: data.phone || 'No phone number',
                photoUrl: data.image_url || 'default-image.jpg',
                x: data.x,  // 경도
                y: data.y   // 위도
            };
        } else {
            console.error('가게 상세 정보를 가져올 수 없습니다.');
            store.state.restaurant = null;
        }
    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        store.state.restaurant = null;
    } finally {
        store.state.loading = false; 
    }
};

export const getWalkingRoute = async (startX, startY, endX, endY) => {
    try {
        const response = await fetch(`/api/route?startX=${startX}&startY=${startY}&endX=${endX}&endY=${endY}`);
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();

        //console.log('/api/route:', JSON.stringify(data, null, 2)); // 디버깅 로그
        return data;
    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        throw error;
    }
};

