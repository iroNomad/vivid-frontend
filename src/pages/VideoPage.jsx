

export default function VideoPage({video}) {

    {/* 영상파일 URL 가져오도록 Fetch 해야함! */}

    return (
        <div>
            <video
                width="100%"
                height="auto"
                controls
                poster={video.thumbnailFileURL}
                style={{ borderRadius: '8px' }}
            >
                <source src={video.videoFileURL} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    )
}