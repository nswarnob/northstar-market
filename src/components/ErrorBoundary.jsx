import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Frontend render failed", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="fatal-error">
          <p className="eyebrow">APPLICATION ERROR</p>
          <h1>The storefront could not start.</h1>
          <p>{this.state.error.message || "An unexpected browser error occurred."}</p>
          <button onClick={() => {
            localStorage.removeItem("northstar_cart");
            window.location.reload();
          }}>
            Reset local cart and reload
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}

