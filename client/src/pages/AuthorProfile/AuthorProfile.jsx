import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import axios from "axios";

import "./AuthorProfile.css";
import { UserContext } from "../../context/userContext";

function AuthorProfile() {
	const [avatar, setAvatar] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [error, setError] = useState("");

	const [isAvatarTouched, setIsAvatarTouched] = useState(false);

	const navigate = useNavigate();

	const { currentUser } = useContext(UserContext);
	const token = currentUser?.token;

	useEffect(() => {
		if (!token) {
			navigate("/login");
		}
	}, []);

	useEffect(() => {
		const getUser = async () => {
			const response = await axios.get(
				`${import.meta.env.VITE_REACT_APP_BASE_URL}/users/${currentUser.id}`,
				{
					withCredentials: true,
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			const { name, email, avatar } = response.data;
			setName(name);
			setEmail(email);
			setAvatar(avatar);
		};

		getUser();
	}, []);

	const changeAvatarHandler = async () => {
		setIsAvatarTouched(false);
		try {
			const postData = new FormData();
			postData.set("avatar", avatar);
			const response = await axios.post(
				`${import.meta.env.VITE_REACT_APP_BASE_URL}/users/change-avatar`,
				postData,
				{ withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
			);
			setAvatar(response?.data.avatar);
		} catch (error) {
			console.log(error);
		}
	};

	const updateUserDetails = async (e) => {
		e.preventDefault();
		try {
			const userData = {
				name,
				email,
				currentPassword,
				newPassword,
				confirmNewPassword,
			};

			// Remove empty fields
			Object.keys(userData).forEach((key) => {
				if (!userData[key]) {
					delete userData[key];
				}
			});

			// console.log(userData);
			// console.log(name);
			// console.log(email);
			// console.log(currentPassword);
			// console.log(newPassword);
			// console.log(confirmNewPassword);

			const response = await axios.patch(
				`${import.meta.env.VITE_REACT_APP_BASE_URL}/users/edit-user`,
				userData,
				{ withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
			);

			// console.log("API Response:", response);

			if (response.status === 200) {
				//Log user out
				navigate("/logout");
			}
		} catch (error) {
			setError(error.response.data.message);
		}
	};
	return (
		<section className='profile'>
			<div className='container profile__container'>
				<Link
					to={`/myposts/${currentUser.id}`}
					className='btn'>
					My posts
				</Link>

				<div className='profile__details'>
					<div className='avatar__wrapper'>
						<div className='profile__avatar'>
							<img
								src={`${avatar?.url}`}
								alt=''
							/>
						</div>
						{/* Form to update Avatar */}
						<form className='avatar__form'>
							<input
								type='file'
								name='avatar'
								id='avatar'
								onChange={(e) => setAvatar(e.target.files[0])}
								accept='png, jpg,jpeg'
							/>
							<label
								htmlFor='avatar'
								onClick={() => setIsAvatarTouched(true)}>
								<FaEdit />
							</label>
						</form>
						{isAvatarTouched && (
							<button
								className='profile__avatar-btn'
								onClick={changeAvatarHandler}>
								<FaCheck />
							</button>
						)}
					</div>
					<h1>{currentUser.name}</h1>

					{/* Form to update user profile */}
					<form
						className='form profile__form'
						onSubmit={updateUserDetails}>
						{error && <p className='form__error-message'>{error}</p>}
						<input
							type='text'
							placeholder='Full Name'
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<input
							type='email'
							placeholder='Email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<input
							type='password'
							placeholder='Current password'
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
						/>
						<input
							type='password'
							placeholder='New password'
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						/>
						<input
							type='password'
							placeholder='Confirm new password'
							value={confirmNewPassword}
							onChange={(e) => setConfirmNewPassword(e.target.value)}
						/>
						<button
							type='submit'
							className='btn primary'>
							Update details
						</button>
					</form>
				</div>
			</div>
		</section>
	);
}

export default AuthorProfile;
