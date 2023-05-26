import { store } from '../../app/store'
import { mailsApiSlice } from '../mails/mailsApiSlice'
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {

    useEffect(() => {
        store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
        store.dispatch(mailsApiSlice.util.prefetch('getMails', 'mailsList', { force: true }))
    }, [])

    return <Outlet />
}
export default Prefetch
