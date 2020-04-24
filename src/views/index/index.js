import React, {Component} from 'react'

import { connect} from 'react-redux'
import { bindActionCreators } from 'redux'

import SongItem from './SongItem'
import Spinner from 'react-spinkit'
import { checkSignIn, search} from '../../actions'

import 'materialize-css/dist/css/materialize.min.css'
import './index.css'


class Index extends Component{
    constructor(){
        super();
        this.state={
            song: ''
        }
        this.getResultsCard= this.getResultsCard.bind(this);
    }
    componentWillMount(){
        this.props.checkSignIn();
    }
    getTokenPath(){
        let path= window.location.href;
        return path.substring(path.indexOf("#"), path.length);
    }
    getResultsCard(){
        const { songs} = this.props;

        if(songs.length>0){
            return (
                <div className="card Index-results-card"> 
                    <div className="card-content">
                        {
                            songs.map((currentValue, index) => {
                                //console.log(currentValue);
                                return(
                                    <SongItem
                                    key={index}
                                    songId={currentValue._id}
                                    tokenPath={this.getTokenPath()}
                                    albumPhoto={currentValue.album.images[0].url}
                                    albumName={currentValue._album.name}
                                    songName={currentValue._name}
                                    artistName={currentValue._artists[0].name}
                                    />
                                );
                            })
                        }
                    </div>
                </div>
            );
        }
        
    }
    render(){
        //console.log(this.props)
        const { song } = this.state;
        const {songs} = this.props;
        if(songs.type=== "IS_FETCHING"){
            return <Spinner name="double-bounce"/>
        }
        
        return(
            <div className="Index">
                <div className="card">
                    <div className="card-content">
                        <div className="Index-searchBox">
                            <input type="text" className="Index-searchBox-input" placeholder="Cancion"
                             onChange={(e) => {this.setState({ song: e.target.value })}}
                             value= { song }></input>
                            <a className="waves-effect waves-light btn green"
                            onClick={(e) => this.props.search(song)}>
                                <i className="fa fa-search"></i>
                            </a>
                        </div>
                    </div>
                </div>
                { this.getResultsCard() }
            </div>
        );
    }
}

function mapStateToProps(state){
    //console.log(state);
    
    return{
        routes: state.routes,
        songs: state.player
    };
}
 function mapDispatchToProps(dispatch){
     return bindActionCreators({
         checkSignIn,
         search
     }, dispatch);
 }
export default connect(mapStateToProps, mapDispatchToProps) (Index);