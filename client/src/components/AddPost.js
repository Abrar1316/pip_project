import React,{useState} from 'react'
import uniqid from 'uniqid'
import axios from 'axios'

const AddPost = () => {
    const [title,setTitle] = useState('')
    const [imageUrl,setImageUrl] = useState('')
    const [description,setDescription] = useState('')

    const addpost = ()=>{
        let post = {
            title: title,
            imageUrl: imageUrl,
            description: description,
            uniqid : uniqid()
        }

        console.log(post);
        axios.post('/api/post/addNewPost',post)
        .then(res=>{alert(res.data)})
        .then(err=>{alert(err)})
    }
  return (
    <div className='row justify-content-center'>
        <div className='col-6'>
        
            <input type="text" placeholder="title"  className='form-control'
            value={title} onChange={(e)=>{setTitle(e.target.value)}}
            />
            <input type="text" placeholder="url"  className='form-control'
            value={imageUrl} onChange={(e)=>{setImageUrl(e.target.value)}}
            />
            <textarea  placeholder='write somthing here' cols = "30" row="10" className='form-control' 
            value={description} onChange={(e)=>{setDescription(e.target.value)}}
            />
            <button className='btn btn-info float-start' style={{marginLeft:"20px"}}
            onClick={addpost}
            >Add Post</button>
        </div>     
    </div>
  )
}

export default AddPost