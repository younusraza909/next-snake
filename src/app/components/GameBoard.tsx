'use client';
import { FC, useEffect, useState } from 'react';

interface GameBoardProps {}

const GameBoard: FC<GameBoardProps> = ({}) => {
    // Game Board Size
    const GRID_SIZE = 20;

    // Get Random cell for food

    const getRandomCell = () => {
        return {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
        };
    };
    const [food, setFood] = useState({ x: -1, y: -1 });
    useEffect(() => {
        setFood(getRandomCell);
    }, []);
    // Game States
    const [snake, setSnake] = useState([
        { x: GRID_SIZE / 2, y: GRID_SIZE / 2 },
        { x: GRID_SIZE / 2, y: GRID_SIZE / 2 + 1 },
    ]);
    const [direction, setDirection] = useState('LEFT');
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    // Adding Cooldown
    const [cooldown, setCooldown] = useState(false);

    // Handle Keyboard Function
    const handleKeyPress = (e: KeyboardEvent) => {
        if (!cooldown) {
            switch (e.key) {
                case 'ArrowUp':
                    if (direction != 'DOWN') setDirection('UP');
                    break;
                case 'ArrowRight':
                    if (direction != 'LEFT') setDirection('RIGHT');
                    break;
                case 'ArrowDown':
                    if (direction != 'UP') setDirection('DOWN');
                    break;
                case 'ArrowLeft':
                    if (direction != 'RIGHT') setDirection('LEFT');
                    break;
            }
        }
        setCooldown(true);
        setTimeout(() => setCooldown(false), 100);
    };

    // Eat Food
    const ateFood = () => {
        if (snake[0].x == food.x && snake[0].y == food.y) {
            setFood(getRandomCell());
            setSnake((prevSnake) => {
                return [
                    { x: prevSnake[0].x, y: prevSnake[0].y - 1 },
                    ...prevSnake,
                ];
            });
        }
    };

    // Move Snake Function
    const updateGame = () => {
        // Check Game Over
        if (
            snake[0].x < 0 ||
            snake[0].y < 0 ||
            snake[0].x >= 20 ||
            snake[0].y >= 20
        ) {
            setGameOver(true);
        }

        // Move snake
        let newSnake = [...snake];
        if (direction === 'UP') {
            newSnake.unshift({ x: snake[0].x, y: snake[0].y - 1 });
        } else if (direction === 'DOWN') {
            newSnake.unshift({ x: snake[0].x, y: snake[0].y + 1 });
        } else if (direction === 'LEFT') {
            newSnake.unshift({ x: snake[0].x - 1, y: snake[0].y });
        } else if (direction === 'RIGHT') {
            newSnake.unshift({ x: snake[0].x + 1, y: snake[0].y });
        }

        if (newSnake[0].x === food.x && newSnake[0].y === food.y) {
            // ATE FOOD
            setFood(getRandomCell());
            setScore((prev) => prev + 1);
            setSnake(newSnake);
        } else {
            // WITHOUT FOOD
            newSnake.pop();
            setSnake(newSnake);
        }
    };

    // Handle Keystroke
    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    });

    // Move Snake
    useEffect(() => {
        if (!gameOver) {
            const moveSnake = setInterval(updateGame, 50);
            return () => clearInterval(moveSnake);
        }
    });

    // Generate Grid
    const renderGrid = () => {
        const cells = [];
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                // Render Snake
                const isSnake = snake.some(
                    (segment) => segment.x === col && segment.y === row
                );

                // Render Food
                const isFood = food.x === col && food.y === row;
                let cellClass = 'cell';
                if (isSnake) {
                    cellClass += ' snake';
                }
                if (isFood) {
                    cellClass += ' food';
                }
                cells.push(
                    <div key={`${row}-${col}`} className={cellClass}></div>
                );
            }
        }
        return cells;
    };

    return (
        <div className="flex flex-col ">
            Score : {score}
            <div className="grid game-board">{renderGrid()}</div>
        </div>
    );
};

export default GameBoard;
