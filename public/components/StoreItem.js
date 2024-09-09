import { Component } from '../core/heropy.js';

export default class StoreItem extends Component {
    constructor(props) {
        super({
            props,
            tagName: 'a' // 링크 형태로 렌더링
        });
    }

    render() {
        const { store } = this.props;

        if (!store) {
            console.error('Store object is missing');
            return;
        }

        const { place_name, address_name, url, photoUrl, id } = store;

        // 쿼리와 analyze_type 파라미터를 설정
        const query = encodeURIComponent(place_name); // 가게 이름을 query로 사용
        const analyzeType = 'exact'; // 정확한 매칭을 원할 경우
  
        // 클릭 시 페이지 이동을 방지하고 SPA 라우팅 사용
        this.el.setAttribute('href', `#/restaurant?query=${query}&analyze_type=${analyzeType}`);
        this.el.classList.add('restaurant');
        this.el.style.backgroundImage = `url(${photoUrl || 'default-image.jpg'})`;

        this.el.innerHTML = /*html*/`
            <div class="info">
                <h3 class="name">${place_name}</h3>
                <p class="address">${address_name}</p>
            </div>
        `;
    }
}
