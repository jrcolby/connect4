import styles from './Styles.module.css'

export const Row = ({ row, play }) => {
	return (
		<tr className={styles.boardRow}>
			{row.map((cell, i) => (
				<Cell key={i} value={cell} columnIndex={i} play={play} />
			))}
		</tr>
	)
}


const Cell = ({ value, columnIndex, play }) => {
	let color = 'blankCircle';

	if (value === 1) { color = 'oneCircle' }
	else if (value === 2) { color = 'twoCircle' }

	return (
		<td className={styles.cellContainer}>
			<div className={styles.cellBlock}
				onClick={() => {
					play(columnIndex)
				}}
			>
				<div className={styles[color]}> </div>
			</div>
		</td>
	)
}

