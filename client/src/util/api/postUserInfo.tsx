import axios from 'axios';

const postUserInfo = async (email: string, password: string) => {
  try {
    const response = await axios.post('/users/userInfo/{member-id}', { email, password });
    return response.data;
  } catch (error) {
    throw new Error('Failed to login. Please try again.'); // You can customize the error message as per your requirements
  }
};

export default postUserInfo;
