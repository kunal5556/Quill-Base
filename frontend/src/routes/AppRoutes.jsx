import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Home from "../pages/Home";
import PostDetails from "../pages/PostDetails";
import Categories from "../pages/Categories";
import CategoryPosts from "../pages/CategoryPosts";
import Search from "../pages/Search";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/admin/Dashboard";
import ManagePosts from "../pages/admin/ManagePosts";
import PostForm from "../pages/admin/PostForm";
import ManageCategories from "../pages/admin/ManageCategories";
import ManageComments from "../pages/admin/ManageComments";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts/:slug" element={<PostDetails />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/categories/:slug" element={<CategoryPosts />} />
      <Route path="/search" element={<Search />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/posts" element={<ManagePosts />} />
          <Route path="/admin/posts/new" element={<PostForm />} />
          <Route path="/admin/posts/:id/edit" element={<PostForm />} />
          <Route path="/admin/categories" element={<ManageCategories />} />
          <Route path="/admin/comments" element={<ManageComments />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
