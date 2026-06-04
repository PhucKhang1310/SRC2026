import { useState, type FormEvent, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { callEmailSignup } from "../../api/api";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") === "true") {
      navigate("/auth/login");
    }
  }, [navigate]);

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await callEmailSignup(email, password);
      setMessage(response.message);
      setPassword("");
      setConfirmPassword("");

      // Navigate to login after a short delay so they can see the success message
      setTimeout(() => {
        navigate("/auth/login");
      }, 3000);
    } catch (signupError) {
      setError(
        signupError instanceof Error
          ? signupError.message
          : "Could not create your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-black to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm cursor-pointer"
        >
          <FaArrowLeft size={14} />
          Back
        </button>

        <div className="text-center mt-6 mb-8">
          <h1 className="text-3xl font-bold text-[#ff6a1f] mb-2 tracking-wide">
            ResFes2026
          </h1>
          <p className="text-sm text-white/60">
            Create your account and verify your email
          </p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium mb-2 text-white/80">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your.email@example.com"
              autoComplete="email"
              required
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              minLength={6}
              required
              className="bg-black border border-white/20 rounded-lg p-3 text-white placeholder-white/30 focus:outline-none focus:border-[#ff6a1f] focus:ring-1 focus:ring-[#ff6a1f] transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="confirm-password" className="text-sm font-medium mb-2 text-white/80">
              Confirm password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Enter your password again"
              autoComplete="new-password"
              minLength={6}
              required
              className="bg-black border border-white/20 rounded-lg p-3 text-white placeholder-white/30 focus:outline-none focus:border-[#ff6a1f] focus:ring-1 focus:ring-[#ff6a1f] transition-all"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
          {message && (
            <p role="status" className="text-sm text-green-400">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#f27255] hover:bg-[#e65c3b] disabled:cursor-not-allowed disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors duration-300 mt-2 cursor-pointer"
          >
            {isSubmitting ? "Sending confirmation..." : "Sign Up"}
          </button>

          <p className="text-center text-sm text-white/60">
            Already verified?{" "}
            <Link to="/auth/login" className="text-[#ff6a1f] hover:text-[#e65c3b]">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default SignUp;
