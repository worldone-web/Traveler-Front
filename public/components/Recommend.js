import { Component } from '../core/heropy.js';
import eatStore, { recommendRestaurantStores } from '../store/restaurant.js';

export default class Recommend extends Component {
    render() {
        this.el.classList.add('recommend');
        this.el.innerHTML = /*html*/`
            
            <button class='btn btn-primary'>Recommend!</button>
        `;
               
       
        const btnEl = this.el.querySelector('button');
        btnEl.addEventListener('click', async () => {
            try {
                await recommendRestaurantStores(eatStore.state.searchText, 1);
            } catch (error) {
                console.error('추천 중 오류 발생:', error);
            }
        });
    }
}
