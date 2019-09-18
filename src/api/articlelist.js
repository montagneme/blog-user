import axios from 'axios'


export const GetArticle=(k,f,t)=>{
    return axios.post('/users/article',{keyword:k,fromNum:f,toNum:t});
}

export const GetArticleNum=(k)=>{
    return axios.post('/users/articleNum',{keyword:k});
}

export const AddReadNum=(i)=>{
    return axios.post('/users/addReadNum',{id:i});
}

export const AddLoveNum=(i)=>{
    return axios.post('/users/addLoveNum',{id:i});
}

export const GetNotice=(f,t)=>{
    return axios.post('/users/notice',{fromNum:f,toNum:t});
}

export const GetFri=()=>{
    return axios.get('/knowledge/fri.json');
}

export const GetThisArticle=(id)=>{
    return axios.post('/users/thisArticle',{id:id});
}