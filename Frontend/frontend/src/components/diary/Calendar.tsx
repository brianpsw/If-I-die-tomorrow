import { useState, useEffect } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { useRecoilState } from 'recoil';
import { calendarState } from '../../states/CalendarState';
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
  setPrevSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  setPrevSelectedMonth: React.Dispatch<React.SetStateAction<Date>>;
  diarys: Diary[];
  setSameDay: React.Dispatch<React.SetStateAction<boolean>>;
}

const Calendar = ({ showDetailsHandle, diarys, setSameDay }: Props) => {
  let koreaDays = ['월', '화', '수', '목', '금', '토', '일'];
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateFormat = 'yyyy.MM';

  useEffect(() => {
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
      console.log(currentMonth);
    }
    if (btnType === 'next') {
      setCurrentMonth(addWeeks(currentMonth, 1));
      console.log(currentMonth);
    }
  };

  const onDateClickHandle = (day: Date) => {
    setSelectedDate(day);
    console.log(day);
    console.log(selectedDate);
    if (typeof diarys === 'object') {
      const diary = diarys.find((diary) => {
        const createdAtDate: Date = new Date(diary.createdAt);
        return isSameDay(day, createdAtDate);
      });
      const today = new Date();
      if (isSameDay(today, day)) {
        setSameDay(true);
      } else {
        setSameDay(false);
      }

      showDetailsHandle(diary ? diary : null);
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
        return diary ? '#36C2CC' : '';
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
    </CalenderContainer>
  );
};

export default Calendar;
