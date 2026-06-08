type LoadingPageProps = {
  label?: string;
};

const LoadingPage = ({ label = "Loading" }: LoadingPageProps) => (
  <div
    className="fixed inset-0 z-100 flex min-h-dvh items-center justify-center bg-black text-white"
    role="status"
    aria-label={label}
  >
    <span className="loading loading-spinner loading-lg text-orange-500" />
  </div>
);

export default LoadingPage;
