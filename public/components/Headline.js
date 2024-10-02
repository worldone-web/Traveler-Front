import {Component} from '../core/heropy.js' 
import eatStore2, {recommendRestaurantStores} from '../store/recommend.js';

export default class Headline extends Component {
    constructor(recommendListInstance) {
        super();
        this.recommendList = recommendListInstance;  // 기존 RecommendList 인스턴스 사용
    }

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
                await recommendRestaurantStores(eatStore2.state.userId); // 추천 데이터 가져오기
                
                
                const todayRecommendationEl = this.recommendList.querySelector('.today-recommendation');

                if (todayRecommendationEl) {
                    // 제목의 display 값을 'block'으로 변경하여 보이게 설정
                    todayRecommendationEl.style.display = 'block';
                } else {
                    console.error('today-recommendation 없음');
                }

                this.recommendList.render(); // 추천 내용을 업데이트하기 위해 render 호출
            } catch (error) {
                console.error('추천 중 오류 발생:', error);
            }
        });

    }
}