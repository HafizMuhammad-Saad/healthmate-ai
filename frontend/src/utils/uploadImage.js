import axiosInstance from "./axiosInstance";
import { BASE_URL } from "./constants";

const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
        const response = await axiosInstance.post(`${BASE_URL}/auth/upload-image`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        // Handle response format
        if (response.data.imageUrl) {
            return { imageUrl: response.data.imageUrl };
        } else if (response.data.success && response.data.imageUrl) {
            return { imageUrl: response.data.imageUrl };
        } else {
            throw new Error('Invalid response format from server');
        }
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error; // Re-throw the error for handling in the calling code
    }
};

export default uploadImage;