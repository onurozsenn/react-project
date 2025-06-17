import Header from "../../components/Header";
import PostForm from "../../components/PostForm";
import PostCard from "../../components/PostCard";
import { Post } from "../../types";

const Dashboard = () => {
  const posts: Post[] = [
    { name: "Allyn Rate", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { name: "Man Barten", text: "Sed do eiusmod tempor incididunt ut labore et illucusa." },
    { name: "Janine Sustama", text: "Lorem ipsum dolor sit amet" }
  ];

  return (
    <div className="bg-blue-100 min-h-screen">
      <Header />
      <div className="max-w-xl mx-auto p-4">
        <PostForm />
        {posts.map((post, i) => (
          <PostCard key={i} {...post} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;