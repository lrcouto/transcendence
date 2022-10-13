import React, { FunctionComponent } from "react";
import { AppBar, Stack } from "@mui/material"
import ProfileInfo from "./profile-info/ProfileInfo";
import FriendshipInfo from "./FriendshipInfo";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
    setOpenDrawer: booleanSetState;
    setOpenCard: booleanSetState;
	numberOfFriends: number;
}

export const Header : FunctionComponent<Props> = ({ setOpenDrawer, setOpenCard, numberOfFriends }) => {
	return (
	<AppBar position='relative' sx={{ height: '7vh', width: '100vw', background: '#F5F5F5', zIndex: 1300}}>
		<Stack display='flex' flexDirection='row' alignItems="center" justifyContent="space-between" sx={{ paddingTop: '0.5vh', paddingLeft: '1.5vh', paddingBottom: '2vh' }}>
			<ProfileInfo setOpenCard={setOpenCard} />
			<FriendshipInfo setOpenDrawer={setOpenDrawer} numberOfFriends={numberOfFriends} />
		</Stack>
	</AppBar>
	)
}

export default Header
