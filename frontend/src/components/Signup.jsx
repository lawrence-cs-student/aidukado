import { useState, useEffect } from 'react';
import axios from 'axios';
import validator from 'validator';
import { NavLink } from "react-router-dom";

function App() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  /**
   * Validate form fields.
   * Returns true if the form is valid, otherwise false and populates the errors state.
   */
  const validate = () => {
    const newErrors = {};

    if (!form.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!form.first_name.trim()) newErrors.first_name = 'First name is required';

    if (!form.email.trim()) {
       newErrors.email = 'Email is required';
    } else if (!validator.isEmail(form.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!form.password.trim() || form.password.length < 8) newErrors.password = 'Password must be atleast 8 characters long';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  /**
   * Handle form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Front‑end validation
    if (!validate()) return;

    try {
      await axios.post('http://localhost:8000/signup', form);
      setForm({ first_name: '', last_name: '', email: '', password: '' });
      setErrors({});
      fetchItems();
      console.log(form)
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data.detail === 'Email already exists') {
      setErrors({ email: 'This email already exist, you may want to Login' });
    } else if(err.response && err.response.status === 400 && err.response.data.detail === 'Email domain does not exist.') {
      setErrors({ email: 'Enter a valid email address' });
    } else{
      console.error('Error submitting form:', err);
    }
    }
  };


  const hasError = (field) => Boolean(errors[field]);

  return (
    <div className="bg-[#333446] flex h-full w-full flex flex-col side-background-signup">
        <div className="absolute left-[70%] top-[40%]">
            <h1 className="text-white opacity-[0.7] text-4xl">
                <span className="block">Already Have an Account?</span>
            </h1>
            <NavLink to={"/login"}>
                <button className="w-[100%] h-[10%] mt-[6%] p-1 bg-[#333446] text-white">Login</button>
            </NavLink>
        </div>
        <div className='flex h-full w-[60%] bg-white justify-center items-center flex-col'>
            <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-white p-8 rounded-xl shadow-md w-full max-w-md outline"
                style={{ outlineColor: '#7F8CAA' }}
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Signup</h2>

                {/* Last Name */}
                <div className="mb-4">
                <label className="block text-gray-500 font-medium mb-2">Last Name</label>
                <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    placeholder="Last Name"
                    className={
                    `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  placeholder-gray-400` +
                    (hasError('last_name')
                        ? 'border-red-500 focus:ring-red-400'
                        : 'focus:ring-blue-400')
                    }
                />
                {hasError('last_name') && (
                    <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                )}
                </div>

                {/* First Name */}
                <div className="mb-4">
                <label className="block text-gray-500 font-medium mb-2">First Name</label>
                <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    placeholder="First Name"
                    className={
                    `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  placeholder-gray-400` +
                    (hasError('first_name')
                        ? 'border-red-500 focus:ring-red-400'
                        : 'focus:ring-blue-400')
                    }
                />
                {hasError('first_name') && (
                    <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                )}
                </div>

                {/* Email */}
                <div className="mb-4">
                <label className="block text-gray-500 font-medium mb-2">Email</label>
                <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email"
                    className={
                    `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ` +
                    (hasError('email')
                        ? 'border-red-500 focus:ring-red-400'
                        : 'focus:ring-blue-400')
                    }
                />
                {hasError('email') && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
                </div>

                {/* Password */}
                <div className="mb-4">
                <label className="block text-gray-500 font-medium mb-2">Password</label>
                <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Password"
                    className={
                    `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 ` +
                    (hasError('password')
                        ? 'border-red-500 focus:ring-red-400'
                        : 'focus:ring-blue-400')
                    }
                />
                <label className="block text-gray-300 font-smallmb-2">Password must be 8-14 characters long</label>
                {hasError('password') && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
                </div>

                {/* Submit */}
                <button
                type="submit"
                disabled={!form.first_name || !form.last_name || !form.email || !form.password}
                className="w-full text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 disabled:opacity-50"
                style={{ backgroundColor: '#333446' }}
                >
                Signup
                </button>
            </form>
        </div>
    </div>
  );
}

export default App;