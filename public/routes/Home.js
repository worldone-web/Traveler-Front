import {Component} from "../core/heropy.js";
import Headline from '../components/Headline.js'
import Search from '../components/Search.js'
import StoreList from '../components/StoreList.js'
import StoreListMore from '../components/StoreListMore.js'
import RecommendList from '../components/RecommendList.js'


export default class Home extends Component{


    render(){
        
        const recommendList = new RecommendList().el;
        const storeList = new StoreList().el;   

        const headline = new Headline(recommendList).el;
        const search = new Search(storeList).el;
        
        const storeListMore = new StoreListMore().el;        

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