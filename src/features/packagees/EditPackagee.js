import { useParams } from 'react-router-dom'
import EditPackageeForm from './EditPackageeForm'
import { useGetPackageesQuery } from './packageesApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const EditPackagee = () => {
    useTitle('techPackagees: Edit Packagee')

    const { id } = useParams()

    const { username, isManager, isAdmin } = useAuth()

    const { packagee } = useGetPackageesQuery("packageesList", {
        selectFromResult: ({ data }) => ({
            packagee: data?.entities[id]
        }),
    })

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        }),
    })

    if (!packagee || !users?.length) return <PulseLoader color={"#FFF"} />


    if (!isManager && !isAdmin) {
        if (packagee.username !== username) {
            return <p className="errmsg">No access</p>
        }
    }

    const content = <EditPackageeForm packagee={packagee} users={users} />

    return content
}
export default EditPackagee