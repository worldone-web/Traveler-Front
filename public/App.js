
import {Component} from './core/heropy.js' // Default import
import TheHeader from './components/TheHeader.js';



export default class App extends Component {
    render(){
        
        const theHeader = new TheHeader().el
        const routerView = document.createElement('router-view');
        this.el.append(
            theHeader,
            routerView
        )
    }
}