import styles from './Styles.module.css'

export const Row = ({ rowIndex, row, play, toggleDisc, clearHoverRow }) => {
  return (
    <tr className={styles.boardRow}>
      {row.map((cell, i) => (
        <Cell
          key={i}
          rowIndex={rowIndex}
          value={cell}
          columnIndex={i}
          play={play}
          toggleDisc={toggleDisc}
          clearHoverRow={clearHoverRow}
        />
      ))}
    </tr>
  )
}

const Cell = ({
  value,
  columnIndex,
  play,
  rowIndex,
  toggleDisc,
  clearHoverRow,
}) => {
  let color = 'blankCircle'
  if (value === 1) {
    color = 'oneCircle'
  } else if (value === 2) {
    color = 'twoCircle'
  }

  let cellStyle = styles.cellBlock

  if (rowIndex === 0 && columnIndex === 0) cellStyle = styles.topLeftCell
  if (rowIndex === 5 && columnIndex === 0) cellStyle = styles.bottomLeftCell
  if (rowIndex === 0 && columnIndex === 6) cellStyle = styles.topRightCell
  if (rowIndex === 5 && columnIndex === 6) cellStyle = styles.bottomRightCell

  return (
    <td className={styles.cellContainer}>
      <div
        className={cellStyle}
        onClick={() => {
          play(columnIndex)
        }}
      >
        <div
          className={styles[color]}
          onMouseEnter={() => {
            toggleDisc(columnIndex)
          }}
          onMouseOut={() => {
            clearHoverRow()
          }}
        >
          {' '}
        </div>
      </div>
    </td>
  )
}
