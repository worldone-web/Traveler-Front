import {Component} from "../core/heropy.js";
import Headline from '../components/Headline.js'
import Search from '../components/Search.js'
import StoreList from '../components/StoreList.js'
import StoreListMore from '../components/StoreListMore.js'


//추천 컴포넌트
// import Recommend from "../components/Recommend.js"; -> Headline 컴포넌트와 통합
import RecommendList from '../components/RecommendList.js'


export default class Home extends Component{
    render(){
        const headline = new Headline().el;
        const search = new Search().el;
        const storeList = new StoreList().el;   
        const storeListMore = new StoreListMore().el;        

        //추천 요소들
        //const recommend = new Recommend().el;
        const recommendList = new RecommendList().el;

        this.el.classList.add('container')
        this.el.append(
            headline,
            search,
            recommendList,
            storeList,
            storeListMore
            
        )
           
        
    }
}