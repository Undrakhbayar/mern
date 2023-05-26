import { useGetPackageesQuery } from "./packageesApiSlice"
import Packagee from "./Packagee"
import useAuth from "../../hooks/useAuth"
import { useNavigate  } from 'react-router-dom'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
const PackageesList = () => {

    const { username, isManager, isAdmin } = useAuth()

    const {
        data: packagees,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPackageesQuery('packageesList', {
        pollingInterval: 150000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const navigate = useNavigate()

    const onNewPackageeClicked = () => navigate('/dash/packagees/new')
    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids, entities } = packagees
        
        const arr = Object.values(entities);
        console.log(entities);
        console.log(arr);
        let filteredIds
        if (isManager || isAdmin) {
            filteredIds = [...ids]
        } else {
            filteredIds = ids.filter(packageeId => entities[packageeId].username === username)
        }

        const tableContent = ids?.length && filteredIds.map(packageeId => <Packagee key={packageeId} packageeId={packageeId} />)
        let newPackageeButton = null
        newPackageeButton = (
            <button
                className="text-button"
                title="New Packagee"
                onClick={onNewPackageeClicked}
            >
                Нэмэх
            </button>
        )

        let buttonContent
        if (isLoading) {
            buttonContent = <p>Logging Out...</p>
        } else {
            buttonContent = (
                <>
                    {newPackageeButton}
                </>
            )
        }
        content = (
            <div>
                {buttonContent}
{/*                 <table className="table table--packagees">
                    <thead className="table__thead">
                        <tr>
                            <th scope="col" className="table__th packagee__created">Created</th>
                            <th scope="col" className="table__th packagee__updated">Updated</th>
                            <th scope="col" className="table__th packagee__blNo">BlNo</th>
                            <th scope="col" className="table__th packagee__houseSeq">HouseSeq</th>
                            <th scope="col" className="table__th packagee__userName">UserName</th>
                            <th scope="col" className="table__th packagee__edit">Function</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent}
                    </tbody>
                </table> */}
                    <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Dessert (100g serving)</TableCell>
                            <TableCell align="right">Calories</TableCell>
                            <TableCell align="right">Fat&nbsp;(g)</TableCell>
                            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                            <TableCell align="right">Protein&nbsp;(g)</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {arr.map((row) => (
                            <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.blNo}</TableCell>
                            <TableCell align="right">23</TableCell>
                            <TableCell align="right">4</TableCell>
                            <TableCell align="right">1</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
            </div>
        )
    }

    return content
}
export default PackageesList