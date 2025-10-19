import React, {useState, useEffect} from 'react'
// eslint-disable-next-line no-unused-vars
import {motion} from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Loader,
    AlertCircle,
    CheckCircle
} from 'lucide-react'
import { validateEmail, validatePassword } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [formState, setFormState] = useState({
        loading: false,
        errors: {},
        success: false,
        showPassword: false
    });



    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    };

    if (formState.errors[name]) {
        setFormState(prev => ({
            ...prev,
            errors: {
                ...prev.errors,
                [name]: ''
            }
        }));
    }

    const validateForm = () => {
        const errors = {
            email: validateEmail(formData.email),
            password: validatePassword(formData.password)
        };

        Object.keys(errors).forEach(key => {
            if (!errors[key]) delete errors[key]
        });

        setFormState(prev => ({...prev, errors}));
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!validateForm()) return;

        setFormState(prev => ({...prev, loading: true}))

        try {
            // Login API integration
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
              email: formData.email,
              password: formData.password,
              rememberMe: formData.rememberMe
            });

            setFormState(prev => ({
                ...prev,
                loading: false,
                success: true,
                errors: {}
            }));

            const {token} = response.data;

            if (token) {
              login(response.data, token);
              // redirect to dashboard
              setTimeout(() => {
                navigate("/dashboard");
              }, 1500);
            }


        } catch (error) {
            console.error("Login error:", error); // helpful for debugging

            setFormState(prev => ({
                ...prev,
                loading: false,
                errors: {
                    submit: error.response?.data?.message || 'Login failed. Please check your Connection'
                }
            }))
        }
    };

    if (formState.success) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="text-center p-8 max-w-md w-full"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring" }}
      className="flex justify-center mb-6"
    >
      <CheckCircle className="w-16 h-16 text-green-500" />
    </motion.div>
    
    <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
    <p className="text-gray-600 mb-8">You have been successfully logged in</p>
    
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" />
      <p className="text-gray-500 text-sm">Redirecting to your Dashboard...</p>
    </div>
    
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ delay: 0.5, duration: 2 }}
      className="mt-8 h-1 bg-blue-100 rounded-full overflow-hidden"
    >
      <div className="h-full bg-blue-500 animate-pulse"></div>
    </motion.div>
  </motion.div>
</div>
        )
    }

    
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50">
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="flex flex-col items-center justify-center min-h-screen p-4"
  >
    {/* Card Container */}
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center">
        <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
        <p className="text-blue-100 mt-1">Sign in to access your HealthMate AI account</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Your Email"
              className={`w-full pl-10 pr-3 py-3 rounded-lg border ${formState.errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>
          {formState.errors.email && (
            <p className="flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {formState.errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={formState.showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter Your Password"
              className={`w-full pl-10 pr-10 py-3 rounded-lg border ${formState.errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            <button
              type="button"
              onClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label={formState.showPassword ? 'Hide password' : 'Show password'}
            >
              {formState.showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              )}
            </button>
          </div>
          {formState.errors.password && (
            <p className="flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {formState.errors.password}
            </p>
          )}
        </div>

       {/* Submit Error */}
       {formState.errors.submit && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {formState.errors.submit}
            </p>
        </div>
       )}

       {/* Submit Button */}
       <button
       type='submit'
       disabled={formState.loading}
       className='w-full bg-gradient-to-r from-purple-500 to-blue-700 hover:from-blue-700 hover:to-purple-900 text-white font-bold py-2 px-4 rounded disabled:opacity-50 transition-all'>
        {formState.loading ? (
            <>
            <Loader className='mr-2' />
            <span className="text-sm">Signing In...</span>
            </>
        ) : (
            <span className="text-sm">Sign In</span>
        )}
       </button>

       {/* Sign UP link */}
       <div className="mt-4 text-center">
        <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <a href="/signup" className='text-blue-500 hover:text-blue-700 font-bold transition-all'>
            Create one here</a>
        </p>
       </div>
      </form>
    </div>
  </motion.div>
</div>
  )
}

export default Login
