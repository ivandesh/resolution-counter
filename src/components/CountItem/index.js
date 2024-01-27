import React, { useState, useEffect, forwardRef } from 'react';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import './index.css';

const today = new Date().getTime();
const yearStart = new Date(new Date().getFullYear(), 0, 1).getTime();
const yearEnd = new Date(new Date().getFullYear(), 11, 31).getTime();
const secondsInYear = yearEnd - yearStart;
const secondsSinceNewYear = today - yearStart;

const calculateRemainingCount = (timeForOneCount) => {
    return Math.floor(secondsSinceNewYear / timeForOneCount);
}

const calculateTimeToNextReset = (timeForOneCount) => {
    const remainder = secondsSinceNewYear % timeForOneCount;
    const secondsTillReset = timeForOneCount - remainder;
    const daysLeft = Math.floor(secondsTillReset / (24*60*60*1000));
    const daysRem = secondsTillReset % (24*60*60*1000);
    const hoursLeft = Math.floor(daysRem / (60*60*1000));
    console.log(remainder, 'remainder')
    console.log(secondsTillReset, 'secondsTillReset')
    console.log(daysRem, 'daysRem')
    console.log(hoursLeft, 'hoursLeft')

    
    return `${daysLeft} дн ${hoursLeft} год`;
}

export const CountItem = forwardRef(({ id, name, toDo, setData }, ref) => {
    const timeForOneCount = secondsInYear / toDo;
    const countFromStorage = localStorage.getItem(`count-${id}`) || 0
    const [count, setCount] = useState(+countFromStorage - calculateRemainingCount(timeForOneCount));
    const [timeToReset, setTimeToReset] = useState(calculateTimeToNextReset(timeForOneCount));
    const [timeForOne, setTimeForOne] = useState((timeForOneCount / (24*60*60*1000)).toFixed(1));

    useEffect(() => {
        const id = setInterval(() => {
            setCount(+countFromStorage - calculateRemainingCount(timeForOneCount));
            setTimeToReset(calculateTimeToNextReset(timeForOneCount));
            setTimeForOne((timeForOneCount / (24*60*60*1000)).toFixed(1));
        }, 1000*60);

        return () => {
            window.clearInterval(id)
        }
    }, [])

    useEffect(() => {
        setData(data => data.map(item => {
            if (item.id === id) {
                return ({
                    ...item,
                    count,
                })
            } else {
                return item
            }
        }))
    }, [count, id, setData])

    return (
        <div className='count' ref={ref}>
            <div className='count-container'>
                <div className='count-info'>
                    <p className='name'>{name}</p>
                    <p className='count-info-p'>Зробити <b>{toDo}</b> у цьому році</p>
                    <p className='count-info-p'>раз у ~ <b>{timeForOne}</b> днів</p>
                    <p className='count-info-p'>Зроблено <b>{countFromStorage}</b></p>
                </div>
                <div className='count-main'>
                    <div className='count-main-number'>{count}</div>
                    <div className='buttons'>
                        <IconButton onClick={() =>{
                            setCount(count + 1)
                            localStorage.setItem(`count-${id}`, +countFromStorage + 1);
                        } }><AddCircleOutlineIcon /></IconButton>
                        <IconButton onClick={() => {
                            setCount(count - 1)
                            localStorage.setItem(`count-${id}`, +countFromStorage - 1);
                        }}><RemoveCircleOutlineIcon /></IconButton>
                    </div>
                </div>
            </div>
            <div className='count-footer'>
                <p>Залишилось до ресету: {timeToReset}</p>
            </div>
        </div>
    )
})