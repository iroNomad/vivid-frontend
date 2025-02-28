import { useEffect, useState } from 'react';
import './App.css';
import PrimarySearchAppBar from './components/PrimarySearchAppBar.jsx';
import { Routes, Route } from 'react-router-dom';
import MyPage from './pages/MyPage.jsx';
import TitlebarImageList from "./components/ImageList.jsx";
import VideoPage from "./pages/VideoPage.jsx";

export default function App() {
    const [videos, setVideos] = useState([]);
    const [loginState, setLoginState] = useState(!!localStorage.getItem("token")); // Initialize based on stored token

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch('http://localhost:8080/allVideos');
                if (!response.ok) {
                    throw new Error('Failed to fetch videos');
                }
                const data = await response.json();
                setVideos(data);
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };
        fetchVideos();
    }, []);

    return (
        <>
            <PrimarySearchAppBar loginState={loginState} />
            <Routes>
                <Route path="/" element={<TitlebarImageList videos={videos} />} /> {/* Pass videos as prop */}
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/video/:videoId" element={<VideoPage />} />
            </Routes>
        </>
    );
}
