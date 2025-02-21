import './App.css'
import PrimarySearchAppBar from './components/Appbar.jsx'
import Card from './components/Card.jsx'
import { Routes, Route } from 'react-router-dom';
import MyPage from './pages/MyPage.jsx'

function App() {
  return (
    <>
        <PrimarySearchAppBar />
        <Routes>
            <Route path="/" element={<Card />} />
            <Route path="/mypage" element={<MyPage />} />
        </Routes>
    </>
  )
}
export default App
