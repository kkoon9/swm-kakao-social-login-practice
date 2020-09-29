import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import KaKaoLogin from 'react-kakao-login';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class KaKaoSignin extends Component<any> {
	constructor(props: any) {
		super(props);
	}

	responseKaKao = async (res: any) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const data: Object = {
			id: res.profile.id,
			nickname: res.profile.kakao_account.profile.nickname,
			email: res.profile.kakao_account.email,
			thumbnail_image_url: res.profile.kakao_account.profile.thumbnail_image_url,
		};
		const body = JSON.stringify(data);

		try {
			const res = await axios.post('http://localhost:8080/api/auth', body, config);
			console.log('res : ', res.data.data.token);
			const msg: string = JSON.stringify(res.data.success);
			console.log('success : ', res.data.success);
			if (msg === 'true') {
				alert('로그인 성공.');
				localStorage.setItem('token', res.data.data.token);
				console.log('localStorage : ', localStorage.getItem('token'));
			} else {
				alert('DB 오류입니다.');
			}
		} catch (err) {
			sessionStorage.clear();
			alert(err);
		}
	};

	responseFail = (err: any) => {
		alert(err);
	};

	render() {
		return (
			<Fragment>
				<br></br>
				<KaKaoBtn
					jsKey={process.env.REACT_APP_KAKAO_KEY!}
					buttonText='카카오 계정으로 로그인'
					onSuccess={this.responseKaKao}
					onFailure={this.responseFail}
					getProfile={true}
				/>
			</Fragment>
		);
	}
}

const KaKaoBtn = styled(KaKaoLogin)`
	padding: 0;
	width: 190px;
	height: 44px;
	line-height: 44px;
	color: #783c00;
	background-color: #ffeb00;
	border: 1px solid transparent;
	border-radius: 3px;
	font-size: 16px;
	font-weight: bold;
	text-align: center;
	cursor: pointer;
	&:hover {
		box-shadow: 0 0px 15px 0 rgba(0, 0, 0, 0.2);
	}
`;

export default KaKaoSignin;
