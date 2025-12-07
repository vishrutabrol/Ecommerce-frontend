import React from 'react';

interface SignupFormProps {
  name: string;
  email: string;
  password: string;
  phoneNo: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onPhoneNoChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  name,
  email,
  password,
  phoneNo,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onPhoneNoChange,
  onSubmit,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white text-gray-500 max-w-[340px] w-full mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10"
    >
      <h2 className="text-2xl font-bold mb-9 text-center text-gray-800">
        Sign Up
      </h2>

      {/* Username */}
      <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
        <input
          className="w-full outline-none bg-transparent py-2.5"
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
        />
      </div>

      {/* Email */}
      <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
        <input
          className="w-full outline-none bg-transparent py-2.5"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </div>

      {/* Password */}
      <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
        <input
          className="w-full outline-none bg-transparent py-2.5"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
        />
      </div>

      {/* PhoneNo */}
      <div className="flex items-center mt-2 mb-8 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
        <input
          className="w-full outline-none bg-transparent py-2.5"
          type="phoneNo"
          placeholder="phone number"
          value={phoneNo}
          onChange={(e) => onPhoneNoChange(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600 transition-all active:scale-95 py-2.5 rounded text-white font-medium"
      >
        Create Account
      </button>

      <p className="text-center mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-blue-500 underline">
          Log In
        </a>
      </p>
    </form>
  );
};

export default SignupForm;
