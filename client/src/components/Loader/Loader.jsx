import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

import "./Loader.css";

const Loader = () => {
	return (
		<div className='loader'>
			<ClipLoader
				color='var(--color-primary)'
				height={15}
				margin={2}
				radius={3}
				speedMultiplier={3}
				width={5}
			/>
		</div>
	);
};

export default Loader;
