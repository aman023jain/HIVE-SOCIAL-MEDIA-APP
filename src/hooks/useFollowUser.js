import  { useEffect, useState } from 'react'
import useAuthStore from '../store/authStore'
import useUserProfileStore from '../store/userProfileStore'
import useShowToast from './useShowToast'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { firestore } from '../firebase/firebase'

const useFollowUser = (userId) => {
    const [isUpdating,setIsUpdating]=useState(false)
    const [isFollowing,setIsFollowing]=useState(false)

    const authUser=useAuthStore((state)=>state.user);         //-----|--> we are calling them individually because we r giving them diffrent name then whats definedin that hook
    const setAuthUser = useAuthStore((state)=>state.setUser); //-----|    other other wise we could have called them like: {user,setUser}=useAuthStore()

    const {userProfile,setUserProfile}=useUserProfileStore()
    const showToast=useShowToast()


    const handleFollowUser= async()=> {
        setIsUpdating(true)
        try {
            const currentUserRef = doc(firestore,"users",authUser.uid)
            const userToFollowOrUnfollowRef= doc(firestore,"users",userId)
            // update  curr User's following array
            await updateDoc(currentUserRef,{
                following: isFollowing? arrayRemove(userId) : arrayUnion(userId)
            })
            //update followers array of other user
            await updateDoc(userToFollowOrUnfollowRef,{
                followers: isFollowing? arrayRemove(authUser.uid) : arrayUnion(authUser.uid)
            })

            // now update these in UI, use setAuthUser and setUserProfile
            if(isFollowing){
                //means we want to unfollow
                setAuthUser({
                    ...authUser,
                    following: authUser.following.filter(uid=> uid!==userId)   //removing userId from following array
                })
                if(userProfile)    // if userProfile exists then only do this, bcoz we also gonna use this hook in home page and there will be no state as userProfile -this check will save as from error 
                    setUserProfile({
                        ...userProfile,
                        followers: userProfile.followers.filter(uid=> uid!==authUser.uid)   //removing auth user from folowers of other user
                    })
                //update local storage also to be in sync
                localStorage.setItem("user-info",JSON.stringify({
                    ...authUser,
                    following: authUser.following.filter(uid=> uid!==userId)   //removing userId from following array
                }))
                setIsFollowing(false)
            }else{
                //follow
                setAuthUser({
                    ...authUser,
                    following: [...authUser.following,userId]   //adding userId to following array
                })
                if(userProfile) // if userProfile exists then only do this, bcoz we also gonna use this hook in homepage and there will be no state as userProfile -this check will save as from error 
                    setUserProfile({
                        ...userProfile,
                        followers: [...userProfile.followers,authUser.uid]   //adding auth user to followers of other user
                    })
                localStorage.setItem("user-info",JSON.stringify({
                    ...authUser,
                    following: [...authUser.following,userId]   //adding userId to following array
                }))
                setIsFollowing(true)
            }
            
        } catch (error) {
            showToast("Error",error.message,"error")
            
        }finally{
            setIsUpdating(false)
        }
    }

    useEffect(()=>{
        if(authUser){
            const isFollowing=authUser.following.includes(userId)  // alredy following
            setIsFollowing(isFollowing)
        }
    },[authUser,userId])

    return {isUpdating,isFollowing,handleFollowUser}
}

export default useFollowUser
