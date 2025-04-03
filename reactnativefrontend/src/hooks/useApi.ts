import axios from 'axios';

const BASE_URL = 'http://10.81.216.194:3000/api';

const useApi = () => {
  const post = async (endpoint: string, body: any) => {
    try {
      const response = await axios.post(`${BASE_URL}${endpoint}`, body, {
        headers: {'Content-Type': 'application/json'},
      });
      return {data: response.data, ok: true};
    } catch (error: any) {
      return {
        data: error.response?.data || {error: 'Something went wrong'},
        ok: false,
      };
    }
  };

  return {post};
};

export default useApi;
