import { Notebook, View } from "lucide-react";

function StatsHeader({
  totalLikes,
  blogs,
  totalViews,
}: {
  totalLikes: number;
  blogs: any;
  totalViews: number;
}) {
  return (
    <div className="flex items-center justify-between text-pink-800 w-full">
      <div className="stats shadow flex items-center w-full">
        <div className="stat flex flex-col items-center justify-center">
          <div className="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="red"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current text-red-500">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <div className="stat-title">Total Likes</div>
          <div className="stat-value">{totalLikes}</div>
        </div>

        <div className="stat flex flex-col items-center justify-center">
          <div className="stat-figure text-secondary">
            <View />
          </div>
          <div className="stat-title">Total Views</div>
          <div className="stat-value text-secondary">{totalViews}</div>
        </div>

        <div className="stat flex flex-col items-center justify-center">
          <div className="stat-figure text-secondary">
            <Notebook />
          </div>
          <div className="stat-title">Total Blogs</div>
          <div className="stat-value">{blogs?.length}</div>
        </div>
      </div>
    </div>
  );
}

export default StatsHeader;
