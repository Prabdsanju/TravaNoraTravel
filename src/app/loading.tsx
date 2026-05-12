export default function Loading() {
  return (
    <div className="loading-container animate-fade-in">
      <div className="loading-spinner">
        <div className="loading-spinner-circle"></div>
      </div>
      <h1 className="loading-h1">
        Loading<br />
        <span className="loading-domain">Please wait...</span>
      </h1>
      <p className="loading-p">This will only take a moment.</p>
    </div>
  );
}
