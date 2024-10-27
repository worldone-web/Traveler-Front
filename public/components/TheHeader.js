import { Component } from '../core/heropy.js';
import eatStore from '../store/restaurant.js';

export default class TheHeader extends Component {
    
    constructor() {
        super({
            tagName: 'header',
            state: {
                storePlaceId: localStorage.getItem('storePlaceId') || '', // 로컬 저장소에서 storePlaceId 가져옴
                menus: [
                    {
                        name: 'Search',
                        href: '#/'
                    },
                    {
                        name: 'Restaurant',
                        href: `#/restaurant?id=${encodeURIComponent(localStorage.getItem('storePlaceId') || '')}` // 로컬 저장소 사용
                    },
                    {
                        name: 'About',
                        href: '#/about'
                    }
                ]
            }
        });
        
        // eatStore의 restaurant 상태가 변경되면 storePlaceId를 localStorage에 저장
        eatStore.subscribe('restaurant', () => {
            const newStorePlaceId = eatStore.state.storePlaceId;
            localStorage.setItem('storePlaceId', newStorePlaceId); // storePlaceId 저장
            this.setState({
                storePlaceId: newStorePlaceId // 상태 업데이트
            });
        });

        window.addEventListener('popstate', () => {
            this.render();
        });
    }

    render() {
        this.el.classList.add('headline');
        this.el.innerHTML = /*html*/`
            <a 
                href="#/"
                class="logo">
                <span>TRAVELER</span>.COM
            </a>
            <nav>
                <ul>
                    ${this.state.menus.map(menu => {
                        // storePlaceId가 존재하면 href에 적용
                        const href = menu.name === 'Restaurant' && this.state.storePlaceId 
                            ? `#/restaurant?id=${encodeURIComponent(this.state.storePlaceId)}` 
                            : menu.href;
                        // URL의 해시를 기반으로 활성화된 메뉴 결정
                        const hrefHash = href.split('?')[0];
                        const hash = location.hash.split('?')[0];
                        const isActive = hrefHash === hash;
                        return /*html */`
                            <li>
                                <a 
                                    class="${isActive ? 'active' : ''}"
                                    href="${href}">
                                    ${menu.name}
                                </a>
                            </li>
                        `;
                    }).join('')} 
                    
                </ul>    
            </nav>
        `;
    }
}
