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
/*
export const searchRestaurantStores = async (query, page = 1) => {
    try {
        store.state.loading = true;
        const response = await fetch(`/api/places?query=${encodeURIComponent(query)}&page=${page}`);
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.documents && Array.isArray(data.documents)) {
            store.state.restaurants = store.state.restaurants.concat(data.documents.map(place => ({
                name: place.place_name || 'Unknown Place',
                address: place.road_address_name || place.address_name || 'No address provided',
                url: place.place_url || '#',
                category: place.category_name || 'No category',
                phone: place.phone || 'No phone number',
                photoUrl: place.image_url || 'default-image.jpg'
            })));
            
            store.state.page = page;
            store.state.pageMax = data.meta ? Math.ceil(data.meta.total_count / 10) : 1;
        } else {
            console.error('유효한 검색 결과가 없습니다.');
            store.state.restaurants = [];
        }
    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        store.state.restaurants = [];
    } finally {
        store.state.loading = false;
    }
};
*/

export const searchRestaurantStores = async (query, page = 1) => {
    try {
        store.state.loading = true;
        store.state.page=page;
        if(page==1){
            store.state.restaurants=[]
        }
        const response = await fetch(`/api/places?query=${encodeURIComponent(query)}&page=${page}`);
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const {documents, meta} = await response.json();
        console.log('/api/search:', JSON.stringify(documents, null, 2)); // 디버깅 로그  
        //documents로 받음
        store.state.restaurants=[
            ...store.state.restaurants,
            ...documents
        ]

        //kakao RESTAPI한계상 문서노출 45개가 한계 - 최대 페이지 3개
        store.state.pageMax = meta ? Math.ceil(Number(meta.pageable_count) / 15 ) : 1;


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

