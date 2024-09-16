import { Component } from '../core/heropy.js';
import eatStore from '../store/recommendd.js';
import RecommendItem from './RecommendItem.js';

export default class RecommendList extends Component {
    constructor() {
        super();
        eatStore.subscribe('recommends', () => {
            this.render();
        });
        eatStore.subscribe('loading', () => {
            this.render();
        });
    }

    render() {
        this.el.classList.add('recommend-list');
        this.el.innerHTML = /*html*/`
            <div class="recommends"></div>
            <div class="the-loader hide"></div>
        `;

        const storesEl = this.el.querySelector('.recommends');
        storesEl.innerHTML = ''; 

        //각 음식점 간단한 정보를 출력해주는 부모 컴포넌트 StoreList
        eatStore.state.recommends.forEach(recommend => {
            //음식점 상세 페이지를 출력하는 자식 컴포넌트 StoreItem
            const storeItem = new StoreItem({ 
                store: recommedd
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
