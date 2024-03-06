import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "./../../components/Loader/Loader";
import PostItem from "./../../components/PostItem/PostItem";

function AuthorPosts() {
	const [posts, setPosts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const { id } = useParams();

	useEffect(() => {
		const fetchPosts = async () => {
			setIsLoading(true);
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_REACT_APP_BASE_URL}/posts/users/${id}`
				);

				setPosts(response?.data);
				console.log(response.data);
			} catch (error) {
				console.log(error);
			}
			setIsLoading(false);
		};
		fetchPosts();
	}, [id]);

	if (isLoading) {
		return <Loader />;
	}
	return (
		<section className='posts'>
			{console.log("Posts A Length:", posts.length)}
			{posts && posts.length > 0 ? (
				<div className='container posts__container'>
					{posts.map(
						({
							_id: id,
							thumbnail,
							category,
							title,
							description,
							creator,
							createdAt,
						}) => (
							<PostItem
								key={id}
								postID={id}
								thumbnail={thumbnail}
								category={category}
								title={title}
								description={description}
								authorID={creator}
								createdAt={createdAt}
							/>
						)
					)}
				</div>
			) : (
				<h2 className='center'>No posts found</h2>
			)}
		</section>
	);
}

export default AuthorPosts;
