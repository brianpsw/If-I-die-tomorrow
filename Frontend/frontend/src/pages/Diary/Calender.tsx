import { useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import {
  format,
  subMonths,
  addMonths,
  startOfWeek,
  addDays,
  isSameDay,
  lastDayOfWeek,
  getWeek,
  addWeeks,
  subWeeks,
} from 'date-fns';

const CalenderContainer = styled.div`
  ${tw`flex flex-col w-full bg-gray-100/80 mt-4 pt-4 px-4`}
`;
interface Props {
  showDetailsHandle: (dayStr: string) => void;
}

const Calendar = ({ showDetailsHandle }: Props) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<number>(getWeek(currentMonth));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const changeMonthHandle = (btnType: 'prev' | 'next') => {
    if (btnType === 'prev') {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
    if (btnType === 'next') {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  const changeWeekHandle = (btnType: 'prev' | 'next') => {
    if (btnType === 'prev') {
      setCurrentMonth(subWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(subWeeks(currentMonth, 1)));
    }
    if (btnType === 'next') {
      setCurrentMonth(addWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(addWeeks(currentMonth, 1)));
    }
  };

  const onDateClickHandle = (day: Date, dayStr: string) => {
    setSelectedDate(day);
    showDetailsHandle(dayStr);
  };

  const renderHeader = () => {
    const dateFormat = 'yyyy MM';
    return (
      <div className="header row flex-middle">
        <div className="icon" onClick={() => changeWeekHandle('prev')}>
          prev week
        </div>
        <span>{format(currentMonth, dateFormat)}</span>
        <div className="col col-end" onClick={() => changeWeekHandle('next')}>
          <div className="icon">next week</div>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = 'EEE';
    const days: JSX.Element[] = [];
    let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>,
      );
    }
    return <div className="days row">{days}</div>;
  };

  const renderCells = () => {
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
          <div
            className={`col cell ${
              isSameDay(day, new Date())
                ? 'today'
                : isSameDay(day, selectedDate)
                ? 'selected'
                : ''
            }`}
            key={day.getTime()}
            onClick={() => {
              const dayStr = format(cloneDay, 'ccc dd MMM yy');
              onDateClickHandle(cloneDay, dayStr);
            }}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
          </div>,
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div className="row" key={day.getTime()}>
          {days}
        </div>,
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  return (
    <CalenderContainer className="calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </CalenderContainer>
  );
};

export default Calendar;
