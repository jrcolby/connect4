import { useReducer, } from 'react'
import { Row } from './Row'
import {HighScoresModal} from './HighScoresModal'
import styles from './Styles.module.css'

function initBoard() {
	return Array(6).fill().map(arr => Array(7).fill(null));
}

function initHoverRow() {
  return Array(7).fill(0);
}

// functions for check(ng for win conditions in four directions
// vertical ins can only start on rows > 3
const checkVert = (board) => {
	for (let r = 3; r < 6; r++) {
		for (let c = 0; c < 7; c++) {
			if (board[r][c]) {
				if (
					board[r][c] === board[r - 1][c] &&
					board[r][c] === board[r - 2][c] &&
					board[r][c] === board[r - 3][c]
				) {
					return board[r][c];
				}
			}
		}
	}
}; 

//horizontal wins can only start at cols < 3
const checkHoriz = (board) => {

	for (let r = 0; r < 6; r++) {
		for (let c = 0; c < 4; c++) {
			if (board[r][c]) {
				if (
					board[r][c] === board[r][c + 1] &&
					board[r][c] === board[r][c + 2] &&
					board[r][c] === board[r][c + 3]
				) {
					return board[r][c];
				}
			}
		}
	}
};

// diagonal right wins can only start at row >3 and col < 3
const checkDiagRight = (board) => {

	for (let r = 3; r < 6; r++) {
		for (let c = 0; c < 4; c++) {
			if (board[r][c]) {
				if (
					board[r][c] === board[r - 1][c + 1] &&
					board[r][c] === board[r - 2][c + 2] &&
					board[r][c] === board[r - 3][c + 3]
				) {
					return board[r][c];
				}
			}
		}
	}
};

// diagonal left can only start at row > 3 and col < 3
const checkDiagLeft = (board) => {

	for (let r = 3; r < 6; r++) {
		for (let c = 3; c < 7; c++) {
			if (board[r][c]) {
				if (
					board[r][c] === board[r - 1][c + 1] &&
					board[r][c] === board[r - 2][c + 2] &&
					board[r][c] === board[r - 3][c + 3]
				) {
					return board[r][c];
				}
			}
		}
	}
};

// if no null remains, board is full, it's a draw
const checkDraw = (board) => {
	for (let r = 0; r < 6; r++) {
		for (let c = 0; c < 7; c++) {
			if (board[r][c] === null) {
				return null
			}
		};
	}
	return 'draw'
};


// check all win conditions
const checkWin = (board) => {
	return (
		checkVert(board)
		|| checkHoriz(board)
		|| checkDiagRight(board)
		|| checkDiagLeft(board)
		|| checkDraw(board)
	)
};

const reducer = (state, action) => {
	switch (action.type) {

    case 'hover':
      return{
        ...state,
        hoverRow: action.hoverRow,
      }

		case 'newGame':
			return {
				...initialState,
			}

		case 'togglePlayer':
			return {
				...state,
				currentPlayer: action.nextPlayer,
				board: action.board,
        message: action.message,
        turnNumber: action.newTurn,
			}

		case 'endGame':
			return {
				...state,
				gameOver: true,
				message: action.message,
				board: action.board
			}

		case 'updateMessage':
			return {
				...state,
				message: action.message,
			}
		default:
			throw Error('$"{action.type}" is not a valid action');
	}
};


const cloneBoard = (board) => [
	[...board[0]],
	[...board[1]],
	[...board[2]],
	[...board[3]],
	[...board[4]],
	[...board[5]],
]


const initialState = {
	player1: 1,
	player2: 2,
	currentPlayer: 1,
  turnNumber: 1,
	board: initBoard(),
  hoverRow: initHoverRow(),
	gameOver: false,
	message: 'Connect Four!'
};

function App() {
	const [state, dispatch] = useReducer(reducer, initialState);

  const toggleDisc = (col) =>{

    let row = [...state.hoverRow]

    if (!state.gameOver){
        if (!row[col]) {
          row[col] = state.currentPlayer;
        }else{
          row[col] = 0;
        }
      dispatch({
        type: 'hover',
        hoverRow: row,
      })
    }

    console.log(state.hoverRow)
  }

  const clearHoverRow = () =>{
    if (!state.gameOver){
      dispatch({
        type: 'hover',
        hoverRow: [0,0,0,0,0,0,0],
      })
    }
    console.log(state.hoverRow)
  }

	const play = (col) => {
		let board = cloneBoard(state.board)
    clearHoverRow();

		if (!state.gameOver) {
			// check for first free position in clicked column
			for (let row = 5; row >= 0; row--) {
				if (!board[row][col]) {
					board[row][col] = state.currentPlayer
					break
				}
			}

			let result = checkWin(board) //check for wins
			if (result === state.player1) {
				dispatch({
					type: 'endGame',
					message: 'Orange Player Wins!',
					board,
				});
			} else if (result === state.player2) {
				dispatch({
					type: 'endGame',
					message: 'Green Player Wins!',
					board,
				});
			} else if (result === 'draw') {
				dispatch({
					type: 'endGame',
					message: 'Draw Game!',
					board,
				});
			} else {  // if no win conditions met, just a normal move, start next players turn
				const nextPlayer =
					state.currentPlayer === state.player1
						? state.player2
						: state.player1

        const newTurn = state.turnNumber +1;

				dispatch({ 
          type: 'togglePlayer',
          nextPlayer,
          board,
          newTurn,
          message: nextPlayer === 1 ? "Orange Player Turn" :"Green Player Turn",
          })
        console.log(state.message)
			}
		}else{
			dispatch({
				type: 'updateMessage',
				message: 'Game Over.'
			})
		}
	};


  let debug = false;
	return (
		<div className="App">

			<div className={styles.mainContainer}>
    
      <div className={styles.headerDiv}>
          <HeaderText message={state.message} />
      </div>

        
        <table className={styles.hoverDiscTable}>
          <tbody className={styles.hoverDiscTableBody}>
            <tr className={styles.hoverDiscRow}>
            {state.hoverRow.map((cell, i) => (
              <HoverCell key={i} value={cell}/>
            ))}
            </tr>
          </tbody>
        </table>

      <div className={styles.boardContainer}>
          <table className={styles.boardTable}>
            <tbody className={styles.boardTableBody}>
              {state.board.map((row, i) => (
                <Row key={i} rowIndex={i} row={row} play={play} toggleDisc={toggleDisc} clearHoverRow={clearHoverRow} />
              ))}
            </tbody>
          </table>
      </div>

      <button className={styles.redButton}
        onClick={() => {
          dispatch({ type: 'newGame'})
        }}
      > Reset Game
      </button>

        <HighScoresModal gameOver={state.gameOver}
                        turnNumber={state.turnNumber}
                        dispatch={dispatch}
                        message={state.message}/>
			</div>

        {debug &&
          <>
        <button  className={styles.redButton}
          onClick={() => {
            dispatch({type:'endGame', board:state.board})
          }}>
          debug modal open
				</button>
        </>
    }
		</div>
	);
}

const HoverCell = ({value}) =>{

	let color = 'blankCircle';
	if (value === 1) { color = 'oneCircle' }
	else if (value === 2) { color = 'twoCircle' }

  return(
		<td className={styles.cellContainer}
    >
			<div className={styles.hoverDiscCellBlock} >
				<div className={styles[color]}> </div>
			</div>
		</td>
  )
}

const HeaderText = ({message}) => {
  let headerStyle = styles.headerText

  switch (message) {
    case "Orange Player Turn":
      headerStyle = styles.orangeHeader
      break;

    case "Green Player Turn":
      headerStyle = styles.greenHeader
      break;

    default:
      break;
  }

  return(
    <>
    <h1 className={headerStyle}>{message}</h1>
    </>
  )
}
export default App;
