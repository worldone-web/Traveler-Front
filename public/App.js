
import {Component} from './core/heropy.js' // Default import
import TheHeader from './components/TheHeader.js';
//import {Component} from './core/heropy.js' // Named import
// 모든 컴포넌트의 집합체 (페이지의 청사진 역할)


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