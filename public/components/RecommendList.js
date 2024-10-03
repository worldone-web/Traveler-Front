import { Component } from '../core/heropy.js';
import eatStore2 from '../store/recommend.js';
import RecommendItem from './RecommendItem.js';

export default class RecommendList extends Component {
    constructor() {
        super();
        this.render();  // el 속성을 설정하기 위해 render() 호출
        this.state = {
            isVisible: false // 처음에는 제목을 숨김
        };
        eatStore2.subscribe('recommends', () => {
            this.render();
        });
        eatStore2.subscribe('loading', () => {
            this.render();
        });
    }
    
    render() {
        this.el.classList.add('recommend-list');
        this.el.innerHTML = /*html*/`
            <h2 class="today-recommendation" style="display: ${this.state.isVisible ? 'block' : 'none'};">
                User${eatStore2.state.userId}의 추천 현황
            </h2> 
            <div class="recommends"></div>
            <div class="the-loader hide"></div>
        `;

        const recommendEl = this.el.querySelector('.recommends');
        recommendEl.innerHTML = ''; 

        //각 음식점 간단한 정보를 출력해주는 부모 컴포넌트 StoreList
        eatStore2.state.recommends.forEach(recommend => {
            //음식점 상세 페이지를 출력하는 자식 컴포넌트 StoreItem
            const recommedItem = new RecommendItem({ 
                store: recommend.details
            }).el;
            recommendEl.append(recommedItem);
        });
        

        //로딩 애니메이션 추가
        const loaderEl= this.el.querySelector('.the-loader')
        eatStore2.state.loading 
            ? loaderEl.classList.remove('hide') 
            : loaderEl.classList.add('hide')
    }
}
