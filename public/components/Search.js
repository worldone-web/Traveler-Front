import { Component } from '../core/heropy.js';
import eatStore, { searchRestaurantStores } from '../store/restaurant.js';

export default class Search extends Component {
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
                } catch (error) {
                    console.error('검색 중 오류 발생:', error);
                }
            }
        });
    }
}
