import {Component} from '../core/heropy.js' 


export default class Headline extends Component {

    render(){       
        this.el.classList.add('headline')
        this.el.innerHTML= /*html*/`
            <h1>
                <span>Traveler 4</span><br>
                Busan reommendation POI
            </h1>
            <p>
                The website recommends personalized POI locations 
                to tourists to promote tourism in Busan.
            </p>
            <div id='map'></div>
        `   

    }
}