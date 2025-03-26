import PostCard from '@/components/PostCard'
import { useLocation } from 'react-router-dom'
import HTMLParser  from 'node-html-parser'

function PostBlog() {
  const {state} = useLocation();
  const {content} = state || {};
  const postContent: string = HTMLParser.parse(content).childNodes[0].childNodes[0].rawText;
  
  return (
    <div className='h-screen bg-base-200 flex justify-center items-center'>
        <div>
            <PostCard postContent={postContent} />
        </div>
    </div>
  )
}

export default PostBlog;