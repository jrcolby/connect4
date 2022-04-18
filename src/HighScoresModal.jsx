import React from 'react'
import ReactDom from 'react-dom'
import {  useEffect, useState } from 'react'
import styles from './Styles.module.css'
import axios from "axios"
const endpoint= 'https://krat.es/2b973f81f8788509eaa1'

// https://krat.es/ed9c524c7b801cfb9f6a final endpoint
export const HighScoresModal = ({gameOver, turnNumber, dispatch, message }) => {
  const [scores, setScores] = useState([])
  const [inputValue, setInputValue] = useState("");
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [sliderVis, setSlider] = useState(false)

  const showSidebar = () => setSlider(!sliderVis)
  
  const handleSubmit = async () => { 
    if (inputValue ==="") return;
    const newScore = {name: inputValue, score:turnNumber} 
    const {data, status} = await axios.post(endpoint, newScore)
    if(status === 200){
      fetchScores()
    }
    setScoreSubmitted(true);
    setInputValue("");
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
    if (scores.length < 10 || turnNumber<  scores[scores.length-1].score){
      return true;
    }
    return false;
  }

  useEffect(() => {
    fetchScores();
  },[])

 
   
  return ReactDom.createPortal (
    <>
      <div className={gameOver ? styles.modalOverlay : styles.modalOverlayInactive}>
        <div className={!gameOver ? styles.modalSlider : styles.modalSliderActive}>
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
            <button className={styles.greenButton}
              onClick={() => {
                dispatch({ type: 'newGame'})
                setScoreSubmitted(false)
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
    
      if (!newHighScore || scoreSubmitted) return null;
         return(
          <div className={styles.highScoreForm}> 
                <p> You got a new high score! </p>
            <input className={styles.nameInput}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={"Enter name here!"}
            />
            <button
            onClick={handleSubmit}
            className={styles.greenButton}>
              Submit Name
            </button>
          </div>
  )
}
