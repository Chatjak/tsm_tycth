'use client'
import { useEffect } from 'react';
import {useAppDispatch} from "@/stores/redux/hooks";
import {useGetProfileQuery} from "@/stores/redux/api/authApi";
import {clearUser, setUser} from "@/stores/redux/slices/auth/authSlice";


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
