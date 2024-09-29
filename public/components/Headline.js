import {Component} from '../core/heropy.js' 
import eatStore2, {recommendRestaurantStores} from '../store/recommend.js';

export default class Headline extends Component {

    render(){       
        this.el.classList.add('headline')
        this.el.classList.add('recommend');

        this.el.innerHTML= /*html*/`
            <h1>
                <span>Traveler 4</span><br>
                Busan 
                <button class='btn btn-primary'>Today Recommend!</button><br>
                reommendation POI
                
            </h1>
            <p>
                The website recommends personalized POI locations 
                to tourists to promote tourism in Busan.
            </p>
            <div id='map'></div>
        `   

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