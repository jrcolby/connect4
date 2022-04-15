import React from 'react'
import ReactDom from 'react-dom'
import {  useEffect, useState } from 'react'
import styles from './Styles.module.css'
import axios from "axios"

const endpoint= 'https://krat.es/f38fc0dd7a39258b9b6e'

export const HighScoresModal = ({gameOver, turnNumber, dispatch, message }) => {
  const [scores, setScores] = useState([])
  const [inputValue, setInputValue] = useState("");
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  
  const handleSubmit = async () => { 
    if (inputValue ==="") return;
    const newScore = {name: inputValue, score:turnNumber} 
    const {data, status} = await axios.post(endpoint, newScore)
    if(status === 200){
      fetchScores()
      //turnNumber = 9999;
    }
    setInputValue("")
    setScoreSubmitted(true);
  }

  const fetchScores = async () => {
    const {data, status} = await axios.get(endpoint )
    if (status === 200){
      // sort the scores from lowest to highest
      const newScores = data.sort((a,b) => a.score - b.score).slice(0,10)
      setScores(newScores)
    }
  }

  const checkNewHighScore = () =>{
    console.log("in check new hs with turnNumber" + turnNumber + " and final score" + scores[scores.length-1])
    if (scores.length < 10 || turnNumber<  scores[scores.length-1].score){
      return true;
    }
    return false;
  }

  useEffect(() => {
    fetchScores();
  },[])

 
  if (!gameOver) return null;
  
  return ReactDom.createPortal (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <div className={ styles.scoreInfo }>
            {message}
              <HighScoreInput inputValue={inputValue}
                            handleSubmit={handleSubmit}
                            setInputValue={setInputValue}
                            newHighScore={checkNewHighScore()}
                            scoreSubmitted={scoreSubmitted}/>
                        
          
          </div>
          <table className={styles.scoreTable}>
            <tbody>
                {scores.map((record)=> (
                  <tr className={styles.scoreRow} key={record._id}>
                    <td className={styles.nameCell}>{record.name}</td>
                    <td className={styles.scoreCell}>{record.score}</td>
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
    </>,
    document.getElementById('portal')
  )
}

const HighScoreInput = ({inputValue, handleSubmit, setInputValue, newHighScore,scoreSubmitted }) =>{
      console.log("highscore input newhs: " + newHighScore);
    
      if (!newHighScore || scoreSubmitted) return null;
         return(
          <div className={styles.highScoreForm}> 
                <p> You got a new high score! </p>
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
