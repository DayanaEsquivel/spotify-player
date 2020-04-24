import axios from 'axios'
import { TrackHandler, Client } from 'spotify-sdk'

let client= Client.instance;
client.settings={
    clientId: 'c3045edb45d6479c8ef64c6fd0605b48',
    secretId: '6fe2acd18e314ab29913e4e5ef7b1d49',
    scopes: ['user-follow-modify user-follow-read user-library-read user-top-read'],
    redirect_uri: 'http://localhost:3000/'
}

export const checkSignIn = () => {
    return (dispatch, getState) => {
        if(sessionStorage.token){
            client.token= sessionStorage.token;
        }else if(window.location.hash.split('&')[0].split('=')[1]){
            sessionStorage.token= window.location.hash.split('&')[0].split('=')[1];
            client.token= sessionStorage.token;

        }else {
            client.login()
            .then( url =>{
                window.location.href= url;
            });
        }
    }
}
const startFetch = () => {return { type: "IS_FETCHING", isFeching: true }};
const errorFetch= (err) => {return { type: "ERROR_FETCHING", isFeching: false, err}};
const completeFetch = (data) => {return { type: "COMPLETE_FETCH", isFeching: false, payload: data }}

export const search = (trackName) => {
    return ( dispatch, getState) =>{
        dispatch(startFetch());
        let track = new TrackHandler();
        track.search(trackName, { limit: 5})
        .then( trackCollection => {
            //console.log(trackCollection);
            dispatch(completeFetch(trackCollection));
        })
        .catch(err => {
            //console.log("entro al error")
            dispatch(errorFetch(err));
        });
    }
}

const completeSong = (data) =>{ return {type:"COMPLETE_SONG", success: true, payload: data }};
export const playTrack = (songId) => {
    return ( dispatch, getState) => {
        dispatch(startFetch());
        axios.get('https://api.spotify.com/v1/tracks/'.concat( songId ),{ headers: {"Authorization" : 'Bearer ' + client.token }} )
        .then( response => {
            //console.log(response.data);
            dispatch(completeSong(response.data));
            
        })
        .catch( err =>{
            console.log(err);
        });
    }
}

