import { store } from '../../app/store'
import { notesApiSlice } from '../notes/notesApiSlice'
import { packageesApiSlice } from '../packagees/packageesApiSlice'
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {

    useEffect(() => {
        store.dispatch(notesApiSlice.util.prefetch('getNotes', 'notesList', { force: true }))
        store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
        store.dispatch(packageesApiSlice.util.prefetch('getPackagees', 'packageesList', { force: true }))
    }, [])

    return <Outlet />
}
export default Prefetch
