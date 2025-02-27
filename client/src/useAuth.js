import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useAuth(code) {
	const [ accessToken, setAccessToken ] = useState();
	const [ refreshToken, setRefreshToken ] = useState();
	const [ expiresIn, setExpiresIn ] = useState();

	//this gets all the code we need to make the coe above work
	useEffect(
		() => {
			axios
				// .post('http://localhost:3001/login', {
				.post('https://dts-final-152235865101294.herokuapp.com//login', {
					code
				})
				.then((res) => {
					setAccessToken(res.data.accessToken);
					setRefreshToken(res.data.refreshToken);
					setExpiresIn(res.data.expiresIn);
					window.history.pushState({}, null, '/');
				})
				.catch(() => {
					window.location = '/';
				});
		},
		[ code ]
	);

	useEffect(
		() => {
			if (!refreshToken || !expiresIn) return;
			const interval = setInterval(() => {
				axios
					.post('https://dts-final-152235865101294.herokuapp.com//refresh', {
						// .post('http://localhost:3001/refresh', {
						refreshToken
					})
					.then((res) => {
						setAccessToken(res.data.accessToken);
						setExpiresIn(res.data.expiresIn);
					})
					// a failure will redirect the user to the homepage
					.catch(() => {
						window.location = '/';
					});
			}, (expiresIn - 60) * 1000);

			return () => clearInterval(interval);
		},
		[ refreshToken, expiresIn ]
	);

	return accessToken;
}
