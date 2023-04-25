import { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

function RequireAuth({ children }) {
  const navigate = useNavigate();

  const location = useLocation();

  // useEffect(() => {
  //   console.log("user", user);
  //   if (!loading) {
  //     if (
  //       location.pathname !== "/sign-in" &&
  //       location.pathname !== "/sign-up" &&
  //       location.pathname !== "/"
  //     ) {
  //       if (!user.id && !isUserAuthenticated) {
  //         Swal.fire({
  //           title: "Error!",
  //           text: "You are not signed in. Please sign in to access this page.",
  //           icon: "error",
  //           confirmButtonText: "Ok",
  //         }).then((result) => {
  //           if (result.isConfirmed || result.isDenied || result.isDismissed) {
  //             navigate("/sign-in", {
  //               replace: true,
  //               state: { from: location.pathname },
  //             });
  //           }
  //         });
  //       }
  //     }
  //   }
  // }, [location.pathname, loading]);

  // useEffect(() => {
  //   console.log("Loading", loading);
  //   if (!loading && !auth) {
  //     if (
  //       location.pathname === "/sign-in" ||
  //       location.pathname === "/sign-up" ||
  //       location.pathname === "/"
  //     ) {
  //       if (user.id && isUserAuthenticated) {
  //         Swal.fire({
  //           title: "Error!",
  //           text: "You are already signed in. Please sign out to access this page.",
  //           icon: "error",
  //           confirmButtonText: "Ok",
  //         }).then((result) => {
  //           if (result.isConfirmed || result.isDenied || result.isDismissed) {
  //             navigate("/overview");
  //           }
  //         });
  //       }
  //     }
  //   }
  // }, [location.pathname, auth]);

  return children;
}
export default RequireAuth;
