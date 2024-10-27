import { Component } from '../core/heropy.js';
import eatStore, { searchRestaurantStores } from '../store/restaurant.js';

export default class Search extends Component {
    constructor(storeListInstance) {
        super();
        this.storeList = storeListInstance;  // 기존 RecommendList 인스턴스 사용
    }

    
    render() {
        this.el.classList.add('search');
        this.el.innerHTML = /*html*/`
            <input 
                value="${eatStore.state.searchText}"
                placeholder="Enter to search for a restaurant by title"/>
            <button class='btn btn-primary'>Search!</button>
        `;

        const inputEl = this.el.querySelector('input');
        inputEl.addEventListener('input', () => {
            eatStore.state.searchText = inputEl.value;
        });

        inputEl.addEventListener('keydown', async event => {
            if (event.key === 'Enter' && eatStore.state.searchText.trim()) {
                try {
                    await searchRestaurantStores(eatStore.state.searchText, 1);
                    const todaySearchEl = this.storeList.querySelector('.today-search');

                    if (todaySearchEl) {
                        // 제목의 display 값을 'block'으로 변경하여 보이게 설정
                        todaySearchEl.style.display = 'block';
                    } else {
                        console.error('today-search 없음');
                    }
                    //this.storeList.render(); // 추천 내용을 업데이트하기 위해 render 호출
                } catch (error) {
                    console.error('검색 중 오류 발생:', error);
                }
            }
        });

        const btnEl = this.el.querySelector('button');
        btnEl.addEventListener('click', async () => {
            if (eatStore.state.searchText.trim()) {
                try {
                    await searchRestaurantStores(eatStore.state.searchText, 1);
                    const todaySearchEl = this.storeList.querySelector('.today-search');

                    if (todaySearchEl) {
                        // 제목의 display 값을 'block'으로 변경하여 보이게 설정
                        todaySearchEl.style.display = 'block';
                    } else {
                        console.error('today-search 없음');
                    }
                    //this.storeList.render(); // 추천 내용을 업데이트하기 위해 render 호출
                } catch (error) {
                    console.error('검색 중 오류 발생:', error);
                }
            }
        });
    }
}
