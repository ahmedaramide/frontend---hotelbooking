import React from "react";

const PageLoading = (props) => {
  if (props && props.error) {
    return <div>Error!</div>;
  } else if (props && props.timedOut) {
    return <div>Taking a very long time...</div>;
  } else {
    return (
      <div className="d-flex justify-content-center m-5">
        <button className="btn btn-primary" type="button" disabled>
          <span
            className="spinner-border"
            role="status"
            aria-hidden="true"
          ></span>
          <strong>Loading...</strong>
        </button>
      </div>
    );
  }
};

export default PageLoading;
