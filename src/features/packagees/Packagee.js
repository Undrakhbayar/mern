import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { useGetPackageesQuery } from './packageesApiSlice'
import { memo } from 'react'

const Packagee = ({ packageeId }) => {

    const { packagee } = useGetPackageesQuery("packageesList", {
        selectFromResult: ({ data }) => ({
            packagee: data?.entities[packageeId]
        }),
    })

    const navigate = useNavigate()

    if (packagee) {
        const created = new Date(packagee.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const updated = new Date(packagee.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const handleEdit = () => navigate(`/dash/packagees/${packageeId}`)

        return (
            <tr className="table__row">
{/*                 <td className="table__cell packagee__status">
                    {packagee.completed
                        ? <span className="packagee__status--completed">Completed</span>
                        : <span className="packagee__status--open">Open</span>
                    }
                </td> */}
                <td className="table__cell packagee__created">{created}</td>
                <td className="table__cell packagee__updated">{updated}</td>
                <td className="table__cell packagee__blNo">{packagee.blNo}</td>
                <td className="table__cell packagee__houseSeq">{packagee.houseSeq}</td>
                <td className="table__cell packagee__username">{packagee.username}</td>

                <td className="table__cell">
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )

    } else return null
}

const memoizedPackagee = memo(Packagee)

export default memoizedPackagee