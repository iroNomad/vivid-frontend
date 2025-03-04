import { useEffect, useState } from 'react';
import './App.css';
import PrimarySearchAppBar from './components/PrimarySearchAppBar.jsx';
import { Routes, Route } from 'react-router-dom';
import MyPage from './pages/MyPage.jsx';
import TitlebarImageList from "./components/ImageList.jsx";
import VideoPage from "./pages/VideoPage.jsx";

export default function App() {
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [loginState] = useState(!!localStorage.getItem("token")); // Initialize based on stored token

    const handleSearch = (query) => {
        console.log('Search query:', query); // Log the search query
        if (!query) {
            setFilteredVideos(videos); // Reset to original videos if query is empty
            return;
        }
        const queryWords = query.toLowerCase().split(' ').filter(word => word); // Convert query to lowercase and split into words
        const filtered = videos.filter(video =>
            queryWords.some(word =>
                (video.title && video.title.toLowerCase().includes(word)) ||
                (video.description && video.description.toLowerCase().includes(word)) ||
                (video.username && video.username.toLowerCase().includes(word))
            )
        );
        console.log('Filtered videos:', filtered); // Log the filtered videos
        setFilteredVideos(filtered);
    };

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch('http://localhost:8080/allVideos');
                if (!response.ok) {
                    throw new Error('Failed to fetch videos');
                }
                const data = await response.json();
                setVideos(data);
                setFilteredVideos(data); // Initialize filteredVideos with all videos
                console.log('Fetched videos:', data); // Log the fetched videos
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };
        fetchVideos();
    }, []);

    return (
        <>
            <PrimarySearchAppBar loginState={loginState} onSearch={handleSearch} />
            <Routes>
                <Route path="/" element={<TitlebarImageList videos={filteredVideos} />} /> {/* Pass filteredVideos as prop */}
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/video/:videoId" element={<VideoPage />} />
            </Routes>
        </>
    );
}