import React from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import SignupForm from '../../components/SignupForm/SignupForm';

const Signup: React.FC = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phoneNo, setPhoneNo] = React.useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // const res = await fakeSignup({ name, email });
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}api/v1/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: name, // matches DTO
            email: email,
            password: password,
            phoneNo: phoneNo,
          }),
        },
      );
      const data = await res.json();
      if (res.ok && data.token) {
        login(name, email, data.token);
        toast.success('Signup successful!');
        navigate('/', { replace: true});
      } else {
        toast.error(`${data.message || 'Signup failed. Try again.'}`);
      }
    } catch (err) {
      console.error('Error during signup:', err);
      toast.error('Something went wrong. Please try again.');
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <SignupForm
        name={name}
        email={email}
        password={password}
        phoneNo={phoneNo}
        onNameChange={setName}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onPhoneNoChange={setPhoneNo}
        onSubmit={handleSignup}
      />
    </div>
  );
};

export default Signup;
