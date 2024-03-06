import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./../../context/userContext";
import Loader from "./../../components/Loader/Loader";

function DeletePost({ postId: id }) {
	const navigate = useNavigate();
	const location = useLocation();
	const [isLoading, setIsLoading] = useState(false);

	const { currentUser } = useContext(UserContext);
	const token = currentUser?.token;

	//Redirect to login page if not logged in
	useEffect(() => {
		if (!token) {
			navigate("/login");
		}
	}, []);

	const removePost = async () => {
		setIsLoading(true);
		try {
			const response = await axios.delete(
				`${import.meta.env.VITE_REACT_APP_BASE_URL}/posts/${id}`,
				{ withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.status == 200) {
				if (location.pathname == `/myposts/${currentUser.id}`) {
					navigate(0);
				} else {
					navigate("/");
				}
			}
			setIsLoading(false);
		} catch (error) {
			console.log("Couldn't deleted post");
		}
	};

	if (isLoading) {
		return <Loader />;
	}

	return (
		<Link
			className='btn sm danger'
			onClick={() => removePost(id)}>
			Delete
		</Link>
	);
}

export default DeletePost;
