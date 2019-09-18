import Vue from 'vue'
import Vuex from 'vuex'

import tag from './modules/tag'
import bolg from './modules/bolg'

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        isloading:false,
        flag:false
    },
    mutations:{
        getFlag(state,val){
            state.flag=val;
        }
    },
    actions:{

    },
    modules:{
        tag,
        bolg
    }
});