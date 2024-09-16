import {Component} from '../core/heropy.js'
import eatStore from '../store/restaurant.js';


export default class TheHeader extends Component {
    constructor(){
        super({
            tagName:'header',
            state:{
                menus:[
                    {
                        name:'Search',
                        href:'#/'
                    },
                    {
                        name:'Restaurant',
                        href: `#/restaurant?id=${
                            eatStore.state.restaurant && eatStore.state.restaurant.place_id 
                                ? eatStore.state.restaurant.place_id 
                                : ''
                        }`
            
                    },
                    {
                        name:'About',
                        href:'#/about'
            
                    }
                ]
            }
        })
        window.addEventListener('popstate',()=>{
            this.render()
        })
    }

    render(){       
        this.el.classList.add('headline')
        this.el.innerHTML= /*html*/`
            <a 
                href="#/"
                class="logo">
                <span>TRAVELER</span>.COM
            </a>
            <nav>
                <ul>
                    ${this.state.menus.map(menu=>{
                        const href=menu.href.split('?')[0]
                        const hash=location.hash.split('?')[0]
                        const isActive = href===hash
                        return /*html */`
                            <li>
                                <a 
                                    class="${isActive?'active':''}"
                                    href="${menu.href}">
                                    ${menu.name}
                                </a>
                            </li>
                        `
                    }).join('')} 
                </ul>    
            </nav>
            <a href="#/about" class="user">
                <img src="https://" alt="user">
            </a>
        `   

    }
}