import axios from 'axios'

export const GetWords=()=>{
    return axios.get('/users/getWords');
}

export const AddWords=({txt,flag})=>{
    return axios.post('/users/addWords',{txt:txt,flag:flag});
}