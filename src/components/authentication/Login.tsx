import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/api";
import { useUser } from "../../hook/useUser";

const Login = () => {
    const [errorMessage, setErrorMessage] = React.useState("");
    const navigate = useNavigate();
    const { login: loginUser } = useUser();

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const email = event.currentTarget.email.value;
        const password = event.currentTarget.password.value;

        login(email, password)
            .then((response) => {
                setErrorMessage("");
                loginUser(response.token);
                navigate("/admin");
            })
            .catch((error) => {
                console.error("Login failed:", error);
                setErrorMessage("Login failed: " + (error instanceof Error ? error.message : "Unknown error"));
            });
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-6 text-amber-50">
            <div className="w-full max-w-md shadow-2xl rounded-2xl bg-neutral-900 border border-white/10 p-8 sm:p-10 relative overflow-hidden">

                <button
                    onClick={() => navigate("/")}
                    className="absolute top-6 left-6 text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm cursor-pointer"
                >
                    <FaArrowLeft size={14} />
                    Back
                </button>

                <div className="text-center mt-6 mb-10">
                    <h1 className="text-3xl font-bold text-[#ff6a1f] mb-2 tracking-wide">ResFes2026</h1>
                    <p className="text-sm text-white/60">This section is for staff and admin only</p>
                </div>

                <form className="flex flex-col gap-6" onSubmit={handleLogin}>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm font-medium mb-2 text-white/80">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="your.email@example.com"
                            className="bg-black border border-white/20 rounded-lg p-3 text-white placeholder-white/30 focus:outline-none focus:border-[#ff6a1f] focus:ring-1 focus:ring-[#ff6a1f] transition-all"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-sm font-medium mb-2 text-white/80">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            className="bg-black border border-white/20 rounded-lg p-3 text-white placeholder-white/30 focus:outline-none focus:border-[#ff6a1f] focus:ring-1 focus:ring-[#ff6a1f] transition-all"
                        />
                    </div>

                    <div className="flex items-center justify-between -mt-2">
                        <a href="#" className="text-sm text-[#ff6a1f] hover:text-[#e65c3b] transition-colors">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#f27255] hover:bg-[#e65c3b] text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors duration-300 mt-4 cursor-pointer"
                    >
                        Sign In
                    </button>
                    {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                </form>
            </div>
        </main>
    );
};

export default Login;
