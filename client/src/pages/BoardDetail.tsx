import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { styled } from 'styled-components';
import axios from 'axios';
// components
import BoardDetailHeader from '../components/Board/BoardDetail/BoardDetailHeader.tsx';
import ApplyParticipate from '../components/Board/BoardDetail/ApplyParticipate.tsx';
import WriterProfile from '../components/Board/BoardDetail/WriterProfile.tsx';
import BoardComment from '../components/Board/BoardDetail/BoardComment.tsx';
import Loading from '../components/Loading.tsx';

// import authApi from '../util/api/authApi.tsx';
import { IBoardDetailData } from '../interface/board.ts';
import { IUserState } from '../store/userSlice.ts';
import { getCookie } from '../util/cookie/index.ts';

interface IMember {
  memberId: number;
  name: string;
}

const BoardDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const postId = Number(params.postId);
  const userId = useSelector((state: IUserState) => state.user.memberId);

  const [detailData, setDetailData] = useState<IBoardDetailData>({
    title: '',
    content: '',
    image: '',
    createdAt: '',
    viewCount: 0,
    commentCount: 0,
    status: '',
    category: '',
    member: {
      memberId: 0,
      image: '',
      name: '',
      gender: '',
      avgStarRate: 0,
      eatStatus: false,
    },
    postTag: {
      postTagId: 0,
      foodTagId: 0,
      genderTagId: 0,
    },
    mate: {
      findNum: 0,
      mateNum: 0,
    },
    mateMembers: [],
    comments: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { content, member, comments } = detailData;
  const [updateMate, setUpdateMate] = useState({ mate: { findNum: 0, mateNum: 0 } });
  const [mateData, setMateData] = useState<IMember[] | []>([]);

  const showParticipant = mateData.filter((mate) => mate.memberId === userId).length;

  useEffect(() => {
    getDetailData();
    getMateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDetailData = () => {
    axios
      .get(`${import.meta.env.VITE_APP_API_URL}/board/posts/${postId}`)
      .then((res) => {
        console.log(res.data);
        const { mate } = res.data;
        setDetailData(res.data);
        setUpdateMate({ mate });
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const getMateData = () => {
    axios
      .get(`${import.meta.env.VITE_APP_API_URL}/posts/${postId}/mate`)
      .then((res) => {
        console.log(res.data);
        const { mate_member } = res.data;
        setMateData(mate_member);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const applyData = {
    memberId: userId, //사용자 멤버 아이디
  };

  const postApplyData = () => {
    axios
      .post(`${import.meta.env.VITE_APP_API_URL}/board/posts/${postId}/mate`, applyData, {
        headers: { Authorization: getCookie('accessToken') },
      })
      .then((res) => {
        setUpdateMate({ ...updateMate, mate: { findNum: res.data.findNum, mateNum: res.data.mateNum } });
        getMateData();
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 409) {
          alert('이미 참여 신청한 모임입니다.');
        } else if (err.response.status === 403) {
          alert('신청 불가한 모임입니다.');
        }
      });
  };

  const deletePost = () => {
    axios
      .delete(`${import.meta.env.VITE_APP_API_URL}/board/posts/${postId}`, {
        headers: { Authorization: getCookie('accessToken') },
      })
      .then((res) => {
        console.log(res);
        navigate('/board');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <DetailContainer>
      {/* 상단 정보 영역 */}
      <BoardDetailHeader boardInfo={detailData} />
      <ContentsSection>
        <ContentsWrapper>
          {/* 내용 영역 */}
          <TextContainer>
            <TextArea dangerouslySetInnerHTML={{ __html: content }} />
            {userId === member.memberId && (
              <ModifyButtons>
                <Link to={`/board/posts/${postId}/edit`}>수정</Link>
                <button type="button" onClick={() => deletePost()}>
                  삭제
                </button>
              </ModifyButtons>
            )}
          </TextContainer>
          {/* 참가 신청 영역 */}
          <ApplyParticipate
            postApplyData={postApplyData}
            updateMate={updateMate.mate}
            showParticipant={showParticipant}
            mateData={mateData}
          />
        </ContentsWrapper>
        {/* 작성자 프로필 영역 */}
        <WriterProfile profileInfo={member} />
      </ContentsSection>
      {/* 댓글 영역 */}
      <BoardComment commentInfo={comments} />
    </DetailContainer>
  );
};

const DetailContainer = styled.section`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.875rem;
  @media screen and (min-width: 768px) {
    padding: 40px 80px;
  }
  @media screen and (min-width: 1024px) {
    padding: 50px;
  }
`;

const ContentsSection = styled.section`
  @media screen and (min-width: 1024px) {
    display: flex;
    align-items: flex-start;
  }
`;

const ContentsWrapper = styled.div`
  @media screen and (min-width: 1024px) {
    width: calc(100% - 220px);
  }
`;

// 본문 내용 영역
const TextContainer = styled.section`
  padding-top: 1.875rem;
`;

const TextArea = styled.div`
  padding: 1.25rem;
  border: 1px solid var(--color-gray);
  border-radius: 0.625rem;
  font-size: 0.875rem;
  line-height: 1.5;
  img {
    width: 100%;
  }
`;

const ModifyButtons = styled.div`
  margin-top: 1.25rem;
  display: flex;
  justify-content: flex-end;
  font-size: 13px;
  a,
  button {
    margin-left: 1rem;
    color: var(--color-black);
  }
`;

export default BoardDetail;
