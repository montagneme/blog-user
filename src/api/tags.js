import axios from 'axios'

export const GetTags=()=>{
    return axios.get('/knowledge/knowledge.json');
}

export const GetShare=()=>{
    return axios.get('/knowledge/share.json');
}