import React, { useEffect, useState } from "react";
import { Drawer } from "@mui/material";
import axios, { AxiosRequestHeaders } from "axios";
import jwt from 'jwt-decode';
import { ProfileInfos } from "./ProfileInfos";
import { Loading } from "./Loading";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

const requestUserProfile = async ({ setUserProfile, userId } : { setUserProfile: React.Dispatch<React.SetStateAction<{[key: string]: any}>>, userId: string }) => {

	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	
	axios.get(`http://localhost:3000/users/${userId}/profile`, { headers: authToken }).then((response) => {
		setUserProfile(response.data);
	}).catch( () => {});
}

export const ProfileCard = ({ setOpenCard, userId } : { setOpenCard: booleanSetState, userId: string })  => {
	const [userProfile, setUserProfile] = useState<{[key: string]: any}>({});

	useEffect(() => {requestUserProfile({setUserProfile, userId})}, []);

	return (
		<>
		<Drawer open={true} transitionDuration={500} onClose={() => setOpenCard(false)} anchor="left" PaperProps={{
            sx: { width: "40%", padding: '10vh'  },
          }}>
			{
				userProfile.image_url ? ( 
				<ProfileInfos userProfile={userProfile}/>
				) : ( 
				<Loading />
				)
			}
		</Drawer>
	  </>
	)
}

export default ProfileCard
