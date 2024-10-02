import { Component } from '../core/heropy.js';
import eatStore2, {recommendRestaurantStores} from '../store/recommend.js';

export default class Recommend extends Component {
  
    render() {
        this.el.classList.add('recommend');
        this.el.innerHTML = /*html*/`
            <input 
                value="${eatStore2.state.userId}"
                placeholder="Enter the UserNumber"/>
            <button class='btn btn-primary'>Recommend!</button>
        `;
        
        const inputEl = this.el.querySelector('input');
        inputEl.addEventListener('input', () => {
            eatStore2.state.userId = inputEl.value;
        });
       
        const btnEl = this.el.querySelector('button');
        btnEl.addEventListener('click', async () => {
            try {
                await recommendRestaurantStores(eatStore2.state.userId);
            } catch (error) {
                console.error('추천 중 오류 발생:', error);
            }
        });
    }
}
