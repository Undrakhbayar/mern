import NewPackageeForm from './NewPackageeForm'
import { useGetUsersQuery } from '../users/usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'

const NewPackagee = () => {
    //useTitle('POST: шуудан бүртгэх')

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        }),
    })

    if (!users?.length) return <PulseLoader color={"#FFF"} />

    const content = <NewPackageeForm users={users} />

    return content
}
export default NewPackagee