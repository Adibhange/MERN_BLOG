import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "./../../components/Loader/Loader";
import PostItem from "./../../components/PostItem/PostItem";

function CategoryPosts() {
	const [posts, setPosts] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const { category } = useParams();

	// console.log(category);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await axios.get(
					`${
						import.meta.env.VITE_REACT_APP_BASE_URL
					}/posts/categories/${category}`
				);

				setPosts(Array.isArray(response?.data) ? response.data : []);
			} catch (error) {
				console.log(error);
			}
			setIsLoading(false);
		};
		fetchPosts();
	}, [category]);

	if (isLoading) {
		return <Loader />;
	}

	return (
		<section className='posts'>
			{console.log("Posts C Length:", posts.length)}
			{posts.length > 0 ? (
				<div className='container posts__container'>
					{posts.map(
						({
							_id: id,
							thumbnail,
							category: postCategory,
							title,
							description,
							creator,
							createdAt,
						}) => (
							<PostItem
								key={id}
								postID={id}
								thumbnail={thumbnail}
								category={postCategory}
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

export default CategoryPosts;
