import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { Typography, Box, Button, Card, CardContent, CardActions  } from '@mui/material';
import { PhaserGame } from "./game/game"
import { Navigate } from "react-router-dom";
import { booleanSetState, getAuthToken } from "./utils/constants";
import { MatchContext } from './context/MatchContext';
import axios from "axios";

const player1NameStyle = {
	fontSize: '6vh',
	fontFamily: 'Orbitron',
	fontWeight: 500,
	color: '#FFFFFF',
	textShadow: '0px 0px 6px #FFFFFF',
	margin: '2vh',
	top: '2%',
	right: '55%',
	position: 'fixed'
}

const player2NameStyle = {
	fontSize: '6vh',
	fontFamily: 'Orbitron',
	fontWeight: 500,
	color: '#FFFFFF',
	textShadow: '0px 0px 6px #FFFFFF',
	margin: '2vh',
	top: '2%',
	left: '55%',
	position: 'fixed'
}

const player1Score = {
	fontSize: '14vh',
	fontFamily: 'Orbitron',
	fontWeight: 500,
	color: '#FFFFFF',
	textShadow: '0px 0px 6px #FFFFFF',
	margin: '2vh',
	bottom: '2%',
	left: '35%',
	position: 'fixed'
}

const player2Score = {
	fontSize: '14vh',
	fontFamily: 'Orbitron',
	fontWeight: 500,
	color: '#FFFFFF',
	textShadow: '0px 0px 6px #FFFFFF',
	margin: '2vh',
	bottom: '2%',
	right: '35%',
	position: 'fixed'
	
}

export interface EndGameData {
	disconnected: boolean,
	winner: 1 | 2 | undefined
}

interface EndGameCardProps {
	endGameDisplay: EndGameData
	setEndGameVisible: booleanSetState 
	setGameActive: booleanSetState 
}


const EndGameCard: FunctionComponent<EndGameCardProps> = ({endGameDisplay, setEndGameVisible, setGameActive}) => {

	const [ player1Name, setPlayer1Name ] = useState<string>('');
	const [ player2Name, setPlayer2Name ] = useState<string>('');
  	const { matchInfos } = useContext(MatchContext);
 	const authToken = getAuthToken();

  	useEffect(() => {
  		const fetchData = async () => {
  			try {
  	    		const response1 = await axios.get(
  	    		  `${process.env.REACT_APP_BACK_HOST}/users/${matchInfos.player1}`, { headers: authToken }
  	    		);
  	    		const response2 = await axios.get(
  	    		  `${process.env.REACT_APP_BACK_HOST}/users/${matchInfos.player2}`, { headers: authToken }
  	    		);

  	    		setPlayer1Name(response1.data.username);
  	    		setPlayer2Name(response2.data.username);
  	    	} catch (error) {
  	    console.error('Error fetching user data:', error);
  	    }
  	};
  	fetchData();
  	}, [matchInfos]);
	
	function endGameContent() {
		if (endGameDisplay.disconnected) {
			return ('The game ended because one of the players disconnected');
		}
		const winner = endGameDisplay.winner == 1 ? player1Name : player2Name;
		return ( winner + ' is the winner!');
	}

	return (
		<Box display="flex" position="absolute" justifyContent="center" alignItems="center" height="100vh" width="100vw" sx={{backgroundColor: 'rgba(0,0,0,0.5)',}}>
			<Card sx={{
					width: 500,
					height: 230,
					background: '#F5F5F5',
					borderRadius: 3,
					boxShadow: 5
					}}>
					<CardContent style={{ paddingLeft: 35, paddingTop: 25 }}>
						<Typography align="left" sx={{ fontSize: 24, fontFamily: 'Orbitron', fontWeight: 500}}>
							{endGameContent()} 
						</Typography>
					</CardContent>
					<CardActions sx={{ justifyContent: 'center', paddingTop: 8 }}>
						<Button 
							variant="contained"
							onClick={() => {setEndGameVisible(false); setGameActive(false);}}
							size="large"
							sx={{ 
								width: 150,
								height: 55,
								background: '#9575CD',
								':hover': { background: '#311B92'},
								textTransform: 'lowercase',
								fontFamily: 'Orbitron',
								fontSize: 20,
								color: '#f5f5f5'
							}}>
							return
						</Button>
					</CardActions>
			</Card>
		</Box>
	);
}

interface gameProps {
	isHost: boolean;
	isSpectator: boolean;
	matchRoom: string;
	standardMode: boolean;
}

const GamePage:  FunctionComponent<gameProps>  = ({isHost, isSpectator, matchRoom, standardMode}) => {
	const [ score, setScore ] = useState<number[]>([0, 0]);
	const [ endGameVisible, setEndGameVisible ] = useState<boolean>(false);
	const [ gameActive, setGameActive ] = useState(true);
	const [ endGameDisplay, setEndGameDisplay ] = useState<EndGameData>({ disconnected:false, winner: 1});
	const [ player1Name, setPlayer1Name ] = useState<string>('');
  	const [ player2Name, setPlayer2Name ] = useState<string>('');
	const { matchInfos } = useContext(MatchContext);
	const authToken = getAuthToken();

  	useEffect(() => {
  		const fetchData = async () => {
  			try {
  	    		const response1 = await axios.get(
  	    		  `${process.env.REACT_APP_BACK_HOST}/users/${matchInfos.player1}`, { headers: authToken }
  	    		);
  	    		const response2 = await axios.get(
  	    		  `${process.env.REACT_APP_BACK_HOST}/users/${matchInfos.player2}`, { headers: authToken }
  	    		);

  	    		setPlayer1Name(response1.data.username);
  	    		setPlayer2Name(response2.data.username);
  	    	} catch (error) {
  	    console.error('Error fetching user data:', error);
  	    }
  	};

  	fetchData();
  	}, [matchInfos]);

	if (gameActive === false) {
		return (<Navigate to='/'/>)
	}

	return (
		<Box position={'relative'}>
			<Box position={'absolute'}>
				<Typography textAlign={'right'} sx={player1NameStyle}>
					{player1Name}
				</Typography>
				<Typography textAlign={'right'} sx={player1Score}>
					{score[0]}
				</Typography>
			</Box>
				<Box display="flex" flexDirection="column" justifyContent="center" position="absolute" alignItems="center" height="90vh" width="100vw">
					<Box position={'absolute'} sx={{
						backgroundColor: 'rgba(255,255,255,0.8)',
						height: '80vh',
						width: '0.5vw',
						boxShadow: '0px 0px 6px #FFFFFF',
						borderRadius: 5,
						alignSelf: 'center'
					}}>
					</Box>
				</Box>
			<Box position={'absolute'}>
				<Typography textAlign={'right'} sx={player2NameStyle}>
					{player2Name}
				</Typography>
				<Typography textAlign={'left'} sx={player2Score}>
					{score[1]}
				</Typography>
			</Box>
			<Box zIndex={-1000} position={'absolute'} height="100vh" width="100vw" sx={{backgroundImage: 'linear-gradient(to right, #212980 , #6f0162)'}}>
				<PhaserGame
					setScore={setScore}
					setEndGameVisible={setEndGameVisible}
					setEndGameDisplay={setEndGameDisplay}
					isHost={isHost}
					isSpectator={isSpectator}
					matchRoom={matchRoom}
					standardMode={standardMode}	
				/>
			</Box>
			{ endGameVisible ? <EndGameCard endGameDisplay={endGameDisplay} setEndGameVisible={setEndGameVisible} setGameActive={setGameActive} /> : null }
		</Box>
	);
}

export default GamePage 
