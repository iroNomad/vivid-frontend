// Function to format dates
export const formatUploadDate = (uploadDateData) => {
    const now = new Date();
    const uploadDate = new Date(uploadDateData);

    // Set the time to midnight for both dates to ignore time differences
    now.setHours(0, 0, 0, 0);
    uploadDate.setHours(0, 0, 0, 0);

    const diffInDays = Math.floor((now - uploadDate) / (1000 * 60 * 60 * 24));

    // Just now (today)
    if (diffInDays === 0) {
        return "오늘";
    }

    // Days ago
    if (diffInDays < 7) {
        return diffInDays === 1 ? "어제" : `${diffInDays}일 전`;
    }

    // Weeks ago
    if (diffInDays < 30) {
        const diffInWeeks = Math.floor(diffInDays / 7);
        return diffInWeeks === 1 ? "1주 전" : `${diffInWeeks}주 전`;
    }

    // Months ago
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return diffInMonths === 1 ? "1개월 전" : `${diffInMonths}개월 전`;
    }

    // Years ago
    const diffInYears = Math.floor(diffInDays / 365);
    return diffInYears === 1 ? "1년 전" : `${diffInYears}년 전`;
};