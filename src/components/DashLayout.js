import { Outlet } from 'react-router-dom'
import Navbar from './NavBar.js'

const DashLayout = () => {
    return (
        <>
            <Navbar />
            <div className="dash-container">
                <Outlet />
            </div>
        </>
    )
}
export default DashLayout