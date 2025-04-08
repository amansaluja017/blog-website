import Comments from '@/components/Comments';
import { useLocation } from 'react-router-dom';

function Content() {
    const { state } = useLocation();
    const { blog } = state || {}

    return (
        <div className="h-screen bg-gray-100 flex items-start">
            <div className="w-3/4 bg-white shadow-md rounded-lg p-6">
                <h1 className="text-3xl font-extrabold text-center text-gray-800">
                    {blog?.title || 'Blog Title'}
                </h1>
                <hr className="my-4 border-gray-300" />
                <p className="text-gray-700 text-lg leading-relaxed">
                    {blog?.content || 'No content available.'}
                </p>
            </div>
            <div className='h-full bg-base-100 items-end w-1/4'>
                <Comments blogId={blog?._id} />
            </div>
        </div>
    );
}

export default Content;