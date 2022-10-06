import React, { FunctionComponent, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip, Typography, Zoom } from "@mui/material"
import axios, { AxiosRequestHeaders } from "axios";
import jwt from 'jwt-decode';

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

type tokenData = {
	id: string;
}

interface Props {
    setOpenCard: booleanSetState;
	userData: {[key: string]: any};
}

const AVOCADO_TEMP = 'https://images.vexels.com/media/users/3/185791/isolated/preview/27c69d1413163918103a032d4951213e-abacate-kawaii-winking.png'

const defineColor = (status: string) => {
	switch( status ) {
		case 'online':
			return '#4CAF50';
		case 'offline':
			return '#1E1E1E';
		case 'away':
			return '#F39810';
		case 'in_game':
			return '#9575CD';
		default: return '#FF0000';
	}
}

const UserImage = ({imageUrl} : {imageUrl: string}) => {
	if (imageUrl == null) {
		imageUrl = AVOCADO_TEMP
	}
	return (
		<Box component='img' src={imageUrl} alt='Profile picture'
				sx={{
					height: '5vh',
					width: '5vh',
					borderRadius: 2,
					boxShadow: 1
				}}>
		</Box>
	)
}

const UserName = ({userName} : {userName : string}) => {
	return (
		<Typography sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '4vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
					{userName}
		</Typography>
	)
}

const UserStatus = ({statusColor} : {statusColor : string}) => {
	return (
		<Box
			sx={{ 
				backgroundColor: statusColor,
				height: '3vh',
				width: '3vh',
				borderRadius: 50,
				boxShadow: 1}}>
		</Box>
	)
}

const EditButton = ({ setOpen } : { setOpen : booleanSetState }) => {
	return (
		<Tooltip title='edit profile' placement='right' arrow TransitionComponent={Zoom}>
			<IconButton sx={{ alignSelf: 'flex-start'}} onClick={() => setOpen(true)}>
				<EditIcon sx={{ color: '#311B92' }}/>
			</IconButton>
		</Tooltip>
	)
}

const UpdateProfileDialog = ({ setOpen } : { setOpen : booleanSetState }) => {
	const [username, setUsername] = useState("");

	const handleChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	}

	const handleSave = () => {
		const tokenData: tokenData = jwt(document.cookie);
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};

		axios.patch(`http://localhost:3000/users/${tokenData.id}`, { "username": username }, { headers: authToken })
		setOpen(false);
	}

	return (
		<>
			<DialogTitle sx={{fontFamily: 'Orbitron'}}>
				Edit Profile
			</DialogTitle>
			<DialogContent>
			<TextField
				autoFocus
				margin="dense"
				id="name"
				label="username"
				type="email"
				fullWidth
				variant="standard"
				value={username}
				onChange={handleChange}
			/>
			</DialogContent>
			<DialogActions>
			<Button
				onClick={() => setOpen(false)}
				sx={{fontFamily: 'Orbitron'}}
			>
				Cancel
			</Button>
			<Button
				onClick={handleSave}
				sx={{fontFamily: 'Orbitron'}}
			>
				Save
			</Button>
			</DialogActions>
		</>
	)
}

export const ProfileInfo : FunctionComponent<Props> = ({ setOpenCard, userData }) => {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleOpenCard = () => {
		setOpenCard(true)
	}
	
	return(
		<Box display='flex' flexDirection='row' alignItems="center">
			<Button onClick={handleOpenCard} sx={{textTransform: 'lowercase',}}>
				<UserImage imageUrl={userData.image_url}/>
				<UserName userName={userData.username}/>
				<UserStatus statusColor={defineColor(userData.status)}/>
			</Button>
			<EditButton setOpen={setOpen}/>
			<Dialog open={open} fullWidth maxWidth="sm" onClose={handleClose}>
				<UpdateProfileDialog setOpen={setOpen}/>
			</Dialog>
		</Box>
	)
}

export default ProfileInfo
