import React, { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Menu, MenuItem, Tooltip, Typography, Zoom } from "@mui/material"
import { anchorSetState, booleanSetState } from "../../utils/constants";

const menuItemsCSS = {
	color: '#1E1E1E',
	fontFamily: 'Orbitron',
	fontWeight: 600,
	fontSize: '2vh',
}

const EditMenu = ({
	setAnchorEl,
	anchorEl,
	openEditMenu,
	setOpenUsernameDialog,
	setOpenImageDialog,
	setOpenTwoFactorAuthDialog,
} : {
		setAnchorEl: anchorSetState,
		anchorEl: null | HTMLElement ,
		openEditMenu: boolean,
		setOpenUsernameDialog: booleanSetState,
		setOpenImageDialog: booleanSetState,
		setOpenTwoFactorAuthDialog: booleanSetState
	}) => {

	const handleClose = () => {
	  setAnchorEl(null);
	};

	const editUsername = () => {
	  setAnchorEl(null);
	  setOpenUsernameDialog(true);
	};

	const editImage = () => {
	  setAnchorEl(null);
	  setOpenImageDialog(true);
	};

	const configTwoFactorAuth = () => {
	  setAnchorEl(null);
	  setOpenTwoFactorAuthDialog(true);
	};

	return (
		<Menu 
			id="basic-menu"
			anchorEl={anchorEl}
			open={openEditMenu}
			onClose={handleClose}
			MenuListProps={{
				'aria-labelledby': 'basic-button',
			}}
		>
			<MenuItem onClick={editUsername}>
				<Typography sx={menuItemsCSS}>
					username
				</Typography>
			</MenuItem>
			<MenuItem onClick={editImage}>
				<Typography sx={menuItemsCSS}>
					image
				</Typography>
			</MenuItem>
			<MenuItem onClick={configTwoFactorAuth}>
				<Typography sx={menuItemsCSS}>
					two-factor authentication
				</Typography>
			</MenuItem>
		</Menu>
	)
}


const EditButton = ({ setAnchorEl, openEditMenu } : { setAnchorEl: anchorSetState, openEditMenu: boolean }) => {
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	return (
		<Tooltip title='edit profile' placement='right' arrow TransitionComponent={Zoom}>
			<IconButton 
				sx={{ alignSelf: 'center'}}
				id="basic-button"
				aria-controls={openEditMenu ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={openEditMenu ? 'true' : undefined}
				onClick={handleClick}
			>
				<EditIcon sx={{ color: '#311B92' }}/>
			</IconButton>
		</Tooltip>
	)
}

export const EditProfile = ({
	setOpenUsernameDialog,
	setOpenImageDialog,
	setOpenTwoFactorAuthDialog,
} : {
	setOpenUsernameDialog: booleanSetState,
	setOpenImageDialog: booleanSetState,
	setOpenTwoFactorAuthDialog: booleanSetState,
}) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const openEditMenu = Boolean(anchorEl);

	return (
		<>
			<EditButton setAnchorEl={setAnchorEl} openEditMenu={openEditMenu} />
			<EditMenu
				setAnchorEl={setAnchorEl}
				anchorEl={anchorEl}
				openEditMenu={openEditMenu}
				setOpenUsernameDialog={setOpenUsernameDialog}
				setOpenImageDialog={setOpenImageDialog}
				setOpenTwoFactorAuthDialog={setOpenTwoFactorAuthDialog}
			/>
		</>
	)
}

export default EditProfile 
