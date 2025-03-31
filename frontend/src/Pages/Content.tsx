import { useLocation } from 'react-router-dom';

function Content() {
    const { state } = useLocation();
    const { blog } = state || {};

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            <div className="w-full max-w-3xl bg-white shadow-md rounded-lg mt-10 p-6">
                <h1 className="text-3xl font-extrabold text-center text-gray-800">
                    {blog?.title || 'Blog Title'}
                </h1>
                <hr className="my-4 border-gray-300" />
                <p className="text-gray-700 text-lg leading-relaxed">
                    {blog?.content || 'No content available.'}
                </p>
            </div>
        </div>
    );
}

export default Content;