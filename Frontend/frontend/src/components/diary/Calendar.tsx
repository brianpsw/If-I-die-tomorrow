import { useState, useEffect } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import EmptyAlert from '../common/EmptyAlert';
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  lastDayOfWeek,
  addWeeks,
  subWeeks,
} from 'date-fns';

import NextVector from '../../assets/icons/next_vector.svg';
import PreviousVector from '../../assets/icons/previous_vector.svg';
const CalenderContainer = styled.div`
  ${tw`flex flex-col w-full text-p1 rounded-lg bg-gray-100/80 mt-[16px] py-[16px] px-[16px]`}
  box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.25);
`;
const CalenderHeader = styled.div`
  ${tw`flex items-center justify-between`}
`;
const CalenderDaysContainer = styled.div`
  ${tw`flex items-center justify-between`}
`;
const DaysCellContainer = styled.div`
  ${tw`flex text-center justify-center flex-grow max-w-[90vw]`}
`;
const CalenderDateContainer = styled.div`
  ${tw`flex items-center justify-between`}
`;
const DateCellContainer = styled.div`
  ${tw`flex text-center justify-center flex-grow max-w-[90vw]`}
`;
interface Diary {
  diaryId: number;
  title: string;
  content: string;
  imageUrl: string;
  secret: boolean;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
}

interface Props {
  showDetailsHandle: (diaryData: Diary | null) => void;
  diarys: Diary[];
  setSameDay: React.Dispatch<React.SetStateAction<boolean>>;
}

const Calendar = ({ showDetailsHandle, diarys, setSameDay }: Props) => {
  let koreaDays = ['월', '화', '수', '목', '금', '토', '일'];
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateFormat = 'yyyy.MM';
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [showEmptyAlert, setShowEmptyAlert] = useState(false);

  useEffect(() => {
    if (isFirstRender === false) {
      const today = new Date();
      if (typeof diarys === 'object') {
        const diary = diarys.find((diary) =>
          isSameDay(today, new Date(diary.createdAt)),
        );
        setSameDay(true);
        if (diary) {
          setSelectedDate(new Date(diary.createdAt));
          showDetailsHandle(diary);
        } else {
          showDetailsHandle(null);
        }
      }
    }
    setIsFirstRender(false);
  }, [diarys]);

  // useEffect(() => {
  //   if (calendarData?.clickedDate) {
  //     onDateClickHandle(calendarData?.clickedDate);
  //   }
  //   if (calendarData?.clickedMonth) {
  //     setCurrentMonth(calendarData?.clickedMonth);
  //   }
  // }, []);

  const changeWeekHandle = (btnType: 'prev' | 'next') => {
    if (btnType === 'prev') {
      setCurrentMonth(subWeeks(currentMonth, 1));
    }
    if (btnType === 'next') {
      setCurrentMonth(addWeeks(currentMonth, 1));
    }
  };

  const onDateClickHandle = (day: Date) => {
    const today = new Date();

    // 선택된 날짜가 오늘이고 다이어리가 없는 경우에만 다이어리 작성폼을 보여주기
    if (isSameDay(day, today)) {
      const diaryExists = diarys.find((diary) =>
        isSameDay(today, new Date(diary.createdAt)),
      );

      if (!diaryExists) {
        setSameDay(true);
        setShowEmptyAlert(false);
        showDetailsHandle(null);
      } else {
        setSameDay(false);
        showDetailsHandle(diaryExists);
        setShowEmptyAlert(false);
      }
      return;
    }

    // 선택된 날짜가 미래의 날짜라면, 모든 것을 숨김
    if (day > today) {
      setSameDay(false);
      setShowEmptyAlert(false);
      showDetailsHandle(null);
      return;
    }

    setSelectedDate(day);

    if (typeof diarys === 'object') {
      const diary = diarys.find((diary) => {
        const createdAtDate: Date = new Date(diary.createdAt);
        return isSameDay(day, createdAtDate);
      });

      setSameDay(false);

      // diary가 있으면 상세 정보를 보여주고, 그렇지 않으면 EmptyAlert를 보여줌
      if (diary) {
        showDetailsHandle(diary);
        setShowEmptyAlert(false); // diary가 있으면 EmptyAlert를 숨김
      } else {
        showDetailsHandle(null);
        setShowEmptyAlert(true); // diary가 없으면 EmptyAlert를 보여줌
      }
    }
  };

  const renderDays = () => {
    const days: JSX.Element[] = [];
    let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <DaysCellContainer key={i}>
          {format(addDays(startDate, i), koreaDays[i])}
        </DaysCellContainer>,
      );
    }
    return <CalenderDaysContainer>{days}</CalenderDaysContainer>;
  };

  const renderCells = () => {
    const getCellBackgroundColor = (day: Date) => {
      if (typeof diarys === 'object') {
        const diary = diarys.find((diary) =>
          isSameDay(day, new Date(diary.createdAt)),
        );
        return diary && !isSameDay(day, new Date()) ? '#36C2CC' : '';
      }
    };
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 1 });
    const dateFormat = 'd';
    const rows: JSX.Element[] = [];
    let days: JSX.Element[] = [];
    let day = startDate;
    let formattedDate = '';
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;

        days.push(
          <DateCellContainer
            className={`flex w-1/7 cell ${
              isSameDay(day, new Date())
                ? 'today'
                : isSameDay(day, selectedDate)
                ? 'selected'
                : ''
            }`}
            style={{ backgroundColor: getCellBackgroundColor(day) }}
            key={day.getTime()}
            onClick={() => {
              setSelectedDate(cloneDay);
              onDateClickHandle(cloneDay);
            }}
          >
            <span className="absolute text-p4 font-bold top-[10px] self-center">
              {formattedDate}
            </span>
          </DateCellContainer>,
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div className="flex w-[100%]" key={day.getTime()}>
          {days}
        </div>,
      );
      days = [];
    }
    return (
      <CalenderDateContainer className="body">{rows}</CalenderDateContainer>
    );
  };

  return (
    <CalenderContainer>
      <CalenderHeader>
        <img
          src={PreviousVector}
          onClick={() => changeWeekHandle('prev')}
          alt="prev_icon"
        />
        <span>{format(currentMonth, dateFormat)}</span>
        <img
          src={NextVector}
          onClick={() => changeWeekHandle('next')}
          alt="next_icon"
        />
      </CalenderHeader>
      {renderDays()}
      {renderCells()}
      {showEmptyAlert && (
        <div
          className="text-smT mt-[5vh] bg-gray-100/70 p-[16px] rounded-[10px] shadow"
          style={{ boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.25)' }}
        >
          <EmptyAlert text={`생성된 다이어리가 없습니다.`} />
        </div>
      )}
    </CalenderContainer>
  );
};

export default Calendar;
