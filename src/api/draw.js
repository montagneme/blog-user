import axios from 'axios'

export const UploadCanvas=(data)=>{
    return axios.post('/users/uploadCanvas',{txt:data})
}
