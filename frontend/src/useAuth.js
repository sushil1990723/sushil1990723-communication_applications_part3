import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('logdinuser'));
    if (!loggedInUser) {
      navigate('/'); 
    }
  }, [navigate]);
};

export default useAuth;