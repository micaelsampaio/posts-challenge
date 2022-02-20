import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components';
import { UseAppContext } from '../../hooks/use-app-context';
import { isValidHttpUrl } from '../../scripts/utils';
import { GLOBAL_EVENTS } from '../../types/constants';
import { LoadingBlock } from '../layout/loading/LoadingBlock';
import { ResizableTextarea } from '../ui/Inputs';

export function CreatePost() {
  const { services, appendPost, user } = UseAppContext();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [working, setWorking] = useState<boolean>(false);
  const [errors, setErrors] = useState({ hasErrors: true, fields: {} });
  const [selectedType, setSelectedType] = useState<string>("post");

  const clearInputs = () => {
    setTitle("");
    setContent("");
  }

  const createPost = async () => {

    if (errors.hasErrors) return;

    try {
      setWorking(true);
      const post = await services.postsService.createPost({ username: user.login.username, postType: selectedType, title, content });

      appendPost(post);
      clearInputs();
      setWorking(false);
    } catch (error) {
      services.notifications.error("Error Posting!", "Error");
      setWorking(false);
    }
  }

  useEffect(() => {
    if (title.length > 0 && content.length > 0) {
      setErrors({ hasErrors: false, fields: {} });
    } else {
      setErrors({ hasErrors: true, fields: {} })
    }
  }, [title, content])

  useEffect(() => {
    setContent("");
  }, [selectedType]);

  const createPostProps = { value: content, setValue: setContent };

  return (
    <LoadingBlock loading={working} >
      <CreatePostContainer>
        <div className="card">
          <div className="card-header">
            <div className="row">
              <PostType className="col" onSelect={setSelectedType} selected={selectedType === "post"} type="post" text="Post" image={"/images/posts/form.svg"} />
              <PostType className="col" onSelect={setSelectedType} selected={selectedType === "image"} type="image" text="Image" image={"/images/posts/picture.svg"} />
              <PostType className="col" onSelect={setSelectedType} selected={selectedType === "url"} type="url" text="Url" image={"/images/posts/link.svg"} />
            </div>
          </div>

          <div className="card-body">
            <ResizableTextarea minRows={1} maxRows={5} placeholder='Title' className='title-input form-control' onChange={(e: any) => setTitle(e.target.value)} value={title} />
            <hr />

            <CreatePostText {...createPostProps} selected={selectedType === "post"} />
            <CreateImagePost {...createPostProps} selected={selectedType === "image"} />
            <CreateUrlPost {...createPostProps} selected={selectedType === "url"} />

          </div>

          <div className="card-footer">
            <div className="buttons">
              <button disabled={errors.hasErrors} className="btn btn-post btn-primary" onClick={createPost}>
                Post
              </button>
            </div>
          </div>
        </div>
      </CreatePostContainer >
    </LoadingBlock>
  )
}

const CreatePostText = ({ selected, value, setValue }: any) => {
  if (!selected) return null;
  return <ResizableTextarea minRows={5} maxRows={20} placeholder='Write something' className='content-input form-control' onChange={(e: any) => setValue(e.target.value)} value={value} />
}

const CreateImagePost = ({ selected, setValue }: any) => {
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState(true);
  const imagePreview = useRef<any>();

  const { services } = UseAppContext();

  useEffect(() => {
    if (!imageUrl) setValue("")
    if (imageUrl && isValidHttpUrl(imageUrl)) {
      imagePreview.current.onload = () => { setValue(imageUrl); setError(false); }
      imagePreview.current.onerror = () => { setValue(""); setError(true); }
    } else {
      setValue("");
      setError(imageUrl ? true : false);
    }
  }, [imageUrl, imagePreview]);

  useEffect(() => {
    const clearValues = () => {
      setImageUrl("");
      setError(false);
    }
    services.eventBus.subscribe(GLOBAL_EVENTS.NEW_POST, clearValues);
    return () => { services.eventBus.unsubscribe(GLOBAL_EVENTS.NEW_POST, clearValues); }
  }, []);

  if (!selected) return null;
  const isValidUrl = isValidHttpUrl(imageUrl);
  return <div>
    <input placeholder='place image [URL]' className='content-input form-control' onChange={(e: any) => setImageUrl(e.target.value)} value={imageUrl} />

    <img ref={imagePreview} src={isValidUrl ? imageUrl : undefined} className={`w-100 ${imageUrl && isValidUrl ? "d-block mt-2" : "d-none"}`} />

    {error && <div className="pt-4"> <div className="alert alert-danger" role="alert">
      Invalid image
    </div></div>}
  </div>
}
const CreateUrlPost = ({ value, selected, setValue }: any) => {

  if (!selected) return null;

  return <input placeholder='place [URL]' className='content-input form-control' onChange={(e: any) => setValue(e.target.value)} value={value} />
}


const PostType = ({ className, image, text, type, selected, onSelect }: any) => {

  const selectedClass = selected ? ' selected' : '';
  return <PostTypeContainer className={`${className || ""}${selectedClass}`} onClick={() => onSelect(type)}>
    <PostTypeIcon className={`post-type-icon${selectedClass}`} image={image}></PostTypeIcon>
    <div className="post-type-text">{text}</div>
  </PostTypeContainer>
}

const PostTypeContainer = styled.div<any>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 20px 10px;
    color: #3E3F5E;
    opacity: 0.3;

    &::before{
      transition: all 0.25s;
      content: '';
      position: absolute;
      bottom: 0px;
      left: 0px;
      width: 0px;
      height: 0px;
      background:rgba(35, 210, 226, 1)
    }

    &.selected::before{
      height: 5px;
      width: 100%;
    }

    &.selected{
      opacity: 1;
    }

    &:hover{
      transition: background-color 0.25s;
      background-color: #CCC;
      cursor: pointer;
    }
`

type PostTypeIconProps = {
  image: string
}

const PostTypeIcon = styled.div<PostTypeIconProps>`
  width: 16px;
  height: 16px;
  background: #3E3F5E;
  -webkit-mask-image:  url('${props => props.image}');
  mask-image: url('${props => props.image}');
  mask-size: contain;
  margin-right: 10px;
`


const CreatePostContainer = styled.div`

  .card {
    box-shadow: 0px 2px 10px 4px rgba(0, 0, 0, 0.05) !important; 
    border-radius: 12px !important;
    overflow: hidden;
  }

  .card-header {
    padding: 0px;
  }

  .title-input {
    width: 100%;
  }
  
  .content-input {
    width: 100%;
  }

  .title-input .content-input{
    border: none;
  }

  .buttons {
    text-align: right;
  }
  
  .btn-post {
    min-width: 100px;
  }

`
