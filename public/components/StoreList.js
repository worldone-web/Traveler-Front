import { Component } from '../core/heropy.js';
import eatStore from '../store/restaurant.js';
import StoreItem from './StoreItem.js';

export default class StoreList extends Component {
    constructor() {
        super();
        this.state = {
            isVisible: false // 처음에는 제목을 숨김
        };
        eatStore.subscribe('restaurants', () => {
            this.render();
        });
        eatStore.subscribe('loading', () => {
            this.render();
        });
       
    }

    render() {
        this.el.classList.add('restaurant-list');
        this.el.innerHTML = /*html*/`
            <h2 class="today-search" style="display: ${this.state.isVisible ? 'block' : 'none'};">
                ${eatStore.state.searchText} 검색결과
            </h2> 
            <div class="restaurants"></div>
            <div class="the-loader hide"></div>
        `;

        const storesEl = this.el.querySelector('.restaurants');
        storesEl.innerHTML = ''; 

        //각 음식점 간단한 정보를 출력해주는 부모 컴포넌트 StoreList
        eatStore.state.restaurants.forEach(restaurant => {
            //음식점 상세 페이지를 출력하는 자식 컴포넌트 StoreItem
            const storeItem = new StoreItem({ 
                store: restaurant
            }).el;
            storesEl.append(storeItem);
        });
        

        //로딩 애니메이션 추가
        const loaderEl= this.el.querySelector('.the-loader')
        eatStore.state.loading 
            ? loaderEl.classList.remove('hide') 
            : loaderEl.classList.add('hide')
    }
}
