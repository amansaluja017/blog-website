import { UpdateBlogForm } from '@/components/UpdateBlogForm'
import { useLocation } from 'react-router-dom';

function UpdateBlog() {
    const {state} = useLocation();
    const {blog} = state || {};
   
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-base-200">
        <div className="w-full max-w-sm">
            <UpdateBlogForm blog={blog} />
        </div>
    </div>
  )
}

export default UpdateBlog