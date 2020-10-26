import React, { useEffect, useState, Fragment } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

declare global {
  interface Window {
    naver: any;
  }
}

const { naver } = window;

interface User {
  nickname: string;
  image: string;
}

interface Image {
  url: string;
}

interface Menu {
  menu: number | boolean;
}

const Nav: React.FC<RouteComponentProps> = () => {
  const [data, setData] = useState<User>({ nickname: '', image: '' });
  const [menu, setMenu] = useState<number>(1);
  const [profile, setProfile] = useState<boolean>(false);

  useEffect(CDM, []);

  function CDM() {
    Naver();
    GetProfile();
  }
  function Naver() {
    //리팩토링 예정
    console.log("test : " , process.env.REACT_APP_NAVER_APP_KEY)
    const naverLogin = new naver.LoginWithNaverId({
      clientId: process.env.REACT_APP_NAVER_APP_KEY,
      callbackUrl: 'http://127.0.0.1:3000/login/',
      callbackHandle: true,
      loginButton: {
        color: 'green',
        type: 1,
        height: 20,
      } /* 로그인 버튼의 타입을 지정 */,
    });

    naverLogin.init();
    window.addEventListener('load', function() {
      naverLogin.getLoginStatus(function(status: string) {
          /* 필수적으로 받아야하는 프로필 정보가 있다면 callback처리 시점에 체크 */

          const name = naverLogin.user.getName();
          const profileImage = naverLogin.user.getProfileImage();
          console.log(name, profileImage);
          if (name === undefined || name === null) {
            alert('닉네임은 필수정보입니다. 정보제공을 동의해주세요.');
            /* 사용자 정보 재동의를 위하여 다시 네아로 동의페이지로 이동함 */
            naverLogin.reprompt();
            return;
          } else if (profileImage === undefined || profileImage === null) {
            alert('프로필사진은 필수정보입니다. 정보제공을 동의해주세요.');
            naverLogin.reprompt();
            return;
          }

          window.location.replace(
            'http://' +
              window.location.hostname +
              (window.location.port === '' || window.location.port === undefined
                ? ''
                : ':' + window.location.port),
          );
   
      });
    });
  }

  function GetProfile() {
    window.location.href.includes('access_token') && GetUser();

    async function GetUser() {
      const location = window.location.href.split('=')[1];
      const loca = location.split('&')[0];
      let config = {
        headers: {
          Authorization: loca,
        }
      }
      const token = await axios.get('http://localhost:5500/login/callback', config);
      localStorage.setItem('token', token.data.token);
    }
  }

  return (
    <Fragment>
        <Fragment>
        <NaverLogin id="naverIdLogin"></NaverLogin>
        </Fragment>

    </Fragment>
  );
};

export default withRouter(Nav);


const pseudoBefore = css`
  content: '';
  display: inline-block;
`;

const NaverLogin = styled.div`
  width: 30px;
  height: 30px;
  vertical-align: middle;
  margin-right: 10px;
`;