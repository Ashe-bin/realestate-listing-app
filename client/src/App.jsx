import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Profile } from "./pages/Profile";
import { PrivateRoute } from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import { Listing } from "./pages/Listing";
import Search from "./pages/Search";
import About from "./pages/About";
import { Header } from "./components/Header";
import ShowListing from "./pages/ShowListing";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { resetCurrentUser } from "./redux/feature/user/userSlice";
import { resetLiked } from "./redux/feature/user/userLikedListSlice";
import Loading from "./components/Loading";

function App() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
    const checkUserSession = async () => {
      try {
        const res = await fetch("api/auth/accessTokenExist");
        const data = res.json();
        if (data.success === false) {
          dispatch(resetCurrentUser());
          dispatch(resetLiked());
        }
      } catch (error) {
        console.error(error.message);
        dispatch(resetCurrentUser());
        dispatch(resetLiked());
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    };
    checkUserSession();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/listing/:listingId" element={<Listing />} />
          <Route path="/search" element={<Search />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/edit-listing/:listingId" element={<EditListing />} />

            <Route path="/show-listing" element={<ShowListing />} />
          </Route>
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
