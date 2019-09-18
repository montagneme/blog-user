import axios from 'axios'

export const AddTalk=({ id,name,talk,head,href,tid,toName,toHref })=>{
    return axios.post('/users/addTalk',{ id:id,name:name,talk:talk,head:head,href:href,tid:tid,toName:toName,toHref:toHref });
}

export const GetTalk=(id)=>{
    return axios.post('/users/getTalk',{id:id});
}