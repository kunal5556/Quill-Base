import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5 text-center">
          <h1 className="h3 mb-3">Something went wrong</h1>
          <p className="text-muted mb-4">
            The page could not be displayed. Please reload and try again.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => window.location.assign("/")}>
            Back to home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
