import { ReactElement } from 'react';
import styled from 'styled-components';
import type { NextPageWithLayout } from 'pages/_app';
import { AppLayout } from 'components/layout';
import { Button } from 'components/common';
import useInput from 'hooks/useInput';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { saveProblemsAction, saveProblemSetTitleAction } from 'store/quiz';
import Router from 'next/router';
import { BsCheck } from 'react-icons/bs';
import { MdClear } from 'react-icons/md';

const Page: NextPageWithLayout = () => {
  const dispatch = useDispatch();
  const [title, , titleClear, titleHandler] = useInput<string>('');
  const { setTitle,problems } = useSelector((state: RootState) => state.quiz);

  const newStart = () => {
    dispatch(saveProblemSetTitleAction({ setTitle: title })); // 제목 저장
    dispatch(saveProblemsAction({ problems: [] })); // 빈 배열로 초기화
    Router.push('/quiz/create/main');
  };
  const keepGoing = () => {
    Router.push('/quiz/create/main');
  };
  const goHome = () => {
    Router.push('/home');
  };
  return (
    <Wrapper>
      <TitleContainer>
        <div id="logo-wrapper">
          <div id="logo" onClick={goHome}>
            캐치캐치
          </div>
        </div>
        <div id="title-input-wrapper">
          <span>참여자들에게 어떤 제목으로 보여줄까요?</span>
          <TitleInput>
            <input
              type="text"
              placeholder="제목을 입력해주세요!"
              value={title}
              onChange={titleHandler}
              maxLength={20}
            />
            <button id="clear-btn" onClick={titleClear} disabled={title === ''}>
              <MdClear size={20} />
            </button>
          </TitleInput>
        </div>
      </TitleContainer>
      <ul className="notice">
        <li>
          <BsCheck size="20" color="#ff4d57" />
          문제 생성은 <strong>최대 10개</strong> 까지 가능합니다.
        </li>
        <li>
          <BsCheck size="20" color="#ff4d57" />
          제목 입력은 필수입니다! <strong>최대 20자</strong> 까지 입력 가능합니다.
        </li>
        <li>
          <BsCheck size="20" color="#ff4d57" />
          객관식 답안은 <strong>최대 4개</strong> 까지 추가할 수 있습니다.
        </li>
        <li>
          <BsCheck size="20" color="#ff4d57" />
          참여자들에게 보여지는 퀴즈이므로, <strong>유해한 단어는 지양</strong>해주세요!
          <br />
          (ex. 욕설, 미풍약속을 해치는 단어 )
        </li>
        <li>
          <BsCheck size="20" color="#ff4d57" />
          생성한 퀴즈는 수정이 불가능 합니다.
        </li>
      </ul>
      <ButtonContainer>
        <Button
          width={'60%'}
          height={'60px'}
          onClick={keepGoing}
          className="active"
          disabled={setTitle === '' || problems.length === 0}
        >
          <span>
            이어서
            <br />
            제작하기
          </span>
        </Button>
        <Button width={'60%'} height={'60px'} onClick={newStart} disabled={title === ''}>
          <span>
            새롭게
            <br />
            시작하기
          </span>
        </Button>
      </ButtonContainer>
    </Wrapper>
  );
};
Page.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

// 임시 디자인
const Wrapper = styled.div`
  position: relative;
  display: block;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  color: #000;
  background-color: white;
  #warning {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    color: red;
  }
  * {
    margin: 0 auto;
  }

  .notice {
    padding: 0 10%;
    margin: 15% 0;
    @media (max-height: 700px) {
      margin: 10% 0;
      li{
        margin-bottom:5%;
      }
    }
    li {
      position: relative;
      font-size: 0.9rem;
      color: #888;
      list-style: none;
      padding-left: 10%;
      margin-bottom: 10%;
      word-break: keep-all;
      strong {
        color: #ff4d57;
      }
      svg {
        position: absolute;
        left: 0;
      }
    }
  }
`;

const TitleContainer = styled.div`
  overflow: hidden;
  position: relative;
  display: block;
  width: 100%;
  height: 35%;
  #logo-wrapper {
    padding: 1.5rem;
    text-align: left;
    position: relative;
    background-color: transparent;
    z-index: 2;
    #logo {
      color: #fff;
      font-size: 1.5rem;
      font-family: 'RixInooAriDuriR';
      &:hover {
        cursor: pointer;
        color: lightgrey;
      }
    }
  }
  #title-input-wrapper {
    color: #fff;
    span {
      text-align: center;
      position: relative;
      display: block;
      margin-top: 15px;
      margin-bottom: 15px;
      z-index: 2;
    }
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background-color: #ff4d57;
    border-bottom-right-radius: 50%;
    border-bottom-left-radius: 50%;
    display: block;
    width: 600px;
    height: 100%;
    z-index: 1;
  }
`;
const TitleInput = styled.div`
  z-index: 2;
  display: flex;
  position: relative;
  border-bottom: 2px solid #fff;
  max-width: 70%;
  input {
    height: 50px;
    border: 0;
    width: 85%;
    background-color: transparent;
    color: #fff;
    font-size: 1rem;
    text-align: center;
    &:focus {
      outline: none;
    }
    &::placeholder {
      font-size: 20px;
      font-weight: 300;
      opacity: 0.5;
      color: #fff;
    }
  }
  #clear-btn {
    margin: 0;
    height: 50px;
    background-color: transparent;
    border: none;
    color: #fff;
    &:disabled {
      display: none;
    }
    svg {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1rem 0 1rem;
  background-color: #fff;
  padding:1rem;
  position:absolute;
  width:100%;
  bottom:0;
  button {
    bottom:0;
    font-size: 14px;
    border-radius: 30px;
    height: 70px;
    font-weight:500;
    margin-right: 0.5rem;
    margin-left:0.5rem;
    background-color: #ff4d57;
    color: #fff;
    &:disabled {
      color: #7c7c7c;
      background-color: #ececec;
    }
  }
`;
export default Page;