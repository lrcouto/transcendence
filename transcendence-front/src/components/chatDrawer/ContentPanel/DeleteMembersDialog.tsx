import React, { FunctionComponent, useEffect, useReducer } from "react"
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import UsersList from "../ControlPanel/UsersList";
import ErrorToast from "../../utils/ErrorToast";
import { authToken, booleanSetState, DEFAULT_TOAST_MSG, objectSetState, tokenData } from "../../utils/constants";

interface Props {
	channelData: {[key: string]: any};
	setOpenDialog: booleanSetState;
	setMembersMockData: objectSetState;
}

const reducer = (state: {[key: string]: any}, newState : {[key: string]: any}) => {
	return { ...state, ...newState };
}

export const DeleteMembersDialog : FunctionComponent<Props> = ({ setOpenDialog, setMembersMockData, channelData }) => {
	const [state, setState] = useReducer(reducer, {
		usersName: [],
		users: {},
		loading: true,
		searchQuery: "",
		toastError: false,
		toastMessage: DEFAULT_TOAST_MSG,
	});
	
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
		}).catch( () => {
			setState({ toastError: true, toastMessage: DEFAULT_TOAST_MSG });
		});
	}

	const handleSave = () => {
		const selectedUser = state.users.filter((u: {[key: string]: any}) => u.username === state.searchQuery);
		
		if (!selectedUser.length || !state.usersName.includes(selectedUser.name)) {
			setState({ toastError: true, toastMessage: "there's no user in the group with this name :s" });
			return;
		}
		
		axios.delete(`http://localhost:3000/channels/${channelData.id}/members/${selectedUser[0].id}`, { headers: authToken }).then( () => {
			setMembersMockData(selectedUser);
			setOpenDialog(false);
		}).catch( () => {
			setState({ toastError: true, toastMessage: DEFAULT_TOAST_MSG });
		});
	}

	useEffect(() => {requestUsersData()}, []);

	return (
		<>
		<DialogTitle sx={{fontFamily: 'Orbitron'}}>
			kick members
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
		<DialogActions>
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
			Kick
		</Button>
		</DialogActions>
		<ErrorToast state={state} setState={setState}/>
	</>
	)
}

export default DeleteMembersDialog
