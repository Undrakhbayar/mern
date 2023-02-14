import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader'
import DashFooter from './DashFooter'
import Navbar from './NavBar'

const DashLayout = () => {
    return (
        <>
            <Navbar />
            <div className="dash-container">
                <Outlet />
            </div>
{/*             <DashFooter /> */}
        </>
    )
}
export default DashLayout