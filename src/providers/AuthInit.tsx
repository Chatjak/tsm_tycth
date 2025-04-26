'use client'
import { useEffect } from 'react';
import {useAppDispatch} from "@/stores/hooks";
import {useGetProfileQuery} from "@/stores/api/authApi";
import {clearUser, setUser} from "@/stores/slices/auth/authSlice";


const AuthInit = () => {
    const dispatch = useAppDispatch();
    const { data, isSuccess, isError } = useGetProfileQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        if (isSuccess && data) {
            dispatch(setUser(data));
        }

        if (isError) {
            dispatch(clearUser());
        }
    }, [data, isSuccess, isError, dispatch]);

    return null;
};

export default AuthInit;
