import React, { FunctionComponent, useEffect, useReducer } from "react"
import { Alert, Button, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Radio, RadioGroup, Snackbar, TextField } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import UsersList from "../ControlPanel/UsersList";
import io from 'socket.io-client';

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>

type tokenData = {
	id: string;
}

interface Props {
	channelData: {[key: string]: any};
	setOpenDialog: booleanSetState;
}

const TIME30SEC = 30000;
const TIME2MIN = 120000;
const TIME5MIN = 300000;

const chatSocket = io('/chat');

const DEFAULT_TOAST_MSG = "ooops, something went wrong";

const reducer = (state: {[key: string]: any}, newState : {[key: string]: any}) => {
	return { ...state, ...newState };
}

const TimeRadios = ({setState} : {setState: objectSetState}) => {

	const handleChangeTime = (event: React.ChangeEvent<HTMLInputElement>) => {
		setState({ time: (Number((event.target as HTMLInputElement).value)) });
	};

	return (
		<FormControl>
			<RadioGroup
				row
				aria-labelledby="radio-buttons-group"
				defaultValue={TIME30SEC}
				name="radio-buttons-group"
				onChange={handleChangeTime}
			>
				<FormControlLabel
					value={TIME30SEC}
					control={<Radio />}
					label="30s"
				/>
				<FormControlLabel
					value={TIME2MIN}
					control={<Radio />}
					label="2min"
				/>
				<FormControlLabel
					value={TIME5MIN}
					control={<Radio />}
					label="5min"
				/>
			</RadioGroup>
		</FormControl>
	)
}

export const MuteMembersDialog : FunctionComponent<Props> = ({ setOpenDialog, channelData }) => {
	const [state, setState] = useReducer(reducer, {
		usersName: [],
		users: {},
		loading: true,
		searchQuery: "",
		time: 30000,
		toastError: false,
		toastMessage: DEFAULT_TOAST_MSG,
	});
	
	const tokenData: tokenData = jwt(document.cookie);
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	
	useEffect(() => {
		chatSocket.on('muteUser', (mutedSuccefully) => {
			if (!mutedSuccefully) {
				setState({ toastError: true, toastMessage: DEFAULT_TOAST_MSG });
			} else {
				setOpenDialog(false);
			}
		});
	  }, []);

	const handleQuery = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setState({ searchQuery: event.target.value });
	}

	const keyDownHandler = ( event :  React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleSave();
		}
	}

	const requestUsersData = async () => {
		await axios.get("http://localhost:3000/users/", { headers: authToken }).then((response: {[key: string]: any}) => {
			setState({ users: response.data });
			var usersName: Array<string> = [];
			response.data.forEach((userData: {[key: string]: any}) => {
				if (userData.id !== tokenData.id) {
					usersName.push(userData.username)
				}
			});

			var membersName: Array<string> = [];
			channelData.members.forEach((member: {[key: string]: any}) => {
				if (member.id !== tokenData.id) {
					membersName.push(member.name)
				}
			});

			setState({ usersName: membersName, loading: false });
		})
	}

	const handleSave = () => {
		const selectedUser = state.users.filter((u: {[key: string]: any}) => u.username === state.searchQuery);
		if (!selectedUser.length || !state.usersName.includes(selectedUser[0].username)) {
			setState({ toastError: true, toastMessage: "there's no user in the group with this name :s" });
			return;
		}
		
		const muteEvent = {
			mutedUser: selectedUser[0].id,
			channel: channelData.id,
			duration: state.time,
		}

		chatSocket.emit('muteUser', muteEvent);
	}

	useEffect(() => {requestUsersData()}, []);
	return (
		<>
		<DialogTitle sx={{fontFamily: 'Orbitron'}}>
			mute member
		</DialogTitle>
		<DialogContent>
			<TextField
				autoFocus
				margin="dense"
				id="name"
				type="email"
				fullWidth
				variant="standard"
				value={state.searchQuery}
				onKeyDown={keyDownHandler}
				onChange={handleQuery}
			/>
		</DialogContent>
		{
			!state.loading && 
			<UsersList usersName={state.usersName} searchQuery={state.searchQuery} />
		}
		<DialogActions sx={{justifyContent: 'space-around'}}>
			<TimeRadios setState={setState}/>
			<Button
				onClick={() => setOpenDialog(false)}
				sx={{fontFamily: 'Orbitron'}}
			>
				Cancel
			</Button>
			<Button
				variant="contained"
				onClick={handleSave}
				sx={{fontFamily: 'Orbitron'}}
			>
				Mute
			</Button>
		</DialogActions>
		<Snackbar
			open={state.toastError}
			autoHideDuration={6000}
			onClose={() => setState({ toastError: false })}
			anchorOrigin={{vertical: 'top', horizontal: 'right'}}
		>
			<Alert variant="filled" onClose={() => setState({ toastError: false })} severity="error" sx={{ width: '100%' }}>
				{state.toastMessage}
			</Alert>
		</Snackbar>
	</>
	)
}

export default MuteMembersDialog