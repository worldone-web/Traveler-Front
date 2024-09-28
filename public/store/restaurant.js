import { Store } from '../core/heropy.js';

const store = new Store({
    searchText: '',
    page: 1,
    restaurants: [],
    restaurant: null, // 특정 가게의 상세 정보를 저장
    pageMax: 1,
    loading: false
});

export default store;

// 음식점 정보를 검색하는 함수
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
        console.log('/api/places:', JSON.stringify(data, null, 2)); // 디버깅 로그
        const { results, next_page_token } = data;

        //console.log('/api/places:', JSON.stringify(results, null, 2)); // 디버깅 로그
        
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

export const getRestaurantDetails = async (placeId) => {
    try {
        store.state.loading = true; 

        // server.js에서 place_id에 해당하는 가게의 상세 정보를 가져옴
        const response = await fetch(`/api/detail?place_id=${encodeURIComponent(placeId)}`);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();

        //console.log('/api/detail:', JSON.stringify(data, null, 2)); // 디버깅 로그

        // 데이터가 유효한 경우 store에 저장
        if (data && typeof data === 'object') {
            store.state.restaurant = {
                name: data.name || 'Unknown Place',
                formatted_address: data.adr_address || 'No address provided',
                phone: data.formatted_phone_number || 'No phone number',
                website: data.website || '#',
                rating: data.rating || 'N/A',
                user_ratings_total: data.user_ratings_total || 'No ratings',
                geometry: data.geometry || {}, // 위도와 경도를 포함한 위치 정보
                photos: data.photos || [], // 사진 배열

                opening_hours: data.current_opening_hours || {}, // 영업 시간 정보
                delivery_available: data.delivery || 'No delivery information', // 배달 여부 (데이터에 포함된 경우)
                dine: data.dine_in || 'no dine information',
                place_url: data.url || 'no url information',
                place_website: data.website || 'no website information',

                icon: data.icon || 'default-image.jpg', // 카테고리 아이콘
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
