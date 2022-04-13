import React from 'react'
import ReactDom from 'react-dom'
import {  useEffect, useState } from 'react'
import styles from './Styles.module.css'
import axios from "axios"

const endpoint= 'https://krat.es/53a268471af10ef8b374'


export const HighScoresModal = ({gameOver, turnNumber, dispatch, message }) => {
  const [scores, setScores] = useState([])
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async () => { 
    if (inputValue ==="") return;
    const newScore = {name: inputValue, score:turnNumber} 
    const {data, status} = await axios.post(endpoint, newScore)
    if(status === 200){
      fetchScores()
    }
    setInputValue("")
  }

  const checkNewHighScore= (scores) =>{
      if (scores.length <= 10) {
      return true;
    }
      scores.forEach(score =>{
        if (turnNumber < score) return true;
    })
    return false;
  }
  const fetchScores = async () => {
    const {data, status} = await axios.get(endpoint )
    if (status === 200){
      // sort the scores from lowest to highest
      const newScores = data.sort((a,b) => a.score - b.score).slice(0,9)
      setScores(newScores)
    }

  }
  useEffect(() => {
    fetchScores();
    console.log("initial modal mount")
  },[])

  if (!gameOver) return null;
  let newHighScore = (checkNewHighScore(scores))
  //console.log(newHighScore)
  return ReactDom.createPortal (
    // enter name on high score form div
    // non high score or draw info div
    // actual top 10 sores
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <div className="scoreInfo">
            {message}
            {console.log(newHighScore)}
            {newHighScore &&
              <HighScoreInput inputValue={inputValue}
                            handleSubmit={handleSubmit}
                            setInputValue={setInputValue} />
          }
          <table>
            <tbody>
                {scores.map((record)=> (
                  <tr key={record._id}>
                    <td>{record.name}</td>
                    <td>{record.score}</td>
                  </tr>
                ))}
            </tbody>
          </table>
            <button
              onClick={() => {
                dispatch({ type: 'newGame'})
              }}
            > Play again?
            </button>
          </div>
        </div>
      </div>
    </>,
    document.getElementById('portal')
  )
}

const HighScoreInput = ({inputValue, handleSubmit, setInputValue}) =>{
         return( 
          <div className="highscoreForm">
            <input 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={"Enter name here!"}
            />
            <button
            onClick={handleSubmit}
            className="submit">
              submit name
            </button>
          </div>
  )
}
