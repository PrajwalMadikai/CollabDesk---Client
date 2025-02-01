"use client";
import API from "@/api/handle-token-expire";
import { setUser } from "@/store/slice/userSlice";
import { AppDispatch } from "@/store/store";
import TextField from "@mui/material/TextField";
import { GoogleLogin } from '@react-oauth/google';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from 'react-hot-toast';
import { useDispatch } from "react-redux";

export default function Signup() {

  const router=useRouter()
  const dispath=useDispatch<AppDispatch>()
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validate = () => {
    let isValid = true;
    const newErrors: any = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required.";
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }
    if (!password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required.";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // const handleGoogleLoginSuccess = async (credentialResponse:any) => {
  //   const idToken = credentialResponse.credential; // Extract ID token
  //   console.log('ID Token:', idToken);

  //   try {
  //      await axios.post('http://localhost:5713/google-signup', { idToken });

  //     toast.success('User registered successfully!', {
  //       duration: 2000,   
  //       position: 'top-right',
  //       style: {
  //         background: '#4caf50',   
  //         color: '#fff',  
  //       },
  //     });
  //     setTimeout(()=>{
  //       router.push('/login')
  //     },2000)
      
  //   } catch (error) {
  //     console.error('Error sending token to backend:', error);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
       
      toast.error("Please fix the errors in the form.", {
        duration: 3000,  
        position: 'top-right',
        style: {
            background: '#f44336',  
            color: '#fff', 
        },
    });
      return;
    }

    try {
      
      const isAdmin=false
      await API.post("http://localhost:5713/signup", {
        fullName,
        email,
        password,
        isAdmin
      });
       
     
      router.push('/email-sent');
        
      

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (error:any) {
      if(error.response && error.response.status==400)
      {
        const errorMessage = error.response.data.message
        toast.error(errorMessage, {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#f44336',
            color: '#fff',
          },
        });
      }else{
      toast.error("Signup failed. Please try again.", {
        duration: 3000,  
        position: 'top-right',
        style: {
            background: '#f44336',  
            color: '#fff', 
        },
    });
     }
    }
  };

   
  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential; // Extract the ID token
    console.log('id token:', idToken);

    try {
      const response = await API.post('http://localhost:5713/google-signup', { idToken });
      
      toast.success('User registered successfully!', {
        duration: 2000,
        position: 'top-right',
        style: { background: '#4caf50', color: '#fff' },
      });
          const userData=response.data.user
          const accessToken=response.data.accessToken

          if(userData)
          {
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('accessToken', accessToken); 
          }
          dispath(setUser(userData))


      setTimeout(() => {
        router.push('/');   
      }, 2000);
    } catch (error) {
      console.error('Error sending token to backend:', error);
      
      toast.error('Google signup failed. Please try again.', {
        duration: 2000,
        position: 'top-right',
        style: { background: '#f44336', color: '#fff' },
      });
    }
  };
  
  // const handleFailure = (error: any) => {
  //   console.error('Login failed:', error);
  //   toast.error('Google login failed. Please try again.', {
  //     duration: 2000,
  //     position: 'top-right',
  //     style: { background: '#f44336', color: '#fff' },
  //   });
  // };   
   

  
  const handleGitHubLogin = (mode: 'login' | 'signup') => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = `http://localhost:5713/auth/github/callback`;
    // Add mode as state parameter
    const state = encodeURIComponent(JSON.stringify({ mode }));
    const scope = 'read:user user:email';
    
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
  };


  return (
    <div className="min-h-screen bg-[radial-gradient(100%_50%_at_50%_0%,rgba(98,51,238,1)_0,rgba(0,0,0,0.8)_50%,rgba(0,0,0,1)_100%)]
 flex items-center justify-center p-4">
      
      {/* Toast Container */}

      <div className="flex flex-col md:flex-row items-stretch gap-8 max-w-5xl h-[600px] w-full ">
        {/* Left Section */}
        <div className="flex flex-1 flex-col items-center text-center md:text-left space-y-28   p-14 rounded-lg">
          <img
            src="/3682888-Photoroom.png"
            alt="Signup Illustration"
            className="w-full max-w-xs md:max-w-sm mx-auto pt-10"
          />
          <div>
            <span className="text-white text-md font-thin">Already have an account? </span>
            <Link href="/login" className="text-[#8B8AF4] hover:underline font-semibold">
              Login
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-1 flex-col space-y-6   p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white text-center md:text-left">Create Your Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-2">
            <TextField
            id="fullName"
            label="Full Name"
            variant="outlined"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={!!errors.fullName}
            helperText={errors.fullName && <span className="text-red-600">{errors.fullName}</span>}
            InputProps={{
              style: {
                backgroundColor: "transparent",
                color: "white",  
              },
            }}
            InputLabelProps={{
              style: { color: "white", fontWeight: 100,fontSize: "0.85rem" }, 
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "gray", // Default border color
                  borderWidth: "1px", // Reduced border thickness
                },
                "&:hover fieldset": {
                  borderColor: "darkgray", // Border color on hover
                  borderWidth: "1px", // Keep the border thickness on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "gray", // Border color when focused
                  borderWidth: "1px", // Keep the border thickness when focused
                },
              },
              "& .MuiInputBase-input": {
                color: "white", // Input text color
              },
              "& .MuiFormHelperText-root": {
                color: "white", // Helper text color
              },
            }}
          />


            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <TextField
                id="email"
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email && <span className="text-red-600">{errors.email}</span>}
                InputProps={{
                  style: {
                    backgroundColor: "transparent",
                    color: "white", // Text color set to white
                  },
                }}
                InputLabelProps={{
                  style: { color: "white", fontWeight: 100,fontSize: "0.85rem" }, 
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "gray", // Default border color
                      borderWidth: "1px", // Reduced border thickness
                    },
                    "&:hover fieldset": {
                      borderColor: "darkgray", // Border color on hover
                      borderWidth: "1px", // Keep the border thickness on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "gray", // Border color when focused
                      borderWidth: "1px", // Keep the border thickness when focused
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white", // Input text color
                  },
                  "& .MuiFormHelperText-root": {
                    color: "white", // Helper text color
                  },
                }}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <TextField
                id="password"
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password && <span className="text-red-600">{errors.password}</span>}
                InputProps={{
                  style: {
                    backgroundColor: "transparent",
                    color: "white", // Text color set to white
                  },
                }}
                InputLabelProps={{
                  style: { color: "white", fontWeight: 100,fontSize: "0.85rem" }, 
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "gray", // Default border color
                      borderWidth: "1px", // Reduced border thickness
                    },
                    "&:hover fieldset": {
                      borderColor: "darkgray", // Border color on hover
                      borderWidth: "1px", // Keep the border thickness on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "gray", // Border color when focused
                      borderWidth: "1px", // Keep the border thickness when focused
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white", // Input text color
                  },
                  "& .MuiFormHelperText-root": {
                    color: "white", // Helper text color
                  },
                }}
              />
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <TextField
                id="confirmPassword"
                label="Confirm Password"
                variant="outlined"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!errors.confirmPassword}
                helperText={
                  errors.confirmPassword && (
                    <span className="text-red-600">{errors.confirmPassword}</span>
                  )
                }
                InputProps={{
                  style: {
                    backgroundColor: "transparent",
                    color: "white", // Text color set to white
                  },
                }}
                InputLabelProps={{
                  style: { color: "white", fontWeight: 100,fontSize: "0.85rem" }, 
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "gray", // Default border color
                      borderWidth: "1px", // Reduced border thickness
                    },
                    "&:hover fieldset": {
                      borderColor: "darkgray", // Border color on hover
                      borderWidth: "1px", // Keep the border thickness on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "gray", // Border color when focused
                      borderWidth: "1px", // Keep the border thickness when focused
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white", // Input text color
                  },
                  "& .MuiFormHelperText-root": {
                    color: "white", // Helper text color
                  },
                }}
              />
            </div>

            {/* Signup button */}
            <button
              type="submit"
              className="w-full bg-[#1a1744] hover:bg-[#15123a] text-white font-semibold text-md py-2 rounded-sm h-12"
            >
              Sign Up
            </button>
          </form>
              {/* Divider */}
              <div className="relative">
            <div className="absolute inset-0 flex items-center">
              {/* <span className="w-full border-t border-gray-500"></span> */}
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-white ">OR</span>
            </div>
          </div>

          {/* Social Login buttons */}
          <div className="grid grid-cols-2 gap-4">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            useOneTap
            shape="rectangular"
            theme="outline"
            width="auto"
          />
          {/* <button
            className="bg-white hover:bg-gray-100 text-gray-800 flex items-center justify-center space-x-2 h-[40px] rounded-[4px] px-4"
          >
            <img
              src="/google.png"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-sm font-medium">Sign up with Google</span>
          </button> */}
            <button
              onClick={()=>handleGitHubLogin('signup')}
              className="bg-white w-full md:w-[200px] hover:bg-gray-100 text-gray-800 flex items-center justify-center space-x-2 h-[40px] rounded-[4px] px-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" className="h-6  mr-2"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>
              <span className="text-sm font-medium">Sign up with GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
