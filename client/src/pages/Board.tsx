import { useState /*, useEffect*/ } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { styled } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faUtensils, faWheatAwn } from '@fortawesome/free-solid-svg-icons';
// Components
import BoardList from '../components/Board/BoardList.tsx';
// DUMMY DATA
import { BOARD_LISTS } from '../data/boardDummyData.ts';
import { GENDER_TAGS, FOOD_TAGS } from '../constant/constant.ts';

//네이밍 수정 후 디렉토리 분리 관리
export interface IListData {
  questionId: number;
  memberId: number;
  name: string;
  avgStarRate: number;
  viewCount: number;
  commentCount: number;
  status: string;
  category: string;
  title: string;
  createdAt: string;
  image?: string;
  genderTag: {
    genderTagId: number;
  };
  foodTag: {
    foodTagId: number;
  };
}

type Nullable<T> = T | null;

interface IFilterInfo {
  category: string;
  search: string;
  tag: Nullable<number>;
}

interface IStyledProps {
  $isActive: boolean;
}

const Board = () => {
  const navigate = useNavigate();
  // tabMenu active 상태 체크
  const [tabLeft, setTabLeft] = useState<boolean>(true);
  const [tabRight, setTabRight] = useState<boolean>(!tabLeft);
  // 정렬 active 상태 체크
  const [newer, setNewer] = useState<boolean>(true);
  const [mostViewed, setMostViewed] = useState<boolean>(!newer);
  // 태그 active 상태 체크
  const [activeGender, setActiveGender] = useState<number | null>();
  const [activeFood, setActiveFood] = useState<number | null>();
  // 리스트 정렬
  const [lists, setLists] = useState<IListData[]>(BOARD_LISTS);
  // 서버 전달 정보
  const [filterInfo, setFilterInfo] = useState<IFilterInfo>({
    category: '밥먹기',
    search: '',
    tag: null,
  });

  // useEffect(() => {
  //   getTabMenuData();
  // }, []);

  // const getTabMenuData = () => {
  //   axios
  //     .get(`${process.env.REACT_APP_API_URL}/board?page=${1}&size=${10}&category=${밥먹기}`)
  //     .then((res) => {
  //       console.log(res)
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  // const getSearchData = () => {
  //   axios
  //     .get(`${process.env.REACT_APP_API_URL}/board?page=${1}&size=${10}&keyword=${연남동}&category=${장보기}`)
  //     .then((res) => {
  //       console.log(res)
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  // const getGenderTagData = () => {
  //   axios
  //     .get(`${process.env.REACT_APP_API_URL}/board?page=${1}&size=${10}&genderTag=${1}&category=${장보기}`)
  //     .then((res) => {
  //       console.log(res)
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  // const getFoodTagData = () => {
  //   axios
  //     .get(`${process.env.REACT_APP_API_URL}/board?page=${1}&size=${10}&foodTag=${1}&category=${장보기}`)
  //     .then((res) => {
  //       console.log(res)
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  const handleSortByDate = () => {
    setLists(
      lists.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        } else if (a.createdAt < b.createdAt) {
          return 1;
        } else {
          return 0;
        }
      })
    );
  };

  const handleSortByViewed = () => {
    setLists(
      lists.sort((a, b) => {
        if (a.viewCount > b.viewCount) {
          return -1;
        } else if (a.viewCount < b.viewCount) {
          return 1;
        } else {
          return 0;
        }
      })
    );
  };

  // TODO: 임시. 사용자 로그인 상태 가져올 것
  const isLoggedIn = true;
  const handleNavigate = () => {
    if (!isLoggedIn) {
      alert('로그인 후 작성 가능합니다.');
      navigate('/login');
    } else {
      navigate('/board/posts');
    }
  };

  return (
    <>
      {/* 상단 검색, 태그 영역 */}
      <SeachSection>
        <InputArea>
          <Label htmlFor="search">검색</Label>
          <InputSearch
            type="text"
            id="search"
            value={filterInfo.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFilterInfo({ ...filterInfo, search: (e.target as HTMLInputElement).value })
            }
          />
          <ButtonSearch type="button">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </ButtonSearch>
          <TagsArea>
            <TagsRow>
              {GENDER_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  className={activeGender === tag.id ? 'active' : ''}
                  onClick={() => {
                    setActiveGender(tag.id);
                    setActiveFood(null);
                    setFilterInfo({ ...filterInfo, tag: tag.id });
                  }}
                >
                  {tag.text}
                </button>
              ))}
            </TagsRow>
            {tabLeft && (
              <TagsRow>
                {FOOD_TAGS.map((tag) => (
                  <button
                    key={tag.id}
                    className={activeFood === tag.id ? 'active' : ''}
                    onClick={() => {
                      setActiveFood(tag.id);
                      setActiveGender(null);
                      setFilterInfo({ ...filterInfo, tag: tag.id });
                    }}
                  >
                    {tag.text}
                  </button>
                ))}
              </TagsRow>
            )}
          </TagsArea>
        </InputArea>
      </SeachSection>

      <ListLayout>
        {/* 밥먹기, 장보기 탭메뉴 */}
        <TabMenu>
          <TabButton
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              setTabLeft(true);
              setTabRight(false);
              setActiveGender(null);
              setActiveFood(null);
              setFilterInfo({ ...filterInfo, category: (e.target as HTMLButtonElement).value, search: '', tag: null });
            }}
            $isActive={tabLeft}
            value="밥먹기"
          >
            <FontAwesomeIcon icon={faUtensils} /> 밥 먹기
          </TabButton>
          <TabButton
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              setTabLeft(false);
              setTabRight(true);
              setActiveGender(null);
              setActiveFood(null);
              setFilterInfo({ ...filterInfo, category: (e.target as HTMLButtonElement).value, search: '', tag: null });
            }}
            $isActive={tabRight}
            value="장보기"
          >
            <FontAwesomeIcon icon={faWheatAwn} /> 장 보기
          </TabButton>
        </TabMenu>

        {/* 게시판 영역 */}
        <ListsSection>
          <ListTop>
            <ListH2>게시판</ListH2>
            <button onClick={() => handleNavigate()}>글 작성</button>
          </ListTop>
          <SortedArea>
            <SortedButton
              onClick={() => {
                setNewer(true);
                setMostViewed(false);
                handleSortByDate();
              }}
              $isActive={newer}
            >
              최신순
            </SortedButton>
            <SortedButton
              onClick={() => {
                setNewer(false);
                setMostViewed(true);
                handleSortByViewed();
              }}
              $isActive={mostViewed}
            >
              조회수
            </SortedButton>
          </SortedArea>
          <BoardListsArea>
            {/* 게시글 mapping */}
            {lists.map((list, idx) => (
              <BoardList key={idx} list={list} />
            ))}
          </BoardListsArea>
        </ListsSection>
      </ListLayout>
    </>
  );
};

const SeachSection = styled.section`
  width: 100%;
  height: 200px;
  padding: 0 1.875rem;
  background-image: url('../../public/img/background_grocery.jpg');
  background-color: rgba(0, 0, 0, 0.3);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-blend-mode: multiply;
  @media screen and (min-width: 768px) {
    height: 300px;
  }
`;

const InputArea = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding-top: 3.125rem;
  @media screen and (min-width: 768px) {
    padding-top: 100px;
  }
`;

const Label = styled.label`
  display: none;
`;

const InputSearch = styled.input`
  width: 100%;
  padding-left: 10px;
  padding-right: 36px;
  height: 2.25rem;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  font-size: 0.875rem;
  box-sizing: border-box;
`;

const ButtonSearch = styled.button`
  position: absolute;
  right: 0;
  top: 3.125rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.25rem;
  height: 2.25rem;
  color: var(--color-black);
  @media screen and (min-width: 768px) {
    top: 100px;
  }
`;

const TagsArea = styled.ul`
  /* margin: 0 auto; */
`;

const TagsRow = styled.li`
  width: fit-content;
  margin: 0.625rem auto 0;
  button {
    margin-right: 0.625rem;
    padding: 5px;
    background-color: #ffffff;
    border-radius: 5px;
    font-size: 0.875rem;
    font-weight: 700;
    color: #000000;
    cursor: pointer;
    &.active {
      background-color: var(--color-orange);
      color: #ffffff;
    }
  }
`;

const ListLayout = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  @media screen and (min-width: 1024px) {
    display: flex;
  }
`;

const TabMenu = styled.nav`
  @media screen and (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    width: 200px;
    padding-top: 3.125rem;
    border-right: 1px solid var(--color-gray);
  }
`;

const TabButton = styled.button<IStyledProps>`
  width: 50%;
  height: 2.5rem;
  background-color: ${(props) => (props.$isActive ? '#F0930D' : '#F4F2EF')};
  color: ${(props) => (props.$isActive ? '#ffffff' : '#000000')};
  @media screen and (min-width: 1024px) {
    width: 100%;
    height: 2.5rem;
  }
`;

const ListsSection = styled.section`
  width: 100%;
  padding: 1.875rem;
  @media screen and (min-width: 768px) {
    padding: 5rem;
  }
  @media screen and (min-width: 1024px) {
    padding: 5rem 3.125rem;
  }
`;

const ListTop = styled.div`
  display: flex;
  justify-content: space-between;
  button {
    padding: 0.5rem;
    background-color: var(--color-white);
    border-radius: 5px;
    font-size: 0.875rem;
    &:hover,
    &:active {
      background-color: var(--color-orange);
      color: var(--color-white);
    }
  }
`;

const ListH2 = styled.h2`
  font-family: 'NanumSquare', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  @media screen and (min-width: 1024px) {
    font-size: 1.25rem;
  }
`;

const SortedArea = styled.div`
  margin: 1.25rem 0;
  @media screen and (min-width: 1024px) {
    margin: 1.875rem 0;
  }
`;

const SortedButton = styled.button<IStyledProps>`
  margin-right: 0.625rem;
  padding: 5px;
  background-color: ${(props) => (props.$isActive ? '#F0930D' : '#F4F2EF')};
  border-radius: 5px;
  color: ${(props) => (props.$isActive ? '#ffffff' : '#000000')};
  font-size: 0.75rem;
  &:hover,
  &:active {
    background-color: var(--color-orange);
    color: var(--color-white);
  }
  @media screen and (min-width: 1024px) {
    padding: 0.5rem;
    font-size: 13px;
  }
`;

const BoardListsArea = styled.ul``;

export default Board;
