import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import PostDetail from "./pages/PostDetail/PostDetail";
import CategoryPosts from "./pages/CategoryPosts/CategoryPosts";
import Authors from "./pages/Authors/Authors";
import AuthorProfile from "./pages/AuthorProfile/AuthorProfile";
import CreatePost from "./pages/CreatePost/CreatePost";
import AuthorPosts from "./pages/AuthorPosts/AuthorPosts";
import EditPost from "./pages/EditPost/EditPost";
import DeletePost from "./pages/DeletePost/DeletePost";
import AuthorDashboard from "./pages/AuthorDashboard/AuthorDashboard";
import Logout from "./pages/Logout/Logout";

import UserProvider from "./context/userContext";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<UserProvider>
				<Layout />
			</UserProvider>
		),
		errorElement: <ErrorPage />,
		children: [
			{ index: true, element: <Home /> },
			{ path: "/login", element: <Login /> },
			{ path: "/register", element: <Register /> },
			{ path: "/posts/:id", element: <PostDetail /> },
			{ path: "/posts/categories/:category", element: <CategoryPosts /> },
			{ path: "/authors", element: <Authors /> },
			{ path: "/profile/:id", element: <AuthorProfile /> },
			{ path: "/create", element: <CreatePost /> },
			{ path: "/posts/users/:id", element: <AuthorPosts /> },
			{ path: "/posts/:id/edit", element: <EditPost /> },
			{ path: "/posts/:id/delete", element: <DeletePost /> },
			{ path: "/myposts/:id", element: <AuthorDashboard /> },
			{ path: "/logout", element: <Logout /> },
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
