import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../common/Loader";
import { useLazyGetMeQuery } from "../../features/auth/authApi";
import { logout, selectIsInitialized, selectToken, setCredentials, setInitialized } from "../../features/auth/authSlice";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const isInitialized = useSelector(selectIsInitialized);
  const [loadCurrentUser] = useLazyGetMeQuery();

  useEffect(() => {
    if (isInitialized) {
      return;
    }

    if (!token) {
      dispatch(setInitialized());
      return;
    }

    loadCurrentUser()
      .unwrap()
      .then((user) => dispatch(setCredentials({ user, token })))
      .catch(() => dispatch(logout()));
  }, [dispatch, isInitialized, loadCurrentUser, token]);

  if (!isInitialized) {
    return <Loader />;
  }

  return children;
}

export default AuthInitializer;
