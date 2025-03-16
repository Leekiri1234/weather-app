interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error!</h4>
        <p>{message}</p>
        <hr />
        <p className="mb-0">Please check your connection and try again.</p>
      </div>
      <button 
        className="btn btn-primary mt-3"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorMessage;
