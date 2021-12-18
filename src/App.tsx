import React, { useEffect, useRef, useState } from "react"
import "./App.css"
import GemSymbol from "./Gem.png"
import useInterval from "./interval"

const canvasX = 1000
const canvasY = 1000
const initialDragon = [ [ 5, 10 ], [ 5, 10 ] ]
const initialGem = [ 14, 10 ]
const scale = 50
const timeDelay = 100

function App() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const [ dragon, setDragon ] = useState(initialDragon)
	const [ gem, setGem ] = useState(initialGem)
	const [ direction, setDirection ] = useState([ 0, -1 ])
	const [ delay, setDelay ] = useState<number | null>(null)
	const [ gameOver, setGameOver ] = useState(false)
	const [ score, setScore ] = useState(0)


	useInterval(() => runGame(), delay)

	useEffect(
		() => {
			let Gem = document.getElementById("gem") as HTMLCanvasElement
			if (canvasRef.current) {
				const canvas = canvasRef.current
				const ctx = canvas.getContext("2d")
				if (ctx) {
					ctx.setTransform(scale, 0, 0, scale, 0, 0)
					ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
					ctx.fillStyle = "#18d907"
					dragon.forEach(([ x, y ]) => ctx.fillRect(x, y, 1, 1))
					ctx.drawImage(Gem, gem[0], gem[1], 1, 1)
				}
			}
		},
		[ dragon, gem, gameOver ]
	)

	function handleSetScore() {
		if (score > Number(localStorage.getItem("gemScore"))) {
			localStorage.setItem("gemScore", JSON.stringify(score))
		}
	}

	function play() {
		setDragon(initialDragon)
		setGem(initialGem)
		setDirection([ 1, 0 ])
		setDelay(timeDelay)
		setScore(0)
		setGameOver(false)
	}

	function checkCollision(head: number[]) {
		for (let i = 0; i < head.length; i++) {
			if (head[i] < 0 || head[i] * scale >= canvasX) return true
		}
		for (const s of dragon) {
			if (head[0] === s[0] && head[1] === s[1]) return true
		}
		return false
	}

	function gemGet(newDragon: number[][]) {
		let coord = gem.map(() => Math.floor(Math.random() * canvasX / scale))
		if (newDragon[0][0] === gem[0] && newDragon[0][1] === gem[1]) {
			let newGem = coord
			setScore(score + 1)
			setGem(newGem)
			return true
		}
		return false
	}

	function runGame() {
		const newDragon = [ ...dragon ]
		const newDragonPiece = [ newDragon[0][0] + direction[0], newDragon[0][1] + direction[1] ]
		newDragon.unshift(newDragonPiece)
		if (checkCollision(newDragonPiece)) {
			setDelay(null)
			setGameOver(true)
			handleSetScore()
		}
		if (!gemGet(newDragon)) {
			newDragon.pop()
		}
		setDragon(newDragon)
	}

	function changeDirection(e: React.KeyboardEvent<HTMLDivElement>) {
		switch (e.key) {
			case "a":
				setDirection([ -1, 0 ])
				break
			case "w":
				setDirection([ 0, -1 ])
				break
			case "d":
				setDirection([ 1, 0 ])
				break
			case "s":
				setDirection([ 0, 1 ])
				break
		}
	}

	return (
		<div onKeyDown={(e) => changeDirection(e)}>
			<img id="gem" src={GemSymbol} alt="gem" width="30" />
			<canvas className="playArea" ref={canvasRef} width={`${canvasX}px`} height={`${canvasY}px`} />
			{gameOver && <div className="gameOver">Game Over</div>}
			<div className="title">Gem Hunter</div>
			<button onClick={play} className="playButton">Start</button>
			<div className="scoreBox">
				<h2>Score: {score}</h2>
				<h2>Best Score: {localStorage.getItem("gemScore")}</h2>
			</div>
			<div className="keyLegend">
				<h2>w: up</h2>
				<h2>s: down</h2>
				<h2>a: left</h2>
				<h2>d: right</h2>
			</div>
		</div>
	)
}

export default App
