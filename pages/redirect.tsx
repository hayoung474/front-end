import { ReactElement, useEffect } from 'react';
import type { NextPageWithLayout } from 'pages/_app';
import { AppLayout } from 'components/layout';
import { NextPageContext } from 'next';
import { kakaoLoginApi } from 'pages/api/test';
import Router from 'next/router';
import { useDispatch } from 'react-redux';
import { loginAction } from 'store/user';
import { saveToken } from 'utils/token';
import { Loading } from 'components/common';

interface Props {
  data?: any;
  status?: number;
}

interface DataProps {
  id: string;
  kakaoUid: number;
  nickName: string;
  profileImg: string;
  accessToken: string;
  isReqSignUp: boolean;
}

// { data, status }: Props
const redirect: NextPageWithLayout = () => {
  const dispatch = useDispatch();

  const dataFetch = async () => {
    const urlParams = new URL(location.href).searchParams;
    const code = urlParams.get('code');
    if (code) {
      const res = await kakaoLoginApi(code);
      console.log(res.data);
      saveUser(res.data);
    }
  };
  const saveUser = async (data: DataProps) => {
    // nullish 체크를 통해 에러가 아닌 undefined를 표시하도록 함.
    const id: string = data?.id;
    const kakaoUid: number = data?.kakaoUid;
    const nickName: string = data?.nickName;
    const profileImg: string = data?.profileImg;
    const accessToken: string = data?.accessToken;
    const isReqSignUp: boolean = data?.isReqSignUp;
    dispatch(loginAction({ id, profileImg, nickName, kakaoUid })); // 개인정보를 redux에 저장
    await saveToken(accessToken); // 토큰을 쿠키에 저장 비동기 함수

    if (isReqSignUp) {
      Router.replace({
        pathname: '/member/profile',
        query: { isReqSignUp },
      }); // 뒤로가기를 통해 로그인 redirection 페이지로 재접근 하는 것을 방지
    } else {
      Router.replace('/');
    }
  };

  useEffect(() => {
    dataFetch();
  }, []);

  return (
    <div>
      <Loading ment={'로그인 중 입니다...'} />
    </div>
  );
};

redirect.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

// url 의 params 를 가져와서 초기값으로 세팅하기 SSR

/*redirect.getInitialProps = async (context: NextPageContext) => {
  const code = context.query.code as string; // 타입 단언
  console.log(code);
  const res = await kakaoLoginApi(code);
  return { data: res.data, status: res.status };
};*/

export default redirect;
