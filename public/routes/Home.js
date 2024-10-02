import {Component} from "../core/heropy.js";
import Headline from '../components/Headline.js'
import Search from '../components/Search.js'
import StoreList from '../components/StoreList.js'
import StoreListMore from '../components/StoreListMore.js'


//추천 컴포넌트
//import Recommend from "../components/Recommend.js"; -> Headline 컴포넌트와 통합
import RecommendList from '../components/RecommendList.js'


export default class Home extends Component{


    render(){
        //추천 요소들
        //const recommend = new Recommend().el;
        const recommendList = new RecommendList().el;
        const storeList = new StoreList().el;   

        const headline = new Headline(recommendList).el;
        const search = new Search(storeList).el;
        
        const storeListMore = new StoreListMore().el;        

        this.el.classList.add('container')
        this.el.append(
            headline,
            search,
            recommendList, // RecommendList 컴포넌트 추가
            storeList,
            storeListMore
            
        )
           
        
    }
}