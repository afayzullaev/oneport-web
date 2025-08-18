// src/hooks/useDelayedProfileFetch.ts
import { useState, useEffect } from "react";
import { useAppSelector } from "./useAppSelector";
import { useGetMyProfileQuery } from "@/api/profileApi";
import { setProfile, clearProfile } from "@/store/profileSlice";
import { useAppDispatch } from "./useAppDispatch";

export const useDelayedProfileFetch = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.authToken.token);
  const profile = useAppSelector((state) => state.profile.profile);
  const [isLoading, setIsLoading] = useState(false);

  console.log("🔍 useDelayedProfileFetch - token:", !!token);
  console.log("🔍 useDelayedProfileFetch - profile:", !!profile);

  // Always fetch if we have token but no profile data
  const shouldSkipFetch = !token || !!profile;
  console.log("🔍 useDelayedProfileFetch - shouldSkipFetch:", shouldSkipFetch);

  const {
    data: fetchedProfile,
    isLoading: queryLoading,
    error,
  } = useGetMyProfileQuery(undefined, {
    skip: shouldSkipFetch,
  });

  console.log("🔍 useDelayedProfileFetch - fetchedProfile:", !!fetchedProfile);
  console.log("🔍 useDelayedProfileFetch - queryLoading:", queryLoading);
  console.log("🔍 useDelayedProfileFetch - error:", error);

  useEffect(() => {
    console.log("🔍 useEffect triggered");
    if (token && !profile) {
      console.log("🔍 Starting loading...");
      setIsLoading(true);

      const timeoutId = setTimeout(() => {
        console.log("🔍 Timeout reached - fetchedProfile:", !!fetchedProfile);
        if (fetchedProfile) {
          console.log("🔍 Setting profile");
          dispatch(setProfile(fetchedProfile));
        } else {
          console.log("🔍 Clearing profile - no data found");
          dispatch(clearProfile());
        }
        setIsLoading(false);
      }, 3000); // 3 seconds timeout

      return () => clearTimeout(timeoutId);
    } else {
      console.log("🔍 Not loading - conditions not met");
      setIsLoading(false);
    }
  }, [token, fetchedProfile, profile, dispatch]);

  return { isLoading: isLoading || queryLoading };
};
