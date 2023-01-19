<template>
  <div class="home">
    <form action="">
      <input type="text" v-model="searchterm" placeholder="Votre recherche..." @change="searchMusic()">
    </form>
    <a :href="authurl" @click.prevent="getAccessToken">Connexion à Spotify</a>
    <ul class="results">
    </ul>
    <div class="music">
      <h2>La playlist</h2>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import {mapActions, mapGetters} from "vuex";


export default {
  name: 'HomeView',
  data() {
    return {
      authurl: "https://accounts.spotify.com/authorize?client_id=" + process.env.VUE_APP_CLIENT_ID  +"&response_type=code&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI,
      loginButtonClicked:false,
      client_id: process.env.VUE_APP_CLIENT_ID,
      client_secret: process.env.VUE_APP_CLIENT_SECRET,
      redirect_uri: process.env.VUE_APP_REDIRECT_URI,
      access_token:null,
      searchterm:'',
      tracks:[]
    }
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'getAccessTokenState',
    ])
  },
  methods:{
    ...mapActions([
      'updateAccessToken',
    ]),

    searchMusic(){
      axios.post('http://localhost:3000/api/spotify/gettrack', {access_token:this.getAccessTokenState}).then(response => {
        this.tracks = response.tracks
      })
    },

    saveTrack(){
      axios.post('http://localhost:3000/api/spotify/savetrack',{name:tracks.name}).then(response => {
        this.tracks = response.tracks
      })
    },

    getAccessToken(){

      let uri = window.location.search.substring(1);
      let urlparams = new URLSearchParams(uri);
      const code = urlparams.get("code");

      const auth = 'Basic ' + btoa(this.client_id + ':' + this.client_secret);

      if(code !== null){

        const params = {'code': code, 'redirect_uri': this.redirect_uri, 'grant_type': 'authorization_code', 'client_id':this.client_id,'client_secret':this.client_secret}
        const headers = { 'Content-Type': 'application/x-www-form-urlencoded',Authorization: auth}

        axios.post("https://accounts.spotify.com/api/token",null,{params:params, headers:headers})
            .then(function (response) {
              const access_token = response.data.access_token
              this.updateAccessToken(access_token)

              const refresh_token = response.data.refresh_token;

              localStorage.setItem('refresh_token', refresh_token);
              return access_token;
            })
            .catch(function (error) {
            });
      } else {

      }
    },
  }
}
</script>

<style scoped>

  .home{
    display: grid;
    justify-content: center;
    margin-top: 50px;
  }

  .music{
    display: grid;
    grid-auto-columns: 800px;
    grid-auto-rows: 60px;
    justify-content: center;
    gap: 20px;
    margin-top: 50px;
  }

  .music h2{
    color:#7982d4;
    font-size: 30px;
  }

  .results{
    display: grid;
    grid-auto-columns: 800px;
    justify-content: center;
    grid-auto-rows: fit-content(0%);
    width:801px;
    margin:0;
    padding:0;
    color:#000;
    background-color: #202660;
    row-gap: 3px;
  }

  .results .result{
    list-style: none;
    background-color: #252c6b;
    height:50px;
    width:100%;
    display: grid;
    color:#FFF;
    place-content: center;
  }

  .music article{
    width:100%;
    display: grid;
    background-color: #202661;
    height:100%;
  }
  form{
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: fit-content(0%);
  }
  input{
    width:800px;
    height:50px;
    background-color: #1e2151;
    border:none;
    outline:none;
    color: #8594ff;
    font-size:20px;
    text-align:center;
    place-self: flex-end center;
    font-weight: 300;
    position: relative;
    font-family: 'Roboto', sans-serif;
  }

  input::placeholder{
    color: #4e55a1;
  }
</style>
